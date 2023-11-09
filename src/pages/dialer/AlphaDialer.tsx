import { useEffect, useState } from "react";
import { Call, Device } from "@twilio/voice-sdk";
import {
  ActionIcon,
  Button,
  Card,
  HoverCard,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
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
  setWasCallConnected,
  setIsDialing,
  setDialQueueIndex,
  setShowOptions,
} from "../../store/dialer/slice";
import AlphaDialerStyled from "./AlphaDialer.styles";
import { Call as TCall } from "../../types";
import DialerQueue from "./DialerQueue";
import CallerIdSelect from "./CallerIdSelect";
import {
  IconAdjustments,
  IconPlayerPlay,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import { DialerLeadDetail } from "./DialerLeadDetail";
import { dialStateInstance } from "./DialState.class";
import { PiPhone, PiPhoneDisconnect } from "react-icons/pi";

function AlphaDialer() {
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
    options,
    alphaDialerVisible,
    error,
  } = useAppSelector((state) => state.dialer);
  const { subscriptionActive } = useAppSelector((state) => state.user);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();

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

    // Disable all default Twilio sounds because they are slow and ugly
    // Hacky workaround found here: https://github.com/twilio/twilio-voice.js/issues/14
    // @ts-ignore
    device.audio.incoming(false);
    // @ts-ignore
    device.audio.outgoing(false);
    // @ts-ignore
    device.audio.disconnect(false);

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
      console.log("********************* ringing *********************");

      if (dialStateInstance.currentCallId !== null) {
        console.info(
          "currentCallId exists, skipping creation of new Call record"
        );
        return;
      }

      if (dialStateInstance.dialQueueIndex === null) {
        console.error("dialQueueIndex is not set");
        return;
      }

      // Begin timer BEFORE any API requests to avoid backend latency skewing
      // results that are directly tied to a user's time option settings
      startCallTimer();

      const newCall: Partial<TCall> = {
        user_id: jwtDecoded?.id,
        lead_id: dialQueue[dialStateInstance.dialQueueIndex].id,
        from_number: fromNumber,
        to_number: dialQueue[dialStateInstance.dialQueueIndex].phone,
      };

      try {
        const a = await addCall(newCall).unwrap();
        dialStateInstance.currentCallId = a.id;
        dispatch(setCurrentCallId(dialStateInstance.currentCallId));
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
      dialStateInstance.wasCallConnected = true;
      dispatch(setWasCallConnected(dialStateInstance.wasCallConnected));
      notifications.show({ message: "Call accepted" });

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
      dispatch(setRequestAction("determineNextAction"));
      notifications.show({ message: "Call ended" });
    });

    // Occurs when:
    // - An error is thrown
    c.on("error", async (e: unknown) => {
      const errorMessage = extractErrorMessage(e);
      notifications.show({
        title: "Call error",
        message: errorMessage,
      });
      dialStateInstance.error = errorMessage;
      dispatch(setError(dialStateInstance.error));

      dispatch(setRequestAction("determineNextAction"));
    });

    dialStateInstance.call = c;
    dispatch(setCall(dialStateInstance.call));
  }

  // Start timer that will check to see if:
  // - Call has connected or not
  // - Current attempts is beneath options.maxAttempts
  // - If there is another Lead in the Queue to continue to
  async function startCallTimer() {
    console.log("starting new call timer!");

    const timer = setTimeout(async () => {
      console.log("maxRingTimeInSeconds hit! moving on...");

      // When time expires, check to see if connected or not
      if (dialStateInstance.wasCallConnected) {
        console.log(
          "Call connected! Clearing the timer to avoid ending the call..."
        );

        clearTimeout(dialStateInstance.currentCallTimer);
        dialStateInstance.currentCallTimer = null;

        return;
      }

      dispatch(setRequestAction("determineNextAction"));
    }, options.maxRingTimeInSeconds * 1000);

    dialStateInstance.currentCallTimer = timer;
  }

  // [x] Should retry call if no answer AND under option.maxAttempts
  // [x] Should continue to next call if nobody answered AND over option.maxAttempts
  // [x] Should stop if a call connects then ends (e.g., users wants to write notes, update Lead data, etc)
  // [x] Should stop if an error exists
  async function determineNextAction() {
    // Check for error
    if (dialStateInstance.error) {
      console.info(`Error: ${dialStateInstance.error}`);
      return;
    }

    // Call was connected, stop here to allow the user time to take notes
    // and regroup before proceeding to next call (could be overwhelming if it just keeps going)
    if (dialStateInstance.wasCallConnected) {
      console.info(
        "Connected call has ended, pausing here until user explicitly decides to continue"
      );
      // End call
      await stopCall();
      dispatch(setRequestAction("stopCall"));

      return;
    }

    // End call
    await stopCall();
    dispatch(setRequestAction("stopCall"));

    // Dialing has gone past allowed ring time, determine if retrying or continuing
    if (dialStateInstance.currentDialAttempts >= options.maxCallTries) {
      console.info("Max attempts reached, moving to next Lead...");
      await continueToNextLead();
      return;
    }

    // Retry lead!
    console.log("Calling Lead again...");
    await startCall();
  }

  // Invoked when:
  // - Next arrow is click
  async function continueToNextLead() {
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

    // Stop if we're at the last index of the queue
    if (dialStateInstance.dialQueueIndex === dialQueue.length - 1) {
      return console.info("No more leads to dial");
    }

    // We're safe to proceed
    startCall();
  }

  // Invoked when:
  // - Stop button is clicked
  // - An error occurs
  // - Call disconnects ?
  async function stopCall() {
    console.log("stopCall");

    // Ensure a Call exists before proceeding
    if (!dialStateInstance.call) {
      console.info("No call to end found");
    }

    // Bug: no call is found when this gets invoked
    if (dialStateInstance.call) {
      console.info("Call found, ending it now...");
      dialStateInstance.call.disconnect();
    }

    // Stop timer
    if (dialStateInstance.currentCallTimer) {
      console.log("found a call timer, clearing it..");
      clearTimeout(dialStateInstance.currentCallTimer);
    }

    if (dialStateInstance.currentCallId === null) {
      console.info("No Call ID found");
    } else {
      try {
        const res = await endCallViaId(
          dialStateInstance.currentCallId
        ).unwrap();
        console.log("res", res);
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
    dialStateInstance.wasCallConnected = false;
    dispatch(setWasCallConnected(dialStateInstance.wasCallConnected));
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

  function requestStartDialer() {
    // Start from 0 UNLESS there is a currently selected index
    const newIndex =
      dialStateInstance.dialQueueIndex === null
        ? 0
        : dialStateInstance.dialQueueIndex;
    dialStateInstance.dialQueueIndex = newIndex;
    dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));
    dispatch(setRequestAction("startCall"));
  }

  function requestContinue() {
    if (dialStateInstance.dialQueueIndex === null) {
      dialStateInstance.error = "Dial queue index is null";
      dispatch(setError(dialStateInstance.error));
      return;
    }

    // Check for next index
    if (dialStateInstance.dialQueueIndex === dialQueue.length - 1) {
      dialStateInstance.dialQueueIndex = 0;
      dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));
    } else {
      dialStateInstance.dialQueueIndex = dialStateInstance.dialQueueIndex + 1;
      dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));
    }

    startCall();
  }

  function requestStopDialer() {
    dispatch(setRequestAction("stopDialing"));
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
    console.log("ERROR!");
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

      case "determineNextAction": {
        determineNextAction();
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
  }, [
    requestAction,
    call,
    determineNextAction,
    dispatch,
    resetDialer,
    stopCall,
    stopDialing,
  ]);

  return (
    <AlphaDialerStyled $visible={alphaDialerVisible}>
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
              <Flex justify="flex-start" align="flex-end" mr={36}>
                <ThemeIcon mr="xs" size="xl" variant="gradient">
                  <PiPhone fontSize="1.75rem" />
                </ThemeIcon>
                <Title order={2}>Dialer</Title>
              </Flex>

              <Flex align="flex-end">
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
                    color="blue"
                  >
                    <IconAdjustments />
                  </ActionIcon>
                </Tooltip>
              </Flex>
            </Flex>

            <Flex align="flex-end" h={60}>
              {!subscriptionActive ? (
                <HoverCard width={280} shadow="md">
                  <HoverCard.Target>
                    <Button
                      mx={4}
                      style={{ border: "1px solid red" }}
                      className="disabled-button"
                      onClick={() =>
                        alert(
                          "It looks like you've run out of trial credits or your subscription is currently inactive. Please upgrade your subscription to enable feature this feature again 😊"
                        )
                      }
                      leftIcon={<IconPlayerPlay />}
                    >
                      Start dialer
                    </Button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm">
                      It looks like you've run out of trial credits or your
                      subscription is currently inactive. Please upgrade your
                      subscription to enable feature this feature again 😊
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              ) : dialStateInstance.dialQueueIndex === null ? (
                <Tooltip
                  label="Begin making calls to the leads in the Call queue"
                  openDelay={500}
                >
                  <Button
                    mx={4}
                    variant="gradient"
                    onClick={requestStartDialer}
                    leftIcon={<IconPlayerPlay />}
                  >
                    Start dialer
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip
                  label="Continue to the next lead in the Call queue"
                  openDelay={500}
                >
                  <Button
                    mx={4}
                    variant="gradient"
                    onClick={requestContinue}
                    leftIcon={<IconPlayerPlay />}
                    disabled={!!call}
                  >
                    Continue
                  </Button>
                </Tooltip>
              )}
              <Tooltip label="Hang up" openDelay={500}>
                <Button
                  mx={4}
                  color="red"
                  onClick={requestStopDialer}
                  disabled={!call}
                  leftIcon={<PiPhoneDisconnect fontSize="1.5rem" />}
                >
                  Hang up
                </Button>
              </Tooltip>

              <Tooltip label="Skip to next Lead">
                <Button
                  variant="outline"
                  disabled={!call}
                  leftIcon={<IconPlayerSkipForward />}
                  onClick={continueToNextLead}
                  mx={4}
                >
                  Next lead
                </Button>
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
    </AlphaDialerStyled>
  );
}

export default AlphaDialer;
