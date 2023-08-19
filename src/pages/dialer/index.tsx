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
  setIsCalling,
  setCurrentDialAttempts,
} from "../../store/dialer/slice";
import ContactQueue from "./ContactQueue";
import { useGetCallerIdsQuery } from "../../services/caller-id";
import phoneFormatter from "../../utils/phone-formatter";
import CallHistory from "./CallHistory";
import {
  TCall,
  useAddCallMutation,
  useUpdateCallViaTwilioCallSidMutation,
} from "../../services/call";
import { selectJwtDecoded } from "../../store/user/slice";
import { extractErrorMessage } from "../../utils/error";
import numbers from "../../configs/numbers";

function Dialer() {
  const dispatch = useAppDispatch();
  //
  const [callerIdItems, setCallerIdItems] = useState<SelectItem[]>([]);
  //
  const jwtDecoded = useAppSelector(selectJwtDecoded);
  const {
    call,
    isCalling,
    device,
    token,
    fromNumber,
    contactQueue,
    activeContactIndex,
  } = useAppSelector((state) => state.dialer);
  //
  const [addCall] = useAddCallMutation();
  const [updateCall] = useUpdateCallViaTwilioCallSidMutation();
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

    try {
      const callToUpdate: Partial<TCall> = {
        twilio_call_sid: call.parameters["CallSid"],
        status: "Disconnected",
        // @ts-ignore
        disconnected_at: new Date().toISOString(),
      };
      await updateCall(callToUpdate).unwrap();

      dispatch(setStatus("disconnected"));
    } catch (e) {
      dispatch(setError(extractErrorMessage(e)));
      dispatch(setStatus("error"));
    } finally {
      dispatch(setCall(null));
      dispatch(setIsMuted(false));
    }
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

    dispatch(setCurrentDialAttempts(1));

    c.on("accept", async (call: Call) => {
      dispatch(setStatus("accepted"));

      const newCall: Partial<TCall> = {
        user_id: jwtDecoded?.id,
        lead_id: contactQueue[activeContactIndex].id,
        twilio_call_sid: call.parameters["CallSid"],
        from_number: fromNumber,
        to_number: contactQueue[activeContactIndex].phone,
        status: "Attempted",
      };

      try {
        await addCall(newCall).unwrap();
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    });

    c.on("mute", (isMuted: boolean) => {
      dispatch(setIsMuted(isMuted));
    });

    c.on("disconnect", async () => {
      dispatch(setIsCalling(false));
    });

    c.on("error", async (e: unknown) => {
      notifications.show({
        title: "Call error",
        message: extractErrorMessage(e),
      });
      dispatch(setStatus("error"));
      dispatch(setIsCalling(false));
    });

    console.log("setting call", c);
    dispatch(setCall(c));
  }

  // Initialize device once a token exists
  useEffect(() => {
    if (token) {
      initializeDevice();
    }
  }, [token]);

  // Handle start/stop call
  useEffect(() => {
    if (isCalling) {
      startDialer();
    } else {
      endDialer();
    }
  }, [isCalling, activeContactIndex]);

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
