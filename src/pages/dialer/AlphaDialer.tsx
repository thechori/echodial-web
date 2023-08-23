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
  continueToNextLead,
  setError,
  setDevice,
  setCall,
  setCurrentCallId,
  setIsMuted,
  setTokenLoading,
  setToken,
  startCallTimer,
  setIsCallBeingCreated,
  setCurrentDialAttempts,
  determineFollowingAction,
  setIsDialing,
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
  //
  const jwtDecoded = useAppSelector(selectJwtDecoded);
  const {
    requestAction,
    call,
    device,
    currentCallId,
    isDialing,
    token,
    fromNumber,
    dialQueue,
    currentDialIndex,
    currentDialAttempts,
    isCallBeingCreated,
    muted,
    options,
    wasCallConnected,
    currentCallTimer,
  } = useAppSelector((state) => state.dialer);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();

  const phoneNumber = useAppSelector(selectActivePhoneNumber);
  const fullName = useAppSelector(selectActiveFullName);
  const showAlphaDialer = useAppSelector(selectShowAlphaDialer);

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

  // should be invoked:
  // - manually when hang up button is pressed
  async function endDialer() {
    // Ensure a Call exists before proceeding
    if (!call) {
      dispatch(setError("No call to end found"));
      return;
    }

    call.disconnect();

    dispatch(setCall(null));
    dispatch(setCurrentCallId(null));
    dispatch(setIsMuted(false));
  }

  async function createNewCallRecord() {
    console.log("createNewCallRecord!");

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

    const newCall: Partial<TCall> = {
      user_id: jwtDecoded?.id,
      lead_id: dialQueue[currentDialIndex].id,
      from_number: fromNumber,
      to_number: dialQueue[currentDialIndex].phone,
      status: "Attempted",
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
  }

  // TODO: find a way to automatically call this when beginning a phone call?
  // Or maybe even just running all the time in the app?
  // Consider: lags that happens when opening websocket
  // Consider: lag to init start up client before call (even more delay before call - users not happy)
  async function startupClient() {
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

  async function startDialer() {
    let indexToDial;

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
    if (currentDialIndex === null) {
      indexToDial = 0;
      dispatch(setCurrentDialIndex(indexToDial));
    }

    startCall();
  }

  async function startCall() {
    if (currentDialIndex === null) {
      notifications.show({
        message:
          "Dialer index not defined. Try selecting a lead and calling again",
      });
      return;
    }

    const params = {
      To: dialQueue[currentDialIndex].phone,
      From: fromNumber,
    };

    // Start Call
    const c = await device.connect({ params });

    // Occurs when:
    // - Call initializes (initially returns as `false`)
    // - Call connects and begins ringing
    c.on("ringing", async (isRinging: boolean) => {
      console.log("call.on('ringing')", isRinging);

      if (isRinging && !isCallBeingCreated) {
        dispatch(setIsCallBeingCreated(true));
      }
    });

    // Occurs when:
    // - Lead answers the call
    // - Call goes to voicemail
    c.on("accept", async (call: Call) => {
      console.log("call.on('accept')", call);

      try {
        if (currentCallId === null) {
          throw "No call ID found";
        }

        await updateCallViaId({
          id: currentCallId,
          twilio_call_sid: call.parameters["CallSid"],
          status: "Accepted",
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
    // - User mutes the call
    c.on("mute", (isMuted: boolean) => {
      dispatch(setIsMuted(isMuted));
    });

    // Occurs when:
    // - Call ends (user hangs up, lead hangs up, voicemail ends)
    // - Call errors
    c.on("disconnect", async (call: any) => {
      console.log("call.on('disconnect')", call);

      if (currentCallId === null) {
        console.info("No Call ID found");
      } else {
        try {
          await endCallViaId(currentCallId).unwrap();
        } catch (e) {
          notifications.show({
            title: "Error",
            message: extractErrorMessage(e),
          });
        }
      }

      // Check to see if we need to continue to next Lead or retry current
      determineNextAction();
    });

    // Occurs when:
    // - An error is thrown
    c.on("error", async (e: unknown) => {
      notifications.show({
        title: "Call error",
        message: extractErrorMessage(e),
      });

      if (currentCallId !== null) {
        try {
          await updateCallViaId({
            id: currentCallId,
            status: "Error",
          }).unwrap();
        } catch (e) {
          notifications.show({
            title: "Error",
            message: extractErrorMessage(e),
          });
        }
      }

      // End call if it exists
      if (call) {
        console.info("Disconnecting call due to an error");
        call.disconnect();
      }

      // Reset states

      dispatch(setIsCallBeingCreated(false));
      dispatch(setCall(null));
      dispatch(setCurrentCallId(null));
      dispatch(setIsDialing(false));
      dispatch(determineFollowingAction());
    });

    dispatch(setCall(c));
  }

  async function startCallTimer() {
    // Start timer that will check to see if:
    // - Call has connected or not
    // - Current attempts is beneath options.maxAttempts
    // - If there is another Lead in the Queue to continue to
    const timer = setTimeout(() => {
      console.log("maxRingTimeInMilliseconds hit! moving on...");

      // Check to see if connected or not
      if (wasCallConnected) {
        console.log("Call seems to have connected, clearing the timer!");
        clearTimeout(currentCallTimer);
        setCurrentCallTimer(null);
      }

      // BUG HERE
      // Check for null value in currentDialAttempts
      if (currentDialAttempts === null) {
        console.error("currentDialAttempts is null");
        return;
      }

      // Call has gone past allowed time, determine if retrying or continuing
      if (currentDialAttempts > options.maxCallTries) {
        console.log("Max attempts reached, moving to next Lead...");
        continueToNextLead();
      }

      // Retry lead!
      console.log("Calling Lead again...");
      setCurrentDialAttempts(currentDialAttempts + 1);
    }, options.maxRingTimeInMilliseconds);

    setCurrentCallTimer(timer);
  }

  // [ ] Should retry call if no answer AND under option.maxAttempts
  // [ ] Should continue to next call if nobody answered AND over option.maxAttempts
  // [ ] Should stop if a call connects (maybe they want to write notes, update Lead data, etc)
  // [ ] Should stop if an error exists? Or retry?
  async function determineNextAction() {
    // Reset flag
    dispatch(setIsCallBeingCreated(false));

    if (currentDialAttempts === null) {
      return console.error("Current dial attempts not found");
    }

    // Check attempts against options
    const { maxCallTries } = options;

    if (currentDialAttempts < maxCallTries) {
      // Retry call by incrementing dial attempt
      dispatch(setCurrentDialAttempts(currentDialAttempts + 1));
    } else {
      // Continue to next Lead
      continueToNextLead();
    }
  }

  // Invoked when:
  // - Next arrow is click
  async function continueToNextLead() {
    console.log("continuing");

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
    dispatch(setCurrentDialAttempts(1));

    // Check for null active index
    if (currentDialIndex === null) {
      return console.error("No active contact index found");
    }

    // Stop if we're at the last index of the queue
    if (currentDialIndex === dialQueue.length - 1) {
      return console.info("No more leads to dial");
    }

    // Start new timer
  }

  // Invoked when:
  // - Stop button is clicked
  // - An error occurs
  // - Call disconnects ?
  async function stopCall() {}

  async function stopDialer() {}

  async function resetDialer() {
    // Check for call
    if (call) {
      call.disconnect();
    }

    dispatch(setError(""));
    dispatch(setIsDialing(false));
    dispatch(setIsCallBeingCreated(false));
    dispatch(setIsMuted(false));
    dispatch(setCurrentCallId(null));
    dispatch(setCall(null));
    dispatch(setCurrentCallTimer(null));
    dispatch(setCurrentDialIndex(null));
    dispatch(setWasCallConnected(null));
    dispatch(setCurrentDialAttempts(null));
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

  useEffect(() => {
    if (!requestAction) {
      console.info("No request action found, skipping...");
      return;
    }

    switch (requestAction) {
      case "init": {
        initializeDevice();
        dispatch(setRequestAction(null));
        break;
      }

      case "startDialer": {
        startDialer();
        dispatch(setRequestAction(null));
        break;
      }

      case "startCall": {
        startCall();
        dispatch(setRequestAction(null));
        break;
      }

      case "determineNextAction": {
        determineNextAction();
        dispatch(setRequestAction(null));
        break;
      }

      case "stopDialer": {
        stopDialer();
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
  }, [requestAction]);

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

              {isDialing ? (
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
              {status}
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
