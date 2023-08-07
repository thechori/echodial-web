import { useEffect } from "react";
import { Device } from "@twilio/voice-sdk";
import {
  Button,
  Container,
  Select,
  Title,
  Flex,
  Grid,
  Text,
  Card,
} from "@mantine/core";
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
} from "../../store/dialer/slice";
import ActiveCall from "./ActiveCall";
import ContactQueue from "./ContactQueue";

function Dialer() {
  const dispatch = useAppDispatch();
  const {
    call,
    device,
    token,
    fromNumber,
    contactQueue,
    error,
    activeContactIndex,
  } = useAppSelector((state) => state.dialer);

  async function startupClient() {
    try {
      const { data } = await apiService("/dialer/token");
      const token = data.token;
      dispatch(setToken(token));
    } catch (err) {
      dispatch(
        setError(
          "An error occurred. See your browser console for more information."
        )
      );
    }
  }

  async function initializeDevice() {
    dispatch(setError(""));

    if (!token) {
      dispatch(setError("No token found"));
      return;
    }

    console.log("token", token);

    const device = new Device(token, {
      logLevel: 1,
      // @ts-ignore
      codecPreferences: ["opus", "pcmu"],
    });

    device.on("incoming", () => alert("you've got an incoming call"));

    // Device must be registered in order to receive incoming calls
    device.register();

    dispatch(setDevice(device));
  }

  function stopDialer() {
    if (!call) {
      return dispatch(setError("No call in progress"));
    }

    call.disconnect();
    dispatch(setCall(null));
    dispatch(setActiveContactIndex(null));
  }

  /**
   * Clicking this will take the first item in the `contacts` array, add
   * them to the currentContact
   */
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

    console.log(
      "contactQueue[activeContactIndex].phone: ",
      contactQueue[activeContactIndex].phone
    );

    var params = {
      To: contactQueue[activeContactIndex].phone,
      From: fromNumber,
    };

    // Start Call #1
    const call = await device.connect({ params });

    call.on("accept", () => {
      dispatch(setStatus("accepted"));
    });

    call.on("error", (error: unknown) => {
      console.log("error", error);
      dispatch(setError("There was an error. Please try again."));
      dispatch(setActiveContactIndex(null));
      dispatch(setCall(null));
    });

    dispatch(setCall(call));
    dispatch(setActiveContactIndex(0));
  }

  // Initialize device once a token exists
  useEffect(() => {
    if (token) {
      initializeDevice();
    }
  }, [token]);

  useEffect(() => {
    console.log("activeContactIndex", activeContactIndex);
    if (activeContactIndex !== null) {
      startDialer();
    }
  }, [activeContactIndex]);

  return (
    <DialerStyled>
      <Container size="xl">
        <Flex justify={"space-between"} align={"center"} py="md">
          <Title order={1}>Dialer</Title>
          <Flex align="center">
            {device ? (
              <Flex align="flex-end">
                {call ? (
                  <Button px="xs" disabled={!call} onClick={stopDialer}>
                    Stop Dialer
                  </Button>
                ) : (
                  <Button
                    px="xs"
                    disabled={!!call}
                    // TODO: extend this logic
                    onClick={() => dispatch(setActiveContactIndex(0))}
                  >
                    Start Dialer
                  </Button>
                )}

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
            <Card withBorder shadow="md">
              <ActiveCall />
            </Card>
          </Grid.Col>
          <Grid.Col xs={12} sm={12} md={6}>
            <Card withBorder shadow="md">
              <ContactQueue />
            </Card>
          </Grid.Col>
        </Grid>

        <Flex>
          <Text>{error}</Text>
        </Flex>
      </Container>
    </DialerStyled>
  );
}

export default Dialer;
