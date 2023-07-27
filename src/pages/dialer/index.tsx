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
  setActiveContact,
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
  const { call, device, token, fromNumber, contactQueue, error } =
    useAppSelector((state) => state.dialer);

  async function startupClient() {
    try {
      const { data } = await apiService("/dialer/token");
      console.log("Got a token.");
      const token = data.token;
      dispatch(setToken(token));
    } catch (err) {
      console.log(err);

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

    const device = new Device(token, {
      logLevel: 1,
      // @ts-ignore
      codecPreferences: ["opus", "pcmu"],
    });

    // TODO: look into this
    // device.on("incoming", handleIncomingCall);

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
    dispatch(setActiveContact(null));
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

    var params = {
      To: contactQueue[0].phone,
      From: fromNumber,
    };

    // Start Call #1
    const call = await device.connect({ params });

    call.on("accept", (accept: string) => {
      console.log("accept", accept);
      dispatch(setStatus("accepted"));
    });

    call.on("error", (error: string) => {
      console.log("error", error);
      dispatch(setError(error));
    });

    dispatch(setCall(call));
    dispatch(setActiveContact(contactQueue[0]));
  }

  // Initialize device once a token exists
  useEffect(() => {
    if (token) {
      initializeDevice();
    }
  }, [token]);

  return (
    <DialerStyled>
      <Container size="xl">
        <Flex justify={"space-between"} align={"center"} py="md">
          <Title order={1}>Dialer</Title>
          <div>
            {device ? (
              <Flex align="center">
                {call ? (
                  <Button px="xs" disabled={!call} onClick={stopDialer}>
                    Stop Dialer
                  </Button>
                ) : (
                  <Button px="xs" disabled={!!call} onClick={startDialer}>
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
          </div>
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
