import { useEffect, useRef, useState } from "react";
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
import { BiImport } from "react-icons/bi";
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
  setDialQueueIndex,
  setError,
  setDevice,
  setCall,
  setCurrentCallId,
  setIsMuted,
  setToken,
  setCurrentDialAttempts,
  setRequestAction,
  setWasCallConnected,
  setIsDialing,
} from "../../store/dialer/slice";
import routes from "../../configs/routes";
import AlphaDialerStyled from "./AlphaDialer.styles";
import { Call as TCall } from "../../types";
import ContactQueue from "./ContactQueue";

export type TCallRef = {
  error: string;
  isDialing: boolean;
  wasCallConnected: boolean;
  currentCallId: number | null;
  dialQueueIndex: number | null;
  currentDialAttempts: number;
  call: Call | null;
  device: Device | null;
  token: string | null;
  currentCallTimer: any;
  muted: boolean;
};

function AlphaDialer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const callRef = useRef<TCallRef>({
    isDialing: false,
    error: "",
    wasCallConnected: false,
    currentCallId: null,
    dialQueueIndex: null,
    currentDialAttempts: 0,
    call: null,
    device: null,
    token: null,
    currentCallTimer: null,
    muted: false,
  });
  //
  const jwtDecoded = useAppSelector(selectJwtDecoded);
  const {
    requestAction,
    call,
    device,
    token,
    fromNumber,
    dialQueue,
    dialQueueIndex,
    muted,
    options,
    alphaDialerVisible,
  } = useAppSelector((state) => state.dialer);
  const phoneNumber = useAppSelector(selectActivePhoneNumber);
  const fullName = useAppSelector(selectActiveFullName);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();

  async function initializeDevice() {
    dispatch(setError(""));

    if (!callRef.current.token) {
      dispatch(setError("No token found"));
      return;
    }

    const device = new Device(callRef.current.token, {
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

    callRef.current.device = device;
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
      callRef.current.token = token;
      initializeDevice();
    } catch (err) {
      dispatch(
        setError(
          "An error occurred. See your browser console for more information."
        )
      );
    }
  }

  async function startCall() {
    let index = callRef.current.dialQueueIndex;
    let attempts = callRef.current.currentDialAttempts;

    // Check for device
    if (!callRef.current.device) {
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
    }

    dispatch(setDialQueueIndex(index));
    callRef.current.dialQueueIndex = index;
    dispatch(setIsDialing(true));
    callRef.current.isDialing = true;

    // Initialize or increment current dial attempts
    if (attempts === null) {
      attempts = 0;
    } else {
      attempts = attempts + 1;
    }

    dispatch(setCurrentDialAttempts(attempts));
    callRef.current.currentDialAttempts = attempts;

    const params = {
      To: dialQueue[index].phone,
      From: fromNumber,
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

      if (callRef.current.currentCallId !== null) {
        console.info(
          "currentCallId exists, skipping creation of new Call record"
        );
        return;
      }

      if (callRef.current.dialQueueIndex === null) {
        console.error("dialQueueIndex is not set");
        return;
      }

      // Begin timer BEFORE any API requests to avoid backend latency skewing
      // results that are directly tied to a user's time option settings
      startCallTimer();

      const newCall: Partial<TCall> = {
        user_id: jwtDecoded?.id,
        lead_id: dialQueue[callRef.current.dialQueueIndex].id,
        from_number: fromNumber,
        to_number: dialQueue[callRef.current.dialQueueIndex].phone,
      };

      try {
        const a = await addCall(newCall).unwrap();
        dispatch(setCurrentCallId(a.id));
        callRef.current.currentCallId = a.id;
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
      callRef.current.wasCallConnected = true;

      try {
        if (callRef.current.currentCallId === null) {
          throw Error("No call ID found");
        }

        const res = await updateCallViaId({
          id: callRef.current.currentCallId,
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
      callRef.current.muted = isMuted;
    });

    // Occurs when:
    // - Call ends (user hangs up, lead hangs up, voicemail ends)
    // - Call errors?
    c.on("disconnect", async () => {
      dispatch(setRequestAction("determineNextAction"));
    });

    // Occurs when:
    // - An error is thrown
    c.on("error", async (e: unknown) => {
      const errorMessage = extractErrorMessage(e);
      notifications.show({
        title: "Call error",
        message: errorMessage,
      });
      dispatch(setError(errorMessage));
      callRef.current.error = errorMessage;

      dispatch(setRequestAction("determineNextAction"));
    });

    dispatch(setCall(c));
    callRef.current.call = c;
  }

  // function getWasCallConnected() {
  //   console.log("getWasCallConnected");
  //   return wasCallConnected;
  // }

  // Start timer that will check to see if:
  // - Call has connected or not
  // - Current attempts is beneath options.maxAttempts
  // - If there is another Lead in the Queue to continue to
  async function startCallTimer() {
    console.log("starting new call timer!");

    const timer = setTimeout(async () => {
      console.log("maxRingTimeInSeconds hit! moving on...");

      // When time expires, check to see if connected or not
      if (callRef.current.wasCallConnected) {
        console.log(
          "Call connected! Clearing the timer to avoid ending the call..."
        );

        clearTimeout(callRef.current.currentCallTimer);
        callRef.current.currentCallTimer = null;

        return;
      }

      dispatch(setRequestAction("determineNextAction"));
    }, options.maxRingTimeInSeconds * 1000);

    callRef.current.currentCallTimer = timer;
  }

  // [x] Should retry call if no answer AND under option.maxAttempts
  // [x] Should continue to next call if nobody answered AND over option.maxAttempts
  // [ ] Should stop if a call connects (maybe they want to write notes, update Lead data, etc)
  // [x] Should stop if an error exists
  async function determineNextAction() {
    // End call
    await stopCall();
    dispatch(setRequestAction("stopCall"));

    // Check for error
    if (callRef.current.error) {
      console.info(`Error: ${callRef.current.error}`);
      return;
    }

    // Check for null value in currentDialAttempts
    if (callRef.current.currentDialAttempts === null) {
      console.error("currentDialAttempts is null");
      return;
    }

    // Call was connected, stop here to allow the user time to take notes
    // and regroup before proceeding to next call (could be overwhelming if it just keeps going)
    if (callRef.current.wasCallConnected) {
      console.info(
        "Connected call has ended, pausing here until user explicitly decides to continue"
      );
      return;
    }

    // Dialing has gone past allowed ring time, determine if retrying or continuing
    if (callRef.current.currentDialAttempts >= options.maxCallTries) {
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
    if (callRef.current.dialQueueIndex === dialQueue.length - 1) {
      notifications.show({
        message: "No more leads in the queue. Stopping the dialer",
      });
      await stopDialing();
      await resetDialer();
      return;
    }

    // Check for null dial index
    if (callRef.current.dialQueueIndex === null) {
      notifications.show({
        message:
          "Dial index is null. Try selecting a different lead and trying again",
      });
      return;
    }

    // Point to the next Lead in the queue
    const value = callRef.current.dialQueueIndex + 1;
    dispatch(setDialQueueIndex(value));
    callRef.current.dialQueueIndex = value;

    // Reset attempt count
    dispatch(setCurrentDialAttempts(0));
    callRef.current.currentDialAttempts = 0;

    // Check for null active index
    if (callRef.current.dialQueueIndex === null) {
      return console.error("No active contact index found");
    }

    // Stop if we're at the last index of the queue
    if (callRef.current.dialQueueIndex === dialQueue.length - 1) {
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
    // Ensure a Call exists before proceeding
    if (!callRef.current.call) {
      console.info("No call to end found");
    }

    // Bug: no call is found when this gets invoked
    if (callRef.current.call) {
      console.info("Call found, ending it now...");
      callRef.current.call.disconnect();
    }

    // Stop timer
    if (callRef.current.currentCallTimer) {
      console.log("found a call timer, clearing it..");
      clearTimeout(callRef.current.currentCallTimer);
    }

    if (callRef.current.currentCallId === null) {
      console.info("No Call ID found");
    } else {
      try {
        const res = await endCallViaId(callRef.current.currentCallId).unwrap();
        console.log("res", res);
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    }

    if (callRef.current.currentCallId !== null) {
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
    dispatch(setIsDialing(false));
    callRef.current.isDialing = false;
    dispatch(setCall(null));
    callRef.current.call = null;
    dispatch(setCurrentCallId(null));
    callRef.current.currentCallId = null;
    dispatch(setIsMuted(false));
    callRef.current.muted = false;
    callRef.current.currentCallTimer = null;
    dispatch(setWasCallConnected(false));
    callRef.current.wasCallConnected = false;
  }

  async function resetDialer() {
    // End the call
    stopCall();

    // Additional state cleanup
    dispatch(setError(""));
    callRef.current.error = "";
    dispatch(setDialQueueIndex(null));
    callRef.current.dialQueueIndex = null;
    dispatch(setCurrentDialAttempts(0));
    callRef.current.currentDialAttempts = 0;
  }

  async function startDialing() {
    dispatch(setIsDialing(true));
  }
  async function stopDialing() {
    dispatch(setIsDialing(false));
    callRef.current.isDialing = false;
    await stopCall();
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
    if (starting) {
      return;
    }

    setStarting(true);

    // No token found, get it
    if (token) {
      // TODO: bring this back when ready
      // if (!token) {
      fetchToken();
      return;
    }
  }, [token, starting, setStarting]);

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
                      onClick={() => dispatch(setDialQueueIndex(null))}
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
                          dialQueueIndex === null ? 0 : dialQueueIndex;

                        dispatch(setDialQueueIndex(index));
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
              0:00:00
            </Text>
          </Text>
        </div>

        <Box>
          <ContactQueue />
        </Box>
      </Box>
    </AlphaDialerStyled>
  );
}

export default AlphaDialer;
