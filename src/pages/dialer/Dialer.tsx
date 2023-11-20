import { useCallback, useEffect, useState } from "react";
import { Call, Device } from "@twilio/voice-sdk";
import { ActionIcon, Card, Text, Tooltip } from "@mantine/core";
import { Box, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { MdOutlineTune, MdExpandLess, MdExpandMore } from "react-icons/md";
import { IconPlayerSkipForwardFilled } from "@tabler/icons-react";
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
  setDialQueueIndex,
  setShowOptions,
  setIsDialerOpen,
  setStatus,
} from "../../store/dialer/slice";
import { DialerStyled, DialerStatus } from "./Dialer.styles";
import { Call as TCall } from "../../types";
import DialerQueue from "./DialerQueue";
import CallerIdSelect from "./CallerIdSelect";
import { DialerLeadDetail } from "./DialerLeadDetail";
import { dialStateInstance } from "./DialState.class";
import { useDeductTrialCreditMutation } from "../../services/trial-credit";
import { DialerPrimaryButton } from "./DialerPrimaryButton";
import phoneFormatter from "../../utils/phone-formatter";
import { Duration, intervalToDuration } from "date-fns";

function Dialer() {
  const dispatch = useAppDispatch();
  const [starting, setStarting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("0:00:00");

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
    connectedAt,
  } = useAppSelector((state) => state.dialer);
  const { subscriptionActive } = useAppSelector((state) => state.user);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();
  const [deductTrialCredit] = useDeductTrialCreditMutation();

  const initializeDevice = useCallback(async () => {
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
  }, [dispatch]);

  // TODO: Reevaluate for performance enhancements
  // Consider: lags that happens when opening websocket
  // Consider: lag to init start up client before call (even more delay before call - users not happy)
  const fetchToken = useCallback(async () => {
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
  }, [dispatch, initializeDevice]);

  // Begin calling the current index
  const startCall = useCallback(async () => {
    console.log("startCall");

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
      dialStateInstance.error =
        "No leads in call queue, be sure to add some before running the dialer";
      dispatch(setError(dialStateInstance.error));
      return;
    }

    // Initialize index if none provided AND current index is not set
    if (dialStateInstance.dialQueueIndex === null) {
      dialStateInstance.dialQueueIndex = 0;
    }

    dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));

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

    dialStateInstance.status = Call.State.Connecting;
    dispatch(setStatus(dialStateInstance.status));

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

    return true;
  }, [
    addCall,
    deductTrialCredit,
    device,
    dialQueue,
    dispatch,
    fromNumber,
    jwtDecoded?.id,
    updateCallViaId,
  ]);

  const resetDialerState = useCallback(() => {
    console.log("resetDialerState");
    dialStateInstance.call = null;
    dispatch(setCall(dialStateInstance.call));
    dialStateInstance.currentCallId = null;
    dispatch(setCurrentCallId(dialStateInstance.currentCallId));
  }, [dispatch]);

  // Invoked when:
  // - Next arrow is click
  async function skipToNextLead() {
    console.log("skipToNextLead.start");

    // Stop call
    await stopCall();

    // Check for existing index before proceeding
    if (dialStateInstance.dialQueueIndex === dialQueue.length - 1) {
      notifications.show({
        message: "You've made it through all of your leads! Great job 🎉",
      });

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

    console.log("skipToNextLead.end");

    // We're safe to proceed
    startCall();
  }

  // Invoked when:
  // - Stop button is clicked
  // - An error occurs
  // - Call disconnects
  const stopCall = useCallback(async () => {
    dialStateInstance.connectedAt = null;
    dispatch(setConnectedAt(dialStateInstance.connectedAt));

    // Bug: no call is found when this gets invoked
    if (dialStateInstance.call) {
      dialStateInstance.call.disconnect();
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
        await endCallViaId;
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    }
    console.log("end of stopCall");
    resetDialerState();

    return true;
  }, [dispatch, endCallViaId, resetDialerState]);

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
  }, [token, starting, setStarting, fetchToken]);

  // Handle request actions
  // TODO: reconsider if this is necessary now that we have the DialState class singleton (ftw)
  useEffect(() => {
    if (!requestAction) {
      return;
    }

    switch (requestAction) {
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

      case "skipToNextLead": {
        skipToNextLead();
        dispatch(setRequestAction(null));
        break;
      }

      default: {
        dispatch(setRequestAction(null));
      }
    }
  }, [requestAction, call, dispatch, stopCall, startCall, skipToNextLead]);

  useEffect(() => {
    if (!connectedAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const duration = intervalToDuration({ start: connectedAt, end: now });
      const formattedTime = formatDuration(duration);
      setElapsedTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [connectedAt]);

  const formatDuration = (duration: Duration) => {
    const hours = String(duration.hours).padStart(1, "0");
    const minutes = String(duration.minutes).padStart(2, "0");
    const seconds = String(duration.seconds).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Don't show the Dialer if there are no leads in the queue
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

                <Tooltip label="Skip to next Lead" openDelay={500}>
                  <ActionIcon
                    size="lg"
                    disabled={!subscriptionActive}
                    onClick={() => dispatch(setRequestAction("skipToNextLead"))}
                    mx={4}
                  >
                    <IconPlayerSkipForwardFilled />
                  </ActionIcon>
                </Tooltip>

                <DialerStatus
                  $visible={
                    status === Call.State.Connecting ||
                    status === Call.State.Ringing ||
                    status === Call.State.Open
                  }
                >
                  <Text size="sm" fw={500} className="duration">
                    {status === Call.State.Connecting
                      ? "Starting..."
                      : status === Call.State.Ringing
                      ? "Calling..."
                      : elapsedTime}
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
                  <MdOutlineTune />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Toggle visibility of the dialer" openDelay={500}>
                <Flex ml="xs" align="center">
                  {isDialerOpen ? (
                    <MdExpandMore
                      className="hoverable"
                      fontSize="2rem"
                      color="grey"
                      onClick={() => dispatch(setIsDialerOpen(false))}
                    />
                  ) : (
                    <MdExpandLess
                      className="hoverable"
                      fontSize="2rem"
                      color="grey"
                      onClick={() => dispatch(setIsDialerOpen(true))}
                    />
                  )}
                </Flex>
              </Tooltip>
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
