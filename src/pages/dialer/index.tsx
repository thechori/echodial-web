import { useEffect, useState } from "react";
import { Call, Device } from "@twilio/voice-sdk";
import {
  Button,
  Container,
  Select,
  Title,
  Flex,
  Grid,
  Card,
  SelectItem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
//
import DialerStyled from "./Dialer.styles";
import apiService from "../../services/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setFromNumber,
  setToken,
  setError,
  setStatus,
  setDevice,
  setCall,
  setTokenLoading,
  setIsMuted,
  setCurrentDialAttempts,
  determineFollowingAction,
  setCurrentCallId,
  setIsCallBeingCreated,
} from "../../store/dialer/slice";
import ContactQueue from "./ContactQueue";
import { useGetCallerIdsQuery } from "../../services/caller-id";
import phoneFormatter from "../../utils/phone-formatter";
import CallHistory from "./CallHistory";
import {
  useAddCallMutation,
  useEndCallMutation,
  useUpdateCallViaIdMutation,
} from "../../services/call";
import { selectJwtDecoded } from "../../store/user/slice";
import { extractErrorMessage } from "../../utils/error";
import numbers from "../../configs/numbers";
import { Call as TCall } from "../../types";

function Dialer() {
  const dispatch = useAppDispatch();
  //
  const [callerIdItems, setCallerIdItems] = useState<SelectItem[]>([]);
  //
  const jwtDecoded = useAppSelector(selectJwtDecoded);
  const {
    call,
    currentCallId,
    isCalling,
    device,
    token,
    fromNumber,
    contactQueue,
    activeContactIndex,
    currentDialAttempts,
    isCallBeingCreated,
  } = useAppSelector((state) => state.dialer);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();
  const { data: callerIds } = useGetCallerIdsQuery();

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

  async function initializeDevice() {
    dispatch(setError(""));

    if (!token) {
      dispatch(setError("No token found"));
      return;
    }

    const device = new Device(token, {
      logLevel: 1,
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
      dispatch(setStatus("error"));
      dispatch(setError("No call to end found"));
      return;
    }

    call.disconnect();

    dispatch(setStatus("disconnected"));
    dispatch(setCall(null));
    dispatch(setCurrentCallId(null));
    dispatch(setIsMuted(false));
  }

  async function startDialer() {
    // End call before continuing (necessary for skipping to next active index)
    if (call) {
      try {
        await endDialer();
      } catch (e) {
        dispatch(setError(extractErrorMessage(e)));
      }
    }

    if (!device) {
      return dispatch(setError("No device found"));
    }

    if (!contactQueue.length) {
      return dispatch(setError("No contacts in the queue"));
    }

    if (activeContactIndex === null) {
      return dispatch(setError("No active contact found"));
    }

    var params = {
      To: contactQueue[activeContactIndex].phone,
      From: fromNumber,
    };

    // Start Call
    const c = await device.connect({ params });

    // Occurs when:
    // - Call begins (initially returns as `false`)
    c.on("ringing", async (isRinging: boolean) => {
      console.log("call.on('ringing')", isRinging);
      dispatch(setStatus("attempting"));

      if (isCallBeingCreated) {
        console.info(
          "currentCallId exists, skipping creation of new Call record"
        );
        return;
      } else {
        dispatch(setIsCallBeingCreated(true));
      }
    });

    // Occurs when:
    // - Lead answers the call
    // - Call goes to voicemail
    c.on("accept", async (call: Call) => {
      console.log("call.on('accept')", call);
      dispatch(setStatus("accepted"));

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

      dispatch(setStatus("error"));
      dispatch(setIsCallBeingCreated(false));
      dispatch(determineFollowingAction());
    });

    dispatch(setCall(c));
  }

  async function createNewCallRecord() {
    console.log("createNewCallRecord!");

    if (currentCallId !== null) {
      console.info(
        "currentCallId exists, skipping creation of new Call record"
      );
      return;
    }

    if (activeContactIndex === null) {
      console.error("activeContactIndex is not set");
      return;
    }

    const newCall: Partial<TCall> = {
      user_id: jwtDecoded?.id,
      lead_id: contactQueue[activeContactIndex].id,
      from_number: fromNumber,
      to_number: contactQueue[activeContactIndex].phone,
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

  useEffect(() => {
    if (!isCallBeingCreated) {
      createNewCallRecord();
    } else {
      dispatch(setIsCallBeingCreated(true));
    }
  }, [isCallBeingCreated]);

  // Initialize device once a token exists
  useEffect(() => {
    if (token) {
      initializeDevice();
    }
  }, [token]);

  // Handle start/stop call
  useEffect(() => {
    if (isCalling) {
      if (currentDialAttempts === null) {
        dispatch(setCurrentDialAttempts(1));
      }
      startDialer();
    } else {
      endDialer();
    }
  }, [isCalling, activeContactIndex, currentDialAttempts]);

  useEffect(() => {
    if (callerIds) {
      const items: SelectItem[] = callerIds.map((cid) => ({
        value: cid.phone_number,
        label: phoneFormatter(cid.phone_number) || "",
      }));
      setCallerIdItems([...items, ...numbers]);
    }
  }, [callerIds]);

  return (
    <DialerStyled>
      <Container fluid py="md">
        <Flex justify={"space-between"} align={"center"} mb="md">
          <Title order={2}>Dialer</Title>
          <Flex align="center">
            {device ? (
              <Flex align="flex-end">
                <Select
                  px="xs"
                  label="Your number"
                  placeholder="Pick one"
                  data={callerIdItems}
                  value={fromNumber}
                  onChange={(number) => dispatch(setFromNumber(number))}
                />
              </Flex>
            ) : (
              <Button className="startup inactive" onClick={startupClient}>
                Startup device
              </Button>
            )}
          </Flex>
        </Flex>

        <Grid>
          <Grid.Col xs={12} sm={12} md={6}>
            <Card className={!token ? "disabled" : ""} withBorder shadow="md">
              <ContactQueue />
            </Card>
          </Grid.Col>
          <Grid.Col xs={12} sm={12} md={6}>
            <Card className={!token ? "disabled" : ""} withBorder shadow="md">
              <CallHistory />
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </DialerStyled>
  );
}

export default Dialer;
