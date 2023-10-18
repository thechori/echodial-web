import {
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconAdjustments,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconPlayerStopFilled,
} from "@tabler/icons-react";
import { PiPhone } from "react-icons/pi";
import { useAppDispatch } from "../../store/hooks";
import { setShowOptions } from "../../store/dialer/slice";

const BetaDialer = () => {
  const dispatch = useAppDispatch();

  function openDialerOptions() {
    dispatch(setShowOptions(true));
  }

  return (
    // Note: `overflow: visible` is required to support menu bleeding outside of Card bounds (before, it would cut off and not be visible)
    <Card withBorder style={{ overflow: "visible" }}>
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <ThemeIcon radius="xl" size="xl" mr="xs">
            <PiPhone style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Title order={2}>Dialer</Title>
        </Flex>

        <Flex align="center">
          <Box>Ryan Teodoro</Box>
          <Box>0:00:00</Box>
        </Flex>

        <Flex align="center">
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

          <Button mx={4} leftIcon={<PiPhone />}>
            Start calling
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default BetaDialer;
