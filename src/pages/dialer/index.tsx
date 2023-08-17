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
  setActiveContactIndex,
  setFromNumber,
  setToken,
  setError,
  setStatus,
  setDevice,
  setCall,
  setTokenLoading,
  setIsMuted,
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

function Dialer() {
  const dispatch = useAppDispatch();
  //
  const [callerIdItems, setCallerIdItems] = useState<SelectItem[]>([]);
  //
  const jwtDecoded = useAppSelector(selectJwtDecoded);
  const { call, device, token, fromNumber, contactQueue, activeContactIndex } =
    useAppSelector((state) => state.dialer);
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
        message: "Someone is calling your number.",
      });
    });

    // Device must be registered in order to receive incoming calls
    device.register();

    dispatch(setDevice(device));
  }

  async function startDialer() {
    if (!device) {
      return dispatch(setError("No device found."));
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

    // Start Call #1
    const call = await device.connect({ params });

    call.on("accept", async (call: Call) => {
      dispatch(setStatus("accepted"));
      notifications.show({
        title: "Call update",
        message: "Accepted",
      });

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

      notifications.show({ message: "New call registered in database" });
    });

    call.on("mute", (isMuted: boolean) => {
      dispatch(setIsMuted(isMuted));
    });

    call.on("disconnect", async (call: Call) => {
      dispatch(setIsMuted(false));
      dispatch(setStatus("disconnected"));

      try {
        const callToUpdate: Partial<TCall> = {
          twilio_call_sid: call.parameters["CallSid"],
          status: "Disconnected",
          // @ts-ignore
          disconnected_at: new Date().toISOString(),
        };
        await updateCall(callToUpdate).unwrap();
        notifications.show({
          message: "Successfully updated call in database",
        });
      } catch (e) {
        dispatch(setError(extractErrorMessage(e)));
      }
    });

    call.on("error", async (e: unknown) => {
      notifications.show({
        title: "Call error",
        message: extractErrorMessage(e),
      });
      dispatch(setActiveContactIndex(null));
      dispatch(setCall(null));
      dispatch(setStatus("error"));
    });
  }

  // Initialize device once a token exists
  useEffect(() => {
    if (token) {
      initializeDevice();
    }
  }, [token]);

  // Handle changing call index
  useEffect(() => {
    // End any existing
    if (call) {
      notifications.show({
        title: "Call update",
        message: "Disconnected",
      });
      call.disconnect();
      dispatch(setCall(null));
    }

    // Start new dial
    if (activeContactIndex !== null) {
      startDialer();
    }
  }, [activeContactIndex]);

  useEffect(() => {
    if (callerIds) {
      const items: SelectItem[] = callerIds.map((cid) => ({
        value: cid.phone_number,
        label: phoneFormatter(cid.phone_number) || "",
      }));
      setCallerIdItems(items);
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
