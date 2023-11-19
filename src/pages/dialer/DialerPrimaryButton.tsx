import { Box, Button, Flex, HoverCard, Text, Tooltip } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import { PiPhoneDisconnect } from "react-icons/pi";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { dialStateInstance } from "./DialState.class";
import { setDialQueueIndex, setRequestAction } from "../../store/dialer/slice";

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

  // function requestContinue() {
  //   if (dialStateInstance.dialQueueIndex === null) {
  //     dialStateInstance.error = "Dial queue index is null";
  //     dispatch(setError(dialStateInstance.error));
  //     return;
  //   }

  //   // Check for next index
  //   if (dialStateInstance.dialQueueIndex === dialQueue.length - 1) {
  //     dialStateInstance.dialQueueIndex = 0;
  //     dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));
  //   } else {
  //     dialStateInstance.dialQueueIndex = dialStateInstance.dialQueueIndex + 1;
  //     dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));
  //   }

  //   dispatch(setRequestAction("startCall"));
  // }

  function requestStopDialer() {
    dispatch(setRequestAction("stopDialing"));
  }

  return (
    <Flex>
      <Box>
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
        ) : dialStateInstance.dialQueueIndex === null && !call ? (
          <Tooltip
            label="Begin making calls to the leads in the Call queue"
            openDelay={500}
          >
            <Button
              mx={4}
              variant="gradient"
              onClick={requestStartDialer}
              leftIcon={<IconPlayerPlay />}
            >
              Start dialer
            </Button>
          </Tooltip>
        ) : (
          <Tooltip label="Hang up" openDelay={500}>
            <Button
              mx={4}
              color={status === "connected" ? "red" : "purple"}
              onClick={requestStopDialer}
              disabled={!call}
              leftIcon={<PiPhoneDisconnect fontSize="1.5rem" />}
            >
              Hang up
            </Button>
          </Tooltip>
        )}
      </Box>
    </Flex>
  );
};

export { DialerPrimaryButton };
