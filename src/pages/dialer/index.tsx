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
} from "@mantine/core";
//
import DialerStyled from "./Dialer.styles";
import apiService from "../../services/api";
import numbers from "../../configs/numbers";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setContactQueue,
  setContactsActive,
  setFromNumber,
  setToken,
} from "../../store/dialer/slice";
import ActiveCalls from "./ActiveCalls";
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

const numbersToCall = ["+18326460869", "+18328638635"];

function Dialer() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [device, setDevice] = useState<any>(null);
  const { token, call, status, fromNumber, contactQueue, contactsActive } =
    useAppSelector((state) => state.dialer);

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

    // Device must be registered in order to receive incoming calls
    device.register();

    setDevice(device);
  }

  function stopDialer() {
    if (call) {
      // return setError("No call in progress");
      call.disconnect();
    }

    // Move contacts back into queue (at the front)
    // Add numbers to `contactsActive`
    const contactsToStart: TContact[] = [...contactsActive];
    const contactQueueUpdated: TContact[] = [...contactQueue];

    console.log("contactQueueUpdated", contactQueueUpdated);

    // @ts-ignore
    contactQueueUpdated.unshift(contactsToStart.pop());
    // @ts-ignore
    contactQueueUpdated.unshift(contactsToStart.pop());

    dispatch(setContactsActive([]));
    dispatch(setContactQueue(contactQueueUpdated));
  }

  /**
   * Clicking this will take the first 2 items in the `contacts` array, add
   * them to the activeContacts
   */
  async function startDialer() {
    if (!device) {
      console.log("Unable to make call.");
      return setError("No device found.");
    }

    if (!contactQueue.length) {
      return setError("No contacts in the queue");
    }

    // Add numbers to `contactsActive`
    const contactsToStart: TContact[] = [];
    const contactQueueUpdated: TContact[] = [...contactQueue];

    console.log("contactQueueUpdated", contactQueueUpdated);

    // @ts-ignore
    contactsToStart.push(contactQueueUpdated.shift());
    // @ts-ignore
    contactsToStart.push(contactQueueUpdated.shift());

    dispatch(setContactsActive(contactsToStart));
    dispatch(setContactQueue(contactQueueUpdated));

    // Start call
    // const call = await device.connect({
    //   To: ,
    //   From: fromNumber
    // })

    // numbersToCall.forEach(async (number, index) => {
    //   if (index > 0) return;
    //   // Twilio.Device.connect() returns a Call object
    //   const call = await device.connect({
    //     To: number,
    //     From: fromNumber,
    //   });

    //   // Events
    //   call.on("accept", () => setStatus("accepted"));
    //   call.on("disconnect", () => setStatus("ended"));
    //   call.on("cancel", () => setStatus("canceled"));
    //   call.on("reject", () => setStatus("rejected"));
    //   // call.on("mute", (isMuted: boolean) => {
    //   //   setMuted(isMuted);
    //   // });
    //   call.on("answer", (props: any) => {
    //     setStatus("answered");
    //     console.log("answer.props", props);
    //   });
    //   call.on("ack", (props: any) => {
    //     console.log("ack.props", props);
    //   });
    //   call.on("message", (props: any) => {
    //     console.log("message.props", props);
    //   });
    // });
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
            <Button onClick={startDialer}>Start Dialer</Button>
            <Button onClick={stopDialer}>Stop Dialer</Button>
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
            <ActiveCalls />
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
