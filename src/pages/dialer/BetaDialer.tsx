import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconAdjustments,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconPlayerStopFilled,
} from "@tabler/icons-react";
import { MdPerson } from "react-icons/md";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setShowOptions } from "../../store/dialer/slice";
import phoneFormatter from "../../utils/phone-formatter";

const BetaDialer = () => {
  const dispatch = useAppDispatch();
  const { call, dialQueue, dialQueueIndex } = useAppSelector(
    (state) => state.dialer
  );

  const openDialerOptions = () => {
    dispatch(setShowOptions(true));
  };

  const renderFullName = () => {
    if (!dialQueue || dialQueueIndex === null) {
      return "";
    }

    return `${dialQueue[dialQueueIndex].first_name} ${dialQueue[dialQueueIndex].last_name}`;
  };

  const renderPhoneNumber = () => {
    if (!dialQueue || dialQueueIndex === null) {
      return "";
    }

    return phoneFormatter(dialQueue[dialQueueIndex].phone);
  };

  return (
    // Note: `overflow: visible` is required to support menu bleeding outside of Card bounds (before, it would cut off and not be visible)
    <Card
      withBorder
      shadow="md"
      style={{ overflow: "visible", display: "flex", alignItems: "center" }}
      pl="1rem"
      pr="2.5rem"
      py={0}
      mr={-36}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Card
            className="contact-card"
            withBorder
            h="2.125rem"
            px={8}
            py={0}
            w={150}
            mx={4}
            style={{ overflow: "visible" }}
          >
            <Flex align="center" justify="flex-start">
              <ThemeIcon variant="outline" size="sm" mr={8}>
                <MdPerson />
              </ThemeIcon>
              <Box>
                <Text lh="1rem" size="xs">
                  {renderFullName()}
                </Text>
                <Text lh="1rem" size="xs" color={call ? "green" : "dimmed"}>
                  {renderPhoneNumber()}
                </Text>
              </Box>
            </Flex>
          </Card>
          <Tooltip label="Open dialer options">
            <ActionIcon
              variant="outline"
              size="lg"
              aria-label="Settings"
              color="primary"
              mx={4}
              onClick={openDialerOptions}
            >
              <IconAdjustments stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Stop dialer">
            <ActionIcon
              variant="outline"
              size="lg"
              aria-label="stop dialer"
              color="red"
              mx={4}
            >
              <IconPlayerStopFilled stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Pause dialer">
            <ActionIcon
              variant="outline"
              size="lg"
              aria-label="pause dialer"
              color="yellow"
              mx={4}
            >
              <IconPlayerPause stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Skip to next lead">
            <ActionIcon
              variant="outline"
              size="lg"
              aria-label="skip to next lead"
              color="blue"
              mx={4}
            >
              <IconPlayerSkipForward stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Flex>
    </Card>
  );
};

export default BetaDialer;
