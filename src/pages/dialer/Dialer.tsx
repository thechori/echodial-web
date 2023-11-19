import { useEffect, useState } from "react";
import { Call, Device } from "@twilio/voice-sdk";
import { ActionIcon, Card, Text, Tooltip } from "@mantine/core";
import { Box, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
//
import {
  useAddCallMutation,
  useEndCallMutation,
  useUpdateCallViaIdMutation,
} from "../../services/call";
import apiService from "../../services/api";
import { selectJwtDecoded } from "../../store/user/slice";
import { extractErrorMessage } from "../../utils/error";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setError,
  setDevice,
  setCall,
  setCurrentCallId,
  setToken,
  setCurrentDialAttempts,
  setRequestAction,
  setConnectedAt,
  setIsDialing,
  setDialQueueIndex,
  setShowOptions,
  setIsDialerOpen,
  setStatus,
} from "../../store/dialer/slice";
import { DialerStyled, DialerStatus } from "./Dialer.styles";
import { Call as TCall } from "../../types";
import DialerQueue from "./DialerQueue";
import CallerIdSelect from "./CallerIdSelect";
import {
  IconAdjustments,
  IconChevronDown,
  IconChevronUp,
  IconPlayerSkipForwardFilled,
} from "@tabler/icons-react";
import { DialerLeadDetail } from "./DialerLeadDetail";
import { dialStateInstance } from "./DialState.class";
import { useDeductTrialCreditMutation } from "../../services/trial-credit";
import { DialerPrimaryButton } from "./DialerPrimaryButton";
import phoneFormatter from "../../utils/phone-formatter";

function Dialer() {
  const dispatch = useAppDispatch();
  const [starting, setStarting] = useState(false);

  const jwtDecoded = useAppSelector(selectJwtDecoded);
  const {
    requestAction,
    call,
    device,
    token,
    fromNumber,
    dialQueue,
    isDialerOpen,
    error,
    status,
  } = useAppSelector((state) => state.dialer);
  const { subscriptionActive } = useAppSelector((state) => state.user);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();
  const [deductTrialCredit] = useDeductTrialCreditMutation();

  async function initializeDevice() {
    dispatch(setError(""));

    if (!dialStateInstance.token) {
      dispatch(setError("No token found"));
      return;
    }

    const device = new Device(dialStateInstance.token, {
      // @ts-ignore
      codecPreferences: ["opus", "pcmu"],
    });

    device.on("incoming", () => {
      notifications.show({
        title: "Incoming call",
        message: "Someone is calling your number",
      });
    });

    // Device must be registered in order to receive incoming calls
    device.register();

    dialStateInstance.device = device;
    dispatch(setDevice(device));
  }

  // TODO: Reevaluate for performance enhancements
  // Consider: lags that happens when opening websocket
  // Consider: lag to init start up client before call (even more delay before call - users not happy)
  async function fetchToken() {
    try {
      const { data } = await apiService("/dialer/token");
      const token = data.token;
      dispatch(setToken(token));
      dialStateInstance.token = token;
      initializeDevice();
    } catch (err) {
      dispatch(
        setError(
          "An error occurred. See your browser console for more information."
        )
      );
    }
  }

  // Begin calling the current index
  async function startCall() {
    // Clear error
    dialStateInstance.error = "";
    dispatch(setError(dialStateInstance.error));

    // Check for device
    if (!dialStateInstance.device) {
      dispatch(setError("No device initialized"));
      return;
    }

    // Check for items in queue
    if (dialQueue.length === 0) {
      dispatch(
        setError(
          "No leads in call queue, be sure to add some before running the dialer"
        )
      );
      return;
    }

    // Initialize index if none provided AND current index is not set
    if (dialStateInstance.dialQueueIndex === null) {
      dialStateInstance.dialQueueIndex = 0;
    }

    dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));
    dialStateInstance.isDialing = true;
    dispatch(setIsDialing(dialStateInstance.isDialing));

    // Initialize or increment current dial attempts
    if (dialStateInstance.currentDialAttempts === null) {
      dialStateInstance.currentDialAttempts = 0;
    } else {
      dialStateInstance.currentDialAttempts =
        dialStateInstance.currentDialAttempts + 1;
    }

    dispatch(setCurrentDialAttempts(dialStateInstance.currentDialAttempts));

    const params = {
      To: dialQueue[dialStateInstance.dialQueueIndex].phone,
      From: fromNumber,
      user_id: jwtDecoded?.id || null,
    };

    // Start Call
    const c = (await device.connect({ params })) as Call;

    // Occurs when:
    // - Call initializes (initially returns as `false`)
    // - Call connects and begins ringing
    // Note: Using `once` instead to avoid multiple calls, this poses a risk because we are now
    // assuming that ringing will get to `true` since the initial (and only returned value now)
    // is `false` ... address this in  the future if issues occur
    c.once("ringing", async () => {
      dialStateInstance.status = Call.State.Ringing;
      dispatch(setStatus(dialStateInstance.status));

      // "currentCallId exists, skipping creation of new Call record" ??
      if (dialStateInstance.currentCallId !== null) {
        return;
      }

      if (dialStateInstance.dialQueueIndex === null) {
        return;
      }

      const newCall: Partial<TCall> = {
        user_id: jwtDecoded?.id,
        lead_id: dialQueue[dialStateInstance.dialQueueIndex].id,
        from_number: fromNumber,
        to_number:
          dialQueue[dialStateInstance.dialQueueIndex].phone || undefined,
      };

      try {
        // Create Call record
        const newCallRecord = await addCall(newCall).unwrap();
        dialStateInstance.currentCallId = newCallRecord.id;
        dispatch(setCurrentCallId(dialStateInstance.currentCallId));

        // Deduct (1) credit from trial
        await deductTrialCredit(1);
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    });

    // Occurs when:
    // - Lead answers the call
    // - Call goes to voicemail
    c.on("accept", async (call: Call) => {
      dialStateInstance.status = call.status();
      dispatch(setStatus(dialStateInstance.status));

      const now = new Date();
      dialStateInstance.connectedAt = now;
      dispatch(setConnectedAt(dialStateInstance.connectedAt));

      // Begin timer to track duration of call
      startCallTimer();

      try {
        if (dialStateInstance.currentCallId === null) {
          throw Error("No call ID found");
        }

        await updateCallViaId({
          id: dialStateInstance.currentCallId,
          twilio_call_sid: call.parameters["CallSid"],
          was_answered: true,
        }).unwrap();
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    });

    // Occurs when:
    // - Call ends (user hangs up, lead hangs up, voicemail ends)
    c.on("disconnect", async () => {
      dialStateInstance.status = Call.State.Closed;
      dispatch(setStatus(dialStateInstance.status));
      dispatch(setRequestAction("stopCall"));
    });

    // Occurs when:
    // - An error is thrown
    c.on("error", async (e: unknown) => {
      dialStateInstance.status = Call.State.Closed;
      dispatch(setStatus(dialStateInstance.status));
      dispatch(setRequestAction("stopCall"));

      const errorMessage = extractErrorMessage(e);
      notifications.show({
        title: "Call error",
        message: errorMessage,
      });
      dialStateInstance.error = errorMessage;
      dispatch(setError(dialStateInstance.error));
    });

    dialStateInstance.call = c;
    dispatch(setCall(dialStateInstance.call));
  }

  // TODO: consider setting a variable like `callConnectedAt` and generating a new Date object to use
  // with date-fns to properly track the difference between the two dates -- this seems MUCH more accurate
  // because the current increment of a "second" ever 1000ms seems way too fast...
  //
  // Call timer tracks the current call duration to show the user how long they've been on the call for
  async function startCallTimer() {
    const timer = setInterval(async () => {
      console.info("1 sec has passed");
    }, 1000);

    dialStateInstance.currentCallTimer = timer;
  }

  function stopCallTimer() {
    clearInterval(dialStateInstance.currentCallTimer);
    dialStateInstance.currentCallTimer = null;
  }

  function requestStopDialer() {
    dispatch(setRequestAction("stopDialing"));
  }

  // Invoked when:
  // - Next arrow is click
  async function continueToNextLead() {
    // Stop call
    await stopCall();

    // Check for existing index before proceeding
    if (dialStateInstance.dialQueueIndex === dialQueue.length - 1) {
      notifications.show({
        message: "You've made it through all of your leads! Great job 🎉",
      });

      requestStopDialer();
      dialStateInstance.dialQueueIndex = null;
      dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));
      return;
    }

    // Check for null dial index
    if (dialStateInstance.dialQueueIndex === null) {
      notifications.show({
        message:
          "Dial index is null. Try selecting a different lead and trying again",
      });
      return;
    }

    // Point to the next Lead in the queue
    const value = dialStateInstance.dialQueueIndex + 1;
    dialStateInstance.dialQueueIndex = value;
    dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));

    // Reset attempt count
    dialStateInstance.currentDialAttempts = 0;
    dispatch(setCurrentDialAttempts(dialStateInstance.currentDialAttempts));

    // Check for null active index
    if (dialStateInstance.dialQueueIndex === null) {
      return console.error("No active contact index found");
    }

    // We're safe to proceed
    startCall();
  }

  // Invoked when:
  // - Stop button is clicked
  // - An error occurs
  // - Call disconnects ?
  async function stopCall() {
    // Bug: no call is found when this gets invoked
    if (dialStateInstance.call) {
      dialStateInstance.call.disconnect();
    }

    // Stop timer
    if (dialStateInstance.currentCallTimer) {
      stopCallTimer();
    }

    if (dialStateInstance.currentCallId === null) {
      console.info("No Call ID found");
    } else {
      try {
        await endCallViaId(dialStateInstance.currentCallId).unwrap();
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    }

    if (dialStateInstance.currentCallId !== null) {
      try {
        // await updateCallViaId({
        //   id: currentCallId,
        //   status: didErrorOccur ? "Error" : "Success",
        // }).unwrap();
        await endCallViaId;
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    }

    resetDialerState();
  }

  function resetDialerState() {
    dialStateInstance.isDialing = false;
    dispatch(setIsDialing(dialStateInstance.isDialing));
    dialStateInstance.call = null;
    dispatch(setCall(dialStateInstance.call));
    dialStateInstance.currentCallId = null;
    dispatch(setCurrentCallId(dialStateInstance.currentCallId));
    dialStateInstance.connectedAt = null;
    dispatch(setConnectedAt(dialStateInstance.connectedAt));
    dialStateInstance.currentCallTimer = null;
  }

  async function resetDialer() {
    // End the call
    stopCall();

    // Additional state cleanup
    dialStateInstance.error = "";
    dispatch(setError(dialStateInstance.error));
    dialStateInstance.currentDialAttempts = 0;
    dispatch(setCurrentDialAttempts(dialStateInstance.currentDialAttempts));
  }

  async function startDialing() {
    dialStateInstance.isDialing = true;
    dispatch(setIsDialing(dialStateInstance.isDialing));
  }

  async function stopDialing() {
    dialStateInstance.isDialing = false;
    dispatch(setIsDialing(dialStateInstance.isDialing));
    await stopCall();
  }

  async function handleError() {
    stopDialing();
  }

  const openDialerOptions = () => {
    dispatch(setShowOptions(true));
  };

  //////////////////////// HOOKS ///////////////////////////

  // Get token
  // Create device instance
  useEffect(() => {
    if (starting) {
      return;
    }

    setStarting(true);

    // No token found, get it
    if (!token) {
      fetchToken();
    }
  }, [token, starting, setStarting]);

  // Handle request actions
  // TODO: reconsider if this is necessary now that we have the DialState class singleton (ftw)
  useEffect(() => {
    if (!requestAction) {
      return;
    }

    switch (requestAction) {
      case "startDialing": {
        startDialing();
        dispatch(setRequestAction(null));
        break;
      }

      case "startCall": {
        startCall();
        dispatch(setRequestAction(null));
        break;
      }

      case "stopCall": {
        stopCall();
        dispatch(setRequestAction(null));
        break;
      }

      case "stopDialing": {
        stopDialing();
        dispatch(setRequestAction(null));
        break;
      }

      case "resetDialer": {
        resetDialer();
        dispatch(setRequestAction(null));
        break;
      }

      case "error": {
        handleError();
        dispatch(setRequestAction(null));
        break;
      }

      default: {
        dispatch(setRequestAction(null));
      }
    }
  }, [requestAction, call, dispatch, resetDialer, stopCall, stopDialing]);

  if (dialQueue.length === 0) return;

  // Name, phone
  let name = "";
  let phone = "";

  if (dialQueue && dialStateInstance.dialQueueIndex !== null) {
    const lead = dialQueue[dialStateInstance.dialQueueIndex];
    name = `${lead.first_name || ""} ${lead.last_name || ""}`;
    phone = phoneFormatter(lead.phone) || "";
  }

  return (
    <DialerStyled $visible={isDialerOpen}>
      <Box className="controls">
        <Flex align="flex-start" justify="space-between">
          <Card
            withBorder
            pt="0.5rem"
            style={{
              overflow: "visible",
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Flex justify="flex-start" align="center">
              <Flex align="center">
                <DialerPrimaryButton />

                <Tooltip label="Skip to next Lead">
                  <ActionIcon
                    size="lg"
                    disabled={!subscriptionActive}
                    onClick={continueToNextLead}
                    mx={4}
                  >
                    <IconPlayerSkipForwardFilled />
                  </ActionIcon>
                </Tooltip>

                <DialerStatus $visible={status === Call.State.Open}>
                  <Text size="sm" fw={500} className="duration">
                    {"00:00"}
                  </Text>
                </DialerStatus>

                <Box>
                  <Text fw={500} lh="1.1rem">
                    {name}
                  </Text>
                  <Text size="sm" lh="1.1rem">
                    {phone}
                  </Text>
                </Box>
              </Flex>
            </Flex>

            <Flex align="center" h={60}>
              <Tooltip
                openDelay={500}
                position="bottom"
                label="The selected phone number is what we will use to call your
                      leads. This number will appear as your caller ID on the lead's phone."
              >
                <div>
                  <CallerIdSelect pr="xs" w={180} />
                </div>
              </Tooltip>

              <Tooltip label="Open dialer settings" openDelay={500}>
                <ActionIcon
                  variant="outline"
                  onClick={openDialerOptions}
                  size="lg"
                >
                  <IconAdjustments />
                </ActionIcon>
              </Tooltip>

              <Box ml="xs">
                <Tooltip label="Toggle visibility of the dialer">
                  {isDialerOpen ? (
                    <ActionIcon
                      variant="outline"
                      size="lg"
                      onClick={() => dispatch(setIsDialerOpen(false))}
                    >
                      <IconChevronDown />
                    </ActionIcon>
                  ) : (
                    <ActionIcon
                      variant="outline"
                      size="lg"
                      onClick={() => dispatch(setIsDialerOpen(true))}
                    >
                      <IconChevronUp />
                    </ActionIcon>
                  )}
                </Tooltip>
              </Box>
            </Flex>
          </Card>
        </Flex>

        <Flex className="split">
          <Box m="md">
            <DialerQueue />

            {error && (
              <Card withBorder mt="md">
                <Text>Error</Text>
                <Text color="red">{error}</Text>
              </Card>
            )}
          </Box>
          <Box m="md">
            <DialerLeadDetail />
          </Box>
        </Flex>
      </Box>
    </DialerStyled>
  );
}

export default Dialer;
