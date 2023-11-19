import { useEffect, useState } from "react";
import { Call, Device } from "@twilio/voice-sdk";
import {
  Button,
  Card,
  HoverCard,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { Box, Flex } from "@mantine/core";
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
import { useAppSelector } from "../../store/hooks";
import AlphaDialerStyled from "./AlphaDialer.styles";
import { Call as TCall } from "../../types";
import DialerQueue from "./DialerQueue";
import CallerIdSelect from "./CallerIdSelect";
import { IconPlayerPlay, IconPlayerSkipForward } from "@tabler/icons-react";
import { DialerLeadDetail } from "./DialerLeadDetail";
import { PiPhone, PiPhoneDisconnect } from "react-icons/pi";
import { useDeductTrialCreditMutation } from "../../services/trial-credit";
import { dialerSignal } from "./Dialer.signal";

function AlphaDialer() {
  const [starting, setStarting] = useState(false);
  const { dialQueue, fromNumber } = useAppSelector((state) => state.dialer);
  const jwtDecoded = useAppSelector(selectJwtDecoded);
  const { subscriptionActive } = useAppSelector((state) => state.user);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();
  const [deductTrialCredit] = useDeductTrialCreditMutation();

  async function initializeDevice() {
    dialerSignal.error = "";

    if (!dialerSignal.token) {
      dialerSignal.error = "No token found";
      return;
    }

    const device = new Device(dialerSignal.token, {
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
    dialerSignal.device = device;
  }

  // TODO: Reevaluate for performance enhancements
  // Consider: lags that happens when opening websocket
  // Consider: lag to init start up client before call (even more delay before call - users not happy)
  async function fetchToken() {
    try {
      const { data } = await apiService("/dialer/token");
      const token = data.token;
      dialerSignal.token = token;
      initializeDevice();
    } catch (err) {
      dialerSignal.error =
        "An error occurred. See your browser console for more information.";
    }
  }

  // Begin calling the current index
  async function startCall() {
    // Clear error
    dialerSignal.error = "";

    // Check for device
    if (!dialerSignal.device) {
      dialerSignal.error = "No device initialized";
      return;
    }

    // Check for items in queue
    if (dialQueue.length === 0) {
      dialerSignal.error =
        "No leads in call queue, be sure to add some before running the dialer";
      return;
    }

    // Initialize index if none provided AND current index is not set
    if (dialerSignal.dialQueueIndex === null) {
      dialerSignal.dialQueueIndex = 0;
    }

    // Check for phone number
    if (!dialQueue[dialerSignal.dialQueueIndex].phone) {
      dialerSignal.error = "No phone number found";
      return;
    }

    // Initialize or increment current dial attempts
    if (dialerSignal.currentDialAttempts === null) {
      dialerSignal.currentDialAttempts = 0;
    } else {
      dialerSignal.currentDialAttempts = dialerSignal.currentDialAttempts + 1;
    }

    if (jwtDecoded === null || jwtDecoded.id === null) {
      dialerSignal.error = "No jwt or user id found";
      return;
    }

    const params = {
      To: dialQueue[dialerSignal.dialQueueIndex].phone,
      From: fromNumber,
      user_id: jwtDecoded.id, // TODO: evaluate if this was necessary
    };

    // Start Call
    console.log("starting call... device", dialerSignal.device);
    const c = (await dialerSignal.device.connect({ params })) as Call;

    dialerSignal.isDialing = true;

    // Occurs when:
    // - Call initializes (initially returns as `false`)
    // - Call connects and begins ringing
    // Note: Using `once` instead to avoid multiple calls, this poses a risk because we are now
    // assuming that ringing will get to `true` since the initial (and only returned value now)
    // is `false` ... address this in  the future if issues occur
    c.once("ringing", async () => {
      console.info("call.ringing");

      // "currentCallId exists, skipping creation of new Call record" ??
      if (dialerSignal.currentCallId !== null) {
        return;
      }

      if (dialerSignal.dialQueueIndex === null) {
        return;
      }

      const lead = dialQueue[dialerSignal.dialQueueIndex];

      if (!lead) {
        dialerSignal.error = "No lead found";
        return;
      }

      const newCall: Partial<TCall> = {
        user_id: jwtDecoded?.id,
        lead_id: lead.id,
        from_number: fromNumber,
        to_number: lead.phone || undefined,
      };

      try {
        // Create Call record
        const newCallRecord = await addCall(newCall).unwrap();
        dialerSignal.currentCallId = newCallRecord.id;

        // Deduct (1) credit from trial
        await deductTrialCredit(1);
      } catch (e) {
        dialerSignal.error = extractErrorMessage(e);
      }
    });

    // Occurs when:
    // - Lead answers the call
    // - Call goes to voicemail
    c.on("accept", async (call: Call) => {
      console.info("call.accept");
      dialerSignal.wasCallConnected = true;

      try {
        if (dialerSignal.currentCallId === null) {
          throw Error("No call ID found");
        }

        await updateCallViaId({
          id: dialerSignal.currentCallId,
          twilio_call_sid: call.parameters["CallSid"],
          was_answered: true,
        }).unwrap();
      } catch (e) {
        dialerSignal.error = extractErrorMessage(e);
      }
    });

    // Occurs when:
    // - Call ends (user hangs up, lead hangs up, voicemail ends)
    c.on("disconnect", async (a) => {
      console.info("call.disconnect", a);
    });

    // Occurs when:
    // - An error is thrown
    c.on("error", async (e: unknown) => {
      console.info("call.error");
      dialerSignal.error = extractErrorMessage(e);
    });

    dialerSignal.call = c;
  }

  // Invoked when:
  // - Next arrow is click
  async function continueToNextLead() {
    // Check for existing index before proceeding
    if (dialerSignal.dialQueueIndex === dialQueue.length - 1) {
      notifications.show({
        message: "You've made it through all of your leads! Great job 🎉",
      });

      dialerSignal.dialQueueIndex = null;
      return;
    }

    // Check for null dial index
    if (dialerSignal.dialQueueIndex === null) {
      dialerSignal.error =
        "Dial index is null. Try selecting a different lead and trying again";
      return;
    }

    // Point to the next Lead in the queue
    const value = dialerSignal.dialQueueIndex + 1;
    dialerSignal.dialQueueIndex = value;

    // Reset attempt count
    dialerSignal.currentDialAttempts = 0;

    // Check for null active index
    if (dialerSignal.dialQueueIndex === null) {
      return console.error("No active contact index found");
    }

    // Stop if we're at the last index of the queue
    if (dialerSignal.dialQueueIndex === dialQueue.length - 1) {
      return console.info("No more leads to dial");
    }

    // We're safe to proceed
    startCall();
  }

  // Invoked when:
  // - Stop button is clicked
  // - An error occurs
  // - Call disconnects ?
  async function stopCall() {
    // Bug: no call is found when this gets invoked
    if (dialerSignal.call) {
      dialerSignal.call.disconnect();
    }

    // Stop timer
    if (dialerSignal.currentCallTimer) {
      clearTimeout(dialerSignal.currentCallTimer);
    }

    if (dialerSignal.currentCallId === null) {
      dialerSignal.error = "No Call ID found";
    } else {
      try {
        await endCallViaId(dialerSignal.currentCallId).unwrap();
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    }

    if (dialerSignal.currentCallId !== null) {
      try {
        await endCallViaId;
      } catch (e) {
        dialerSignal.error = extractErrorMessage(e);
      }
    }

    resetDialerState();
  }

  function resetDialerState() {
    dialerSignal.isDialing = false;
    dialerSignal.call = null;
    dialerSignal.currentCallId = null;
    dialerSignal.wasCallConnected = false;
    dialerSignal.currentCallTimer = null;
    dialerSignal.error = "";
    dialerSignal.currentDialAttempts = 0;
  }

  function startDialer() {
    // Start from 0 UNLESS there is a currently selected index
    const newIndex =
      dialerSignal.dialQueueIndex === null ? 0 : dialerSignal.dialQueueIndex;
    dialerSignal.dialQueueIndex = newIndex;
    startCall();
  }

  function requestContinue() {
    if (dialerSignal.dialQueueIndex === null) {
      dialerSignal.error = "Dial queue index is null";
      return;
    }

    // Check for next index
    if (dialerSignal.dialQueueIndex === dialQueue.length - 1) {
      dialerSignal.dialQueueIndex = 0;
    } else {
      dialerSignal.dialQueueIndex = dialerSignal.dialQueueIndex + 1;
    }

    startCall();
  }

  //////////////////////// HOOKS ///////////////////////////

  // Get token
  // Create device instance
  useEffect(() => {
    if (starting) {
      return;
    }

    setStarting(true);

    // No token found, get it
    if (!dialerSignal.token) {
      fetchToken();
    }
  }, [starting, setStarting, fetchToken]);

  return (
    <AlphaDialerStyled $visible={dialerSignal.visible}>
      <Box className="controls">
        <Flex align="flex-start" justify="space-between">
          <Card
            withBorder
            pt="0.5rem"
            style={{
              overflow: "visible",
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Flex justify="flex-start" align="center">
              <Flex justify="flex-start" align="flex-end" mr={36}>
                <ThemeIcon mr="xs" size="xl" variant="gradient">
                  <PiPhone fontSize="1.75rem" />
                </ThemeIcon>
                <Title order={2}>Dialer</Title>
              </Flex>

              <Flex align="flex-end">
                <Tooltip
                  openDelay={500}
                  position="bottom"
                  label="The selected phone number is what we will use to call your
                      leads. This number will appear as your caller ID on the lead's phone."
                >
                  <div>
                    <CallerIdSelect pr="xs" w={180} />
                  </div>
                </Tooltip>
              </Flex>
            </Flex>

            <Flex align="flex-end" h={60}>
              {!subscriptionActive ? (
                <HoverCard width={280} shadow="md">
                  <HoverCard.Target>
                    <Button
                      mx={4}
                      style={{ border: "1px solid red" }}
                      className="disabled-button"
                      leftIcon={<IconPlayerPlay />}
                    >
                      Start dialer
                    </Button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm">
                      It looks like you've run out of trial credits or your
                      subscription is currently inactive. Please upgrade your
                      subscription to enable feature this feature again 😊
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              ) : dialerSignal.dialQueueIndex === null ? (
                <Tooltip
                  label="Begin making calls to the leads in the Call queue"
                  openDelay={500}
                >
                  <Button
                    mx={4}
                    variant="gradient"
                    onClick={startDialer}
                    leftIcon={<IconPlayerPlay />}
                  >
                    Start dialer
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip
                  label="Continue to the next lead in the Call queue"
                  openDelay={500}
                >
                  <Button
                    mx={4}
                    variant="gradient"
                    onClick={requestContinue}
                    leftIcon={<IconPlayerPlay />}
                    disabled={!!dialerSignal.call}
                  >
                    Continue
                  </Button>
                </Tooltip>
              )}
              <Tooltip label="Hang up" openDelay={500}>
                <Button
                  mx={4}
                  color="red"
                  disabled={!dialerSignal.call}
                  leftIcon={<PiPhoneDisconnect fontSize="1.5rem" />}
                  onClick={stopCall}
                >
                  Hang up
                </Button>
              </Tooltip>

              <Tooltip label="Skip to next Lead">
                <Button
                  variant="outline"
                  disabled={!dialerSignal.call || !subscriptionActive}
                  leftIcon={<IconPlayerSkipForward />}
                  onClick={continueToNextLead}
                  mx={4}
                >
                  Next lead
                </Button>
              </Tooltip>
            </Flex>
          </Card>
        </Flex>

        <Flex className="split">
          <Box m="md">
            <DialerQueue />

            {dialerSignal.error && (
              <Card withBorder mt="md">
                <Text>Error</Text>
                <Text color="red">{dialerSignal.error}</Text>
              </Card>
            )}
          </Box>
          <Box m="md">
            <DialerLeadDetail />
          </Box>
        </Flex>
      </Box>
    </AlphaDialerStyled>
  );
}

export default AlphaDialer;
