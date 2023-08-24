import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Call, Device } from "@twilio/voice-sdk";
import { Tooltip } from "@mantine/core";
import { Box, Flex, Text } from "@mantine/core";
import {
  AiFillPlayCircle,
  AiFillStepForward,
  AiOutlineAudioMuted,
  AiOutlineAudio,
} from "react-icons/ai";
import { FaRegStopCircle, FaUser } from "react-icons/fa";
import { BiHide, BiImport } from "react-icons/bi";
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
import phoneFormatter from "../../utils/phone-formatter";
import {
  selectActivePhoneNumber,
  selectActiveFullName,
  setCurrentDialIndex,
  selectShowAlphaDialer,
  setOptions,
  setError,
  setDevice,
  setCall,
  setCurrentCallId,
  setIsMuted,
  setTokenLoading,
  setToken,
  setCurrentDialAttempts,
  setRequestAction,
  setCurrentCallTimer,
  setWasCallConnected,
} from "../../store/dialer/slice";
import routes from "../../configs/routes";
import AlphaDialerStyled from "./AlphaDialer.styles";
import { Call as TCall } from "../../types";

function AlphaDialer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //
  const jwtDecoded = useAppSelector(selectJwtDecoded);
  const {
    requestAction,
    call,
    device,
    currentCallId,
    token,
    fromNumber,
    dialQueue,
    currentDialIndex,
    currentDialAttempts,
    muted,
    options,
    wasCallConnected,
    currentCallTimer,
  } = useAppSelector((state) => state.dialer);
  const phoneNumber = useAppSelector(selectActivePhoneNumber);
  const fullName = useAppSelector(selectActiveFullName);
  const showAlphaDialer = useAppSelector(selectShowAlphaDialer);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();

  async function initializeDevice() {
    dispatch(setError(""));

    if (!token) {
      dispatch(setError("No token found"));
      return;
    }

    const device = new Device(token, {
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

    dispatch(setDevice(device));
  }

  // TODO: Reevaluate for performance enhancements
  // Consider: lags that happens when opening websocket
  // Consider: lag to init start up client before call (even more delay before call - users not happy)
  async function fetchToken() {
    try {
      dispatch(setTokenLoading(true));
      const { data } = await apiService("/dialer/token");
      const token = data.token;
      dispatch(setToken(token));
    } catch (err) {
      dispatch(
        setError(
          "An error occurred. See your browser console for more information."
        )
      );
    } finally {
      dispatch(setTokenLoading(false));
    }
  }

  async function startCall() {
    let index = currentDialIndex;
    let attempts = currentDialAttempts;

    // Check for device
    if (!device) {
      dispatch(setError("No device initialized"));
      return;
    }

    // Check for items in queue
    if (dialQueue.length === 0) {
      dispatch(setError("No leads in call queue"));
      return;
    }

    // Initialize index if none provided AND current index is not set
    if (index === null) {
      index = 0;
      dispatch(setCurrentDialIndex(index));
    }

    // Initialize or increment current dial attempts
    if (attempts === null) {
      attempts = 0;
    } else {
      attempts++;
    }

    dispatch(setCurrentDialAttempts(attempts));

    const params = {
      To: dialQueue[index].phone,
      From: fromNumber,
    };

    // Start Call
    const c = (await device.connect({ params })) as Device;

    // Occurs when:
    // - Call initializes (initially returns as `false`)
    // - Call connects and begins ringing
    // Note: Using `once` instead to avoid multiple calls, this poses a risk because we are now
    // assuming that ringing will get to `true` since the initial (and only returned value now)
    // is `false` ... address this in  the future if issues occur
    c.once("ringing", async () => {
      if (currentCallId !== null) {
        console.info(
          "currentCallId exists, skipping creation of new Call record"
        );
        return;
      }

      if (currentDialIndex === null) {
        console.error("currentDialIndex is not set");
        return;
      }

      // Begin timer BEFORE any API requests to avoid backend latency skewing
      // results that are directly tied to a user's time option settings
      startCallTimer();

      const newCall: Partial<TCall> = {
        user_id: jwtDecoded?.id,
        lead_id: dialQueue[currentDialIndex].id,
        from_number: fromNumber,
        to_number: dialQueue[currentDialIndex].phone,
      };

      try {
        const a = await addCall(newCall).unwrap();
        dispatch(setCurrentCallId(a.id));
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
      dispatch(setWasCallConnected(true));

      try {
        if (currentCallId === null) {
          throw Error("No call ID found");
        }

        const res = await updateCallViaId({
          id: currentCallId,
          twilio_call_sid: call.parameters["CallSid"],
          was_answered: true,
        }).unwrap();
        console.log("res", res);
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    });

    // Occurs when:
    // - User mutes the call
    c.on("mute", (isMuted: boolean) => {
      dispatch(setIsMuted(isMuted));
    });

    // Occurs when:
    // - Call ends (user hangs up, lead hangs up, voicemail ends)
    // - Call errors
    c.on("disconnect", async () => {
      console.log("disconnect.call", call);
      dispatch(setRequestAction("determineNextAction"));
    });

    // Occurs when:
    // - An error is thrown
    c.on("error", async (e: unknown) => {
      notifications.show({
        title: "Call error",
        message: extractErrorMessage(e),
      });
      dispatch(setRequestAction("determineNextAction"));
    });

    dispatch(setCall(c));
  }

  // Start timer that will check to see if:
  // - Call has connected or not
  // - Current attempts is beneath options.maxAttempts
  // - If there is another Lead in the Queue to continue to
  async function startCallTimer() {
    const timer = setTimeout(async () => {
      console.log("maxRingTimeInMilliseconds hit! moving on...");

      // When time expires, check to see if connected or not
      if (wasCallConnected) {
        console.log(
          "Call connected! Clearing the timer to avoid ending the call..."
        );
        clearTimeout(currentCallTimer);
        dispatch(setCurrentCallTimer(null));
        return;
      } else {
        console.log("wasCallConnected is FALSE...");
      }

      dispatch(setRequestAction("determineNextAction"));
    }, options.maxRingTimeInMilliseconds);

    dispatch(setCurrentCallTimer(timer));
  }

  // [x] Should retry call if no answer AND under option.maxAttempts
  // [x] Should continue to next call if nobody answered AND over option.maxAttempts
  // [ ] Should stop if a call connects (maybe they want to write notes, update Lead data, etc)
  // [x] Should stop if an error exists
  async function determineNextAction() {
    console.log("call", call);

    // End call
    await stopCall(call);
    dispatch(setRequestAction("stopCall"));

    // Check for null value in currentDialAttempts
    if (currentDialAttempts === null) {
      console.error("currentDialAttempts is null");
      return;
    }

    // Call has gone past allowed time, determine if retrying or continuing
    if (currentDialAttempts > options.maxCallTries) {
      console.log("Max attempts reached, moving to next Lead...");
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
    console.log("continuing to next lead...");

    // TODO: check for existing next index before proceeding
    if (currentDialIndex === dialQueue.length - 1) {
      notifications.show({
        message: "No more leads in the queue. Stopping the dialer",
      });
      return;
    }

    // Check for null dial index
    if (currentDialIndex === null) {
      notifications.show({
        message:
          "Dial index is null. Try selecting a different lead and trying again",
      });
      return;
    }

    // Point to the next Lead in the queue
    dispatch(setCurrentDialIndex(currentDialIndex + 1));

    // Reset attempt count
    dispatch(setCurrentDialAttempts(null));

    // Check for null active index
    if (currentDialIndex === null) {
      return console.error("No active contact index found");
    }

    // Stop if we're at the last index of the queue
    if (currentDialIndex === dialQueue.length - 1) {
      return console.info("No more leads to dial");
    }

    // We're safe to proceed
    startCall();
  }

  // Invoked when:
  // - Stop button is clicked
  // - An error occurs
  // - Call disconnects ?
  async function stopCall(call: Call | null) {
    // Ensure a Call exists before proceeding
    if (!call) {
      console.warn("No call to end found");
    }

    // Bug: no call is found when this gets invoked
    if (call) {
      console.info("Call found, ending it now...");
      call.disconnect();
    }

    // Stop timer
    if (currentCallTimer) {
      clearTimeout(currentCallTimer);
    }

    if (currentCallId === null) {
      console.warn("No Call ID found");
    } else {
      try {
        const res = await endCallViaId(currentCallId).unwrap();
        console.log("res", res);
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    }

    if (currentCallId !== null) {
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

    // Reset states
    console.log("clearing call via redux state");
    dispatch(setCall(null));
    dispatch(setCurrentCallId(null));
    dispatch(setIsMuted(false));
    dispatch(setCurrentCallTimer(null));
    dispatch(setWasCallConnected(null));
  }

  async function resetDialer() {
    // End the call
    stopCall(call);

    // Additional state cleanup
    dispatch(setError(""));
    dispatch(setCurrentDialIndex(null));
    dispatch(setCurrentDialAttempts(null));
  }

  async function startDialing() {}
  async function stopDialing() {
    await stopCall(null);
  }

  async function handleError() {}

  //////////////////////// HOOKS ///////////////////////////

  // Main logic MUST happen in these React components, unfortunately

  // What are the main events?
  // [ ] Initializing
  // [ ] Start dialer (with or without index)
  // [ ] Start call (at current index)
  // [ ] Determine next in-dial action (retry or continue)
  // [ ] Stop dialer
  // [ ] Reset dialer
  // [ ] Error

  // Get token
  // Create device instance
  useEffect(() => {
    // No token found, get it
    if (!token) {
      fetchToken();
      return;
    }

    // Token found but no device, initialize it
    if (token && !device) {
      initializeDevice();
      return;
    }
  }, [token, device, fetchToken, initializeDevice]);

  useEffect(() => {
    if (!requestAction) {
      console.info("No request action found, skipping...");
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
        stopCall(call);
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
    startCall,
    stopCall,
    stopDialing,
  ]);

  if (!showAlphaDialer) return null;

  return (
    <AlphaDialerStyled>
      <Box className="details">
        <Box>
          <FaUser className="user-icon" color="white" />
        </Box>
        <Box className="lead-details">
          <Box>
            <Text color="white">
              {phoneFormatter(phoneNumber) || "No phone active"}
            </Text>
          </Box>
          <Box>
            <Text size="sm" color="grey">
              {fullName || "No lead active"}
            </Text>
          </Box>
        </Box>
        <Box>
          <Tooltip label="Open Dialer page">
            <div>
              <BiImport
                className="import-contact-button hoverable"
                onClick={() => navigate(routes.dialer)}
              />
            </div>
          </Tooltip>
        </Box>
      </Box>

      <Box className="controls">
        <Box>
          <Flex align="center" justify="center">
            <div className="control-buttons">
              {!muted ? (
                <Tooltip label="Mute">
                  <div>
                    <AiOutlineAudio
                      fontSize="2.5rem"
                      onClick={() => call?.mute()}
                      className={`hoverable ${call ?? "disabled"}`}
                    />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip label="Unmute">
                  <div>
                    <AiOutlineAudioMuted
                      fontSize="2.5rem"
                      onClick={() => call?.mute()}
                      className="hoverable"
                      color="red"
                    />
                  </div>
                </Tooltip>
              )}

              {call ? (
                <Tooltip label="End call">
                  <div>
                    <FaRegStopCircle
                      fontSize="2.5rem"
                      className="hoverable"
                      onClick={() => dispatch(setCurrentDialIndex(null))}
                    />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip label="Start dialing">
                  <div>
                    <AiFillPlayCircle
                      fontSize="2.5rem"
                      className="hoverable"
                      onClick={() => {
                        // Start from 0 UNLESS there is a currently selected index
                        const index =
                          currentDialIndex === null ? 0 : currentDialIndex;

                        dispatch(setCurrentDialIndex(index));
                        // dispatch(setIs);
                      }}
                    />
                  </div>
                </Tooltip>
              )}

              <Tooltip label="Skip to next Lead">
                <div>
                  <AiFillStepForward
                    fontSize="2.5rem"
                    className="hoverable"
                    onClick={continueToNextLead}
                  />
                </div>
              </Tooltip>
            </div>
          </Flex>
        </Box>

        <div className="call-details">
          <Text size="sm">
            Status:{" "}
            <Text color="grey" span>
              No status yet
            </Text>
          </Text>

          <Text size="sm">
            Duration:{" "}
            <Text color="grey" span>
              0:00
            </Text>
          </Text>
        </div>
      </Box>

      <Box className="options">
        <Tooltip label="Hide status bar">
          <div>
            <BiHide
              fontSize="2rem"
              className="hoverable"
              onClick={() =>
                dispatch(setOptions({ ...options, showAlphaDialer: false }))
              }
            />
          </div>
        </Tooltip>
      </Box>
    </AlphaDialerStyled>
  );
}

export default AlphaDialer;
