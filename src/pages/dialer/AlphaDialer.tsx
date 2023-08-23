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
  } = useAppSelector((state) => state.dialer);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();

  const phoneNumber = useAppSelector(selectActivePhoneNumber);
  const fullName = useAppSelector(selectActiveFullName);
  const showAlphaDialer = useAppSelector(selectShowAlphaDialer);

  function handleNextLead() {
    dispatch(continueToNextLead());
  }

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

    // Use current index to set for dialer
    indexToDial = currentDialIndex;

    const params = {
      To: dialQueue[indexToDial as number].phone,
      From: fromNumber,
    };

    // Start Call
    const c = await device.connect({ params });

    // Occurs when:
    // - Call initializes (initially returns as `false`)
    // - Call connects and begins ringing
    c.on("ringing", async (isRinging: boolean) => {
      console.log("call.on('ringing')", isRinging);

      if (isRinging && isCallBeingCreated) {
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

      // Reset flag
      dispatch(setIsCallBeingCreated(false));

      // Check to see if we need to continue to next Lead or retry current
      dispatch(determineFollowingAction());
    });

    // Occurs when:
    // - An error is thrown
    c.on("error", async (e: unknown) => {
      console.log("call.on('mute')", e);
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

  //////////////////////// HOOKS ///////////////////////////

  // What are the main events?
  // [ ] Initializing
  // [ ] Start dialer (with or without index)
  // [ ] Determine next in-dial action (retry or continue)
  // [ ] Stop dialer
  // [ ] Reset dialer
  // [ ] Error

  useEffect(() => {
    if (isDialing && !isCallBeingCreated) {
      createNewCallRecord();

      // Start call timer
      dispatch(startCallTimer());
    } else if (isDialing) {
      dispatch(setIsCallBeingCreated(true));
    }
  }, [isCallBeingCreated, isDialing]);

  // Initialize device once a token exists
  useEffect(() => {
    if (token) {
      initializeDevice();
    }
  }, [token]);

  // Handle start/stop call
  useEffect(() => {
    if (isDialing) {
      if (currentDialAttempts === null) {
        console.log("setting dial attempts = 1");
        dispatch(setCurrentDialAttempts(1));
      }
      startDialer();
    } else {
      endDialer();
    }
  }, [isDialing, currentDialIndex, currentDialAttempts]);

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
                    onClick={handleNextLead}
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
