import { Box, Flex, HoverCard, Text, Tooltip } from "@mantine/core";
import { PiPhoneDisconnect } from "react-icons/pi";
import { MdPhone } from "react-icons/md";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setRequestAction } from "../../store/dialer/slice";
import { Call } from "@twilio/voice-sdk";
import { EndButton, StartButton } from "./DialerPrimaryButton.styles";

/**
 * Primary action button for the dialer
 *
 * [x] Green call button when no call is active
 * [x] Red outline when call is pending
 * [x] Red solid when call is connected
 *
 */
const DialerPrimaryButton = () => {
  const dispatch = useAppDispatch();
  const { call, status, activeLead } = useAppSelector((state) => state.dialer);
  const { subscriptionActive } = useAppSelector((state) => state.user);

  function startCall() {
    dispatch(setRequestAction("startCall"));
  }

  function hangUp() {
    dispatch(setRequestAction("stopCall"));
  }

  return (
    <Flex>
      <Box mx="sm">
        {!subscriptionActive ? (
          <HoverCard width={280} shadow="md">
            <HoverCard.Target>
              <div>
                <StartButton disabled={!subscriptionActive}>
                  <MdPhone fontSize="1.5rem" />
                </StartButton>
              </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">
                It looks like you've run out of trial credits or your
                subscription is currently inactive. Please upgrade your
                subscription to enable feature this feature again 😊
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
        ) : !call ? (
          <Tooltip label="Begin calling selected lead" openDelay={500}>
            <StartButton
              onClick={startCall}
              className="hoverable"
              disabled={!activeLead}
            >
              <MdPhone fontSize="1.5rem" />
            </StartButton>
          </Tooltip>
        ) : (
          <Tooltip label="Hang up" openDelay={500}>
            <EndButton
              onClick={hangUp}
              $active={status === Call.State.Open}
              className="hoverable"
            >
              <PiPhoneDisconnect fontSize="1.5rem" />
            </EndButton>
          </Tooltip>
        )}
      </Box>
    </Flex>
  );
};

export { DialerPrimaryButton };
