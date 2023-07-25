import { useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import {
  Button,
  Container,
  Select,
  Title,
  Flex,
  Grid,
  Text,
  Stack,
} from "@mantine/core";
//
import DialerStyled from "./Dialer.styles";
import apiService from "../../services/api";
import numbers from "../../configs/numbers";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setContactQueue,
  setActiveContact,
  setFromNumber,
  setToken,
} from "../../store/dialer/slice";
import ActiveCall from "./ActiveCall";
import ContactQueue from "./ContactQueue";
import { TContact } from "../../store/contacts/types";

/**

- [x] Ability to trigger 1 call
- [ ] Ability to trigger 3 concurrent calls
- [ ] Ability to listen to first call made
- [ ] Ability to be notified of someone picking up on another line (and is now currently on hold)
- [ ] Ability for person on hold to be greeted with a prerecorded message
- [ ] Ability to switch between calls
*/

function Dialer() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [device, setDevice] = useState<any>(null);
  const [call, setCall] = useState<any>(null);
  const { token, fromNumber, contactQueue, activeContact } = useAppSelector(
    (state) => state.dialer
  );

  async function startupClient() {
    try {
      const { data } = await apiService("/dialer/token");
      console.log("Got a token.");
      const token = data.token;
      dispatch(setToken(token));
    } catch (err) {
      console.log(err);

      setError(
        "An error occurred. See your browser console for more information."
      );
    }
  }

  async function initializeDevice() {
    setError("");

    if (!token) {
      setError("No token found");
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

    setDevice(device);
  }

  function stopDialer() {
    if (call) {
      // return setError("No call in progress");
      call.disconnect();
    }

    // Move contact back into queue (at the front)
    const contactQueueUpdated: TContact[] = [...contactQueue];

    if (activeContact) {
      contactQueueUpdated.unshift(activeContact);
    }

    dispatch(setActiveContact(null));
    dispatch(setContactQueue(contactQueueUpdated));
  }

  /**
   * Clicking this will take the first item in the `contacts` array, add
   * them to the currentContact
   */
  async function startDialer() {
    if (!device) {
      return setError("No device found.");
    }

    if (!contactQueue.length) {
      return setError("No contacts in the queue");
    }

    // Grab first index (shift) from `contactQueue` and set to `activeContact`
    const contactQueueUpdated: TContact[] = [...contactQueue];

    const contact = contactQueueUpdated.shift();

    if (!contact) {
      return setError("No contact found");
    }

    dispatch(setActiveContact(contact));
    dispatch(setContactQueue(contactQueueUpdated));

    var params = {
      To: contact.phone,
      From: fromNumber,
    };

    // Start Call #1
    const call = await device.connect({ params });

    setCall(call);
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
        <Flex justify={"space-between"} align={"center"}>
          <Title order={2}>Dialer</Title>
          <Button
            className={`startup ${device ? "active" : "inactive"}`}
            onClick={startupClient}
          >
            {device ? "Device activated" : "Startup device"}
          </Button>
          <div className={`settings ${device && "active"}`}>
            <Button disabled={call} onClick={startDialer}>
              Start Dialer
            </Button>
            <Button disabled={!call} onClick={stopDialer}>
              Stop Dialer
            </Button>
          </div>
          <Select
            label="Your number"
            placeholder="Pick one"
            data={numbers}
            value={fromNumber}
            onChange={(number) => dispatch(setFromNumber(number))}
          />
        </Flex>
        <Grid>
          <Grid.Col xs={12} sm={7}>
            <Stack>
              <ActiveCall />
            </Stack>
          </Grid.Col>
          <Grid.Col xs={12} sm={5}>
            <ContactQueue />
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
