import { useCallback, useEffect, useState } from "react";
import { Call, Device } from "@twilio/voice-sdk";
import { Text, Tooltip } from "@mantine/core";
import { Box, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { MdInfoOutline } from "react-icons/md";
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
import {
  setError,
  setDevice,
  setCall,
  setCurrentCallId,
  setToken,
  setCurrentDialAttempts,
  setRequestAction,
  setConnectedAt,
  setActiveLead,
  setStatus,
} from "../../store/dialer/slice";
import { DialerStyled, DialerStatus } from "./Dialer.styles";
import { Call as TCall } from "../../types";
import CallerIdSelect from "./CallerIdSelect";
import { dialStateInstance } from "./DialState.class";
import { useDeductTrialCreditMutation } from "../../services/trial-credit";
import { DialerPrimaryButton } from "./DialerPrimaryButton";
import phoneFormatter from "../../utils/phone-formatter";
import { Duration, intervalToDuration } from "date-fns";
import * as amplitude from "@amplitude/analytics-browser";
import { useGetLeadsQuery } from "../../services/lead";

function Dialer() {
  const dispatch = useAppDispatch();
  const [starting, setStarting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("0:00:00");

  const jwtDecoded = useAppSelector(selectJwtDecoded);
  const { data: leads } = useGetLeadsQuery();
  const {
    requestAction,
    call,
    device,
    token,
    fromNumber,
    error,
    status,
    connectedAt,
    activeLead,
  } = useAppSelector((state) => state.dialer);
  //
  const [addCall] = useAddCallMutation();
  const [updateCallViaId] = useUpdateCallViaIdMutation();
  const [endCallViaId] = useEndCallMutation();
  const [deductTrialCredit] = useDeductTrialCreditMutation();

  const initializeDevice = useCallback(async () => {
    dispatch(setError(""));

    if (!dialStateInstance.token) {
      dispatch(setError("No token found"));
      return;
    }

    const device = new Device(dialStateInstance.token, {
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

    dialStateInstance.device = device;
    dispatch(setDevice(device));
  }, [dispatch]);

  // TODO: Reevaluate for performance enhancements
  // Consider: lags that happens when opening websocket
  // Consider: lag to init start up client before call (even more delay before call - users not happy)
  const fetchToken = useCallback(async () => {
    try {
      const { data } = await apiService("/dialer/token");
      const token = data.token;
      dispatch(setToken(token));
      dialStateInstance.token = token;
      initializeDevice();
    } catch (err) {
      dispatch(
        setError(
          "An error occurred. See your browser console for more information."
        )
      );
    }
  }, [dispatch, initializeDevice]);

  // Begin calling the current index
  const startCall = useCallback(async () => {
    amplitude.track("Start call");

    // Check for caller ID select
    if (!fromNumber) {
      notifications.show({
        message: "Please select a phone number to call from",
        color: "yellow",
      });
      dispatch(setError("Please select a phone number to call from"));
      return;
    }

    await stopCall();

    // Clear error
    dialStateInstance.error = "";
    dispatch(setError(dialStateInstance.error));

    // Check for device
    if (!dialStateInstance.device) {
      dispatch(setError("No device initialized"));
      return;
    }

    dispatch(setActiveLead(dialStateInstance.activeLead));

    // Initialize or increment current dial attempts
    if (dialStateInstance.currentDialAttempts === null) {
      dialStateInstance.currentDialAttempts = 0;
    } else {
      dialStateInstance.currentDialAttempts =
        dialStateInstance.currentDialAttempts + 1;
    }

    dispatch(setCurrentDialAttempts(dialStateInstance.currentDialAttempts));

    if (!leads) {
      dispatch(setError("No leads found"));
      return;
    }

    if (!activeLead) {
      dispatch(
        setError(`Lead with id ${dialStateInstance.activeLead} not found`)
      );
      return;
    }

    if (!activeLead.phone) {
      dispatch(setError("No phone number found"));
      return;
    }

    if (!jwtDecoded || !jwtDecoded.id) {
      dispatch(setError("No user id found in jwt"));
      return;
    }

    if (activeLead.phone === fromNumber) {
      dispatch(setError("A phone number cannot call itself"));
      return;
    }

    const connectOptions: Device.ConnectOptions = {
      params: {
        To: activeLead.phone,
        From: fromNumber,
        user_id: jwtDecoded.id.toString(),
      },
    };

    // Start Call
    const c = (await device.connect(connectOptions)) as Call;

    dialStateInstance.status = Call.State.Connecting;
    dispatch(setStatus(dialStateInstance.status));

    // Occurs when:
    // - Call initializes (initially returns as `false`)
    // - Call connects and begins ringing
    // Note: Using `once` instead to avoid multiple calls, this poses a risk because we are now
    // assuming that ringing will get to `true` since the initial (and only returned value now)
    // is `false` ... address this in  the future if issues occur
    c.once("ringing", async () => {
      dialStateInstance.status = Call.State.Ringing;
      dispatch(setStatus(dialStateInstance.status));

      // "currentCallId exists, skipping creation of new Call record" ??
      if (dialStateInstance.currentCallId !== null) {
        return;
      }

      if (dialStateInstance.activeLead === null) {
        return;
      }

      const newCall: Partial<TCall> = {
        user_id: jwtDecoded?.id,
        lead_id: activeLead.id,
        from_number: fromNumber,
        to_number: activeLead.phone || undefined,
      };

      try {
        // Create Call record
        const newCallRecord = await addCall(newCall).unwrap();
        dialStateInstance.currentCallId = newCallRecord.id;
        dispatch(setCurrentCallId(dialStateInstance.currentCallId));

        // Deduct (1) credit from trial
        await deductTrialCredit(1);
      } catch (e) {
        notifications.show({
          title: "Error",
          message: extractErrorMessage(e),
        });
      }
    });

    // Occurs when:
    // - Lead answers the call
    // - Call goes to voicemail
    c.on("accept", async (call: Call) => {
      dialStateInstance.status = call.status();
      dispatch(setStatus(dialStateInstance.status));

      const now = new Date();
      dialStateInstance.connectedAt = now;
      dispatch(setConnectedAt(dialStateInstance.connectedAt));

      try {
        if (dialStateInstance.currentCallId === null) {
          throw Error("No call ID found");
        }

        await updateCallViaId({
          id: dialStateInstance.currentCallId,
          twilio_call_sid: call.parameters["CallSid"],
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
    // - Call ends (user hangs up, lead hangs up, voicemail ends)
    c.on("disconnect", async () => {
      dialStateInstance.status = Call.State.Closed;
      dispatch(setStatus(dialStateInstance.status));
      dispatch(setRequestAction("stopCall"));
    });

    // Occurs when:
    // - An error is thrown
    c.on("error", async (e: unknown) => {
      dialStateInstance.status = Call.State.Closed;
      dispatch(setStatus(dialStateInstance.status));
      dispatch(setRequestAction("stopCall"));

      const errorMessage = extractErrorMessage(e);
      notifications.show({
        title: "Call error",
        message: errorMessage,
      });
      dialStateInstance.error = errorMessage;
      dispatch(setError(dialStateInstance.error));
    });

    dialStateInstance.call = c;
    dispatch(setCall(dialStateInstance.call));

    return true;
  }, [
    addCall,
    deductTrialCredit,
    device,
    dispatch,
    leads,
    activeLead,
    fromNumber,
    jwtDecoded?.id,
    updateCallViaId,
  ]);

  const resetDialerState = useCallback(() => {
    dialStateInstance.call = null;
    dispatch(setCall(dialStateInstance.call));
    dialStateInstance.currentCallId = null;
    dispatch(setCurrentCallId(dialStateInstance.currentCallId));
  }, [dispatch]);

  // Invoked when:
  // - Stop button is clicked
  // - An error occurs
  // - Call disconnects
  const stopCall = useCallback(async () => {
    amplitude.track("Stop call");

    dialStateInstance.connectedAt = null;
    dispatch(setConnectedAt(dialStateInstance.connectedAt));
    try {
      if (dialStateInstance.call) {
        dialStateInstance.call.disconnect();
      }

      if (dialStateInstance.currentCallId !== null) {
        await endCallViaId(dialStateInstance.currentCallId).unwrap();
      }
    } catch (e) {
      notifications.show({
        title: "Error",
        message: extractErrorMessage(e),
      });
    }

    resetDialerState();

    return true;
  }, [dispatch, endCallViaId, resetDialerState]);

  //////////////////////// HOOKS ///////////////////////////

  // Get token
  // Create device instance
  useEffect(() => {
    if (starting) {
      return;
    }

    setStarting(true);

    // No token found, get it
    if (!token) {
      fetchToken();
    }
  }, [token, starting, setStarting, fetchToken]);

  // Handle request actions
  // TODO: reconsider if this is necessary now that we have the DialState class singleton (ftw)
  useEffect(() => {
    if (!requestAction) {
      return;
    }

    switch (requestAction) {
      case "startCall": {
        startCall();
        dispatch(setRequestAction(null));
        break;
      }

      case "stopCall": {
        stopCall();
        dispatch(setRequestAction(null));
        break;
      }

      default: {
        dispatch(setRequestAction(null));
      }
    }
  }, [requestAction, call, dispatch, stopCall, startCall]);

  useEffect(() => {
    if (!connectedAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const duration = intervalToDuration({ start: connectedAt, end: now });
      const formattedTime = formatDuration(duration);
      setElapsedTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [connectedAt]);

  const formatDuration = (duration: Duration) => {
    const hours = String(duration.hours).padStart(1, "0");
    const minutes = String(duration.minutes).padStart(2, "0");
    const seconds = String(duration.seconds).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Name, phone
  let name = "";
  let phone = "";

  if (activeLead !== null) {
    name = `${activeLead.first_name || ""} ${activeLead.last_name || ""}`;
    phone = phoneFormatter(activeLead.phone) || "";
  }

  return (
    // Don't show the Dialer if there are no leads in the queue
    <DialerStyled $state={"collapsed"}>
      <Flex
        align="flex-start"
        justify="space-between"
        bg="white"
        p="md"
        style={{ borderTop: "1px solid lightgrey" }}
      >
        <Flex
          align="center"
          justify="space-between"
          style={{
            overflow: "visible",
            flex: 1,
          }}
        >
          <Flex justify="flex-start" align="center">
            <Flex align="center">
              <DialerPrimaryButton />

              {/* <Tooltip label="Skip to next Lead" openDelay={500}>
                <ActionIcon
                  size="lg"
                  disabled={!subscriptionActive}
                  onClick={() => dispatch(setRequestAction("skipToNextLead"))}
                  mx={4}
                >
                  <IconPlayerSkipForwardFilled />
                </ActionIcon>
              </Tooltip> */}

              <DialerStatus
                $visible={
                  status === Call.State.Connecting ||
                  status === Call.State.Ringing ||
                  status === Call.State.Open
                }
              >
                <Text size="sm" fw={500} className="duration">
                  {status === Call.State.Connecting
                    ? "Starting..."
                    : status === Call.State.Ringing
                    ? "Calling..."
                    : elapsedTime}
                </Text>
              </DialerStatus>

              <Box ml={16}>
                <Text fw={500} lh="1.1rem">
                  {name}
                </Text>
                <Text size="sm" lh="1.1rem">
                  {phone}
                </Text>

                <Text size="xs" color="red">
                  {error}
                </Text>
              </Box>
            </Flex>
          </Flex>

          <Flex align="center" h={60}>
            <Tooltip
              openDelay={500}
              position="bottom"
              label="The selected phone number is what we will use to call your
                      leads. This number will appear as your caller ID on the lead's phone."
            >
              <Flex mr={8}>
                <MdInfoOutline fontSize="1.5rem" color="grey" />
              </Flex>
            </Tooltip>

            <CallerIdSelect w={180} />
          </Flex>
        </Flex>
      </Flex>
    </DialerStyled>
  );
}

export default Dialer;
