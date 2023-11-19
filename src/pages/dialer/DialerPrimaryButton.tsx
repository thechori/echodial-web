import { Box, Button, Flex, HoverCard, Text, Tooltip } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import { PiPhoneDisconnect } from "react-icons/pi";
import { MdPhone } from "react-icons/md";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { dialStateInstance } from "./DialState.class";
import { setDialQueueIndex, setRequestAction } from "../../store/dialer/slice";
import { Call } from "@twilio/voice-sdk";
import { EndButton, StartButton } from "./DialerPrimaryButton.styles";

/**
 * Primary action button for the dialer
 *
 * [ ] Green call button when no call is active
 * [ ] Red outline when call is pending
 * [ ] Red solid when call is connected
 *
 */
const DialerPrimaryButton = () => {
  const dispatch = useAppDispatch();
  const { call, status } = useAppSelector((state) => state.dialer);
  const { subscriptionActive } = useAppSelector((state) => state.user);

  function requestStartDialer() {
    // Start from 0 UNLESS there is a currently selected index
    const newIndex =
      dialStateInstance.dialQueueIndex === null
        ? 0
        : dialStateInstance.dialQueueIndex;

    dialStateInstance.dialQueueIndex = newIndex;
    dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));
    dispatch(setRequestAction("startCall"));
  }

  function requestStopDialer() {
    dispatch(setRequestAction("stopDialing"));
  }

  return (
    <Flex>
      <Box mx="sm">
        {!subscriptionActive ? (
          <HoverCard width={280} shadow="md">
            <HoverCard.Target>
              <Button
                mx={4}
                style={{ border: "1px solid red" }}
                className="disabled-button"
                leftIcon={<IconPlayerPlay />}
              >
                Start
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
        ) : !call ? (
          <Tooltip
            label="Begin making calls to the leads in the Call queue"
            openDelay={500}
          >
            <StartButton onClick={requestStartDialer} className="hoverable">
              <MdPhone fontSize="1.5rem" />
            </StartButton>
          </Tooltip>
        ) : (
          <Tooltip label="Hang up" openDelay={500}>
            <EndButton
              onClick={requestStopDialer}
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
