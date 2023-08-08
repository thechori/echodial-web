import { useEffect } from "react";
import { Device } from "@twilio/voice-sdk";
import {
  Button,
  Container,
  Select,
  Title,
  Flex,
  Grid,
  Card,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
//
import DialerStyled from "./Dialer.styles";
import apiService from "../../services/api";
import numbers from "../../configs/numbers";
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

function Dialer() {
  const dispatch = useAppDispatch();
  const { call, device, token, fromNumber, contactQueue, activeContactIndex } =
    useAppSelector((state) => state.dialer);

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

    console.log("params", params);

    // Start Call #1
    const call = await device.connect({ params });

    call.on("accept", () => {
      dispatch(setStatus("accepted"));
      notifications.show({
        title: "Call update",
        message: "Accepted",
      });
    });

    call.on("mute", (isMuted: boolean) => {
      dispatch(setIsMuted(isMuted));
    });

    call.on("disconnect", () => {
      dispatch(setIsMuted(false));
    });

    call.on("error", (error: unknown) => {
      console.log("error", error);
      notifications.show({
        title: "Call update",
        message: "There was an error. Please try again.",
      });
      dispatch(setError("There was an error. Please try again."));
      dispatch(setActiveContactIndex(null));
      dispatch(setCall(null));
    });

    dispatch(setCall(call));
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

  return (
    <DialerStyled>
      <Container fluid size="xl">
        <Flex justify={"space-between"} align={"center"} py="md">
          <Title order={1}>Dialer</Title>
          <Flex align="center">
            {device ? (
              <Flex align="flex-end">
                <Select
                  px="xs"
                  label="Your number"
                  placeholder="Pick one"
                  data={numbers}
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
              <Title order={2}>Call history</Title>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </DialerStyled>
  );
}

export default Dialer;
