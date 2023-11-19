import {
  // ActionIcon,
  Box,
  Card,
  Flex,
  Text,
  ThemeIcon,
  // Tooltip,
} from "@mantine/core";
// import {
//   IconAdjustments,
//   IconPlayerSkipForward,
//   IconPlayerStopFilled,
// } from "@tabler/icons-react";
import { MdPerson } from "react-icons/md";
//
import { useAppSelector } from "../../store/hooks";
// import { setShowOptions } from "../../store/dialer/slice";
import phoneFormatter from "../../utils/phone-formatter";

const BetaDialer = () => {
  const { call, dialQueue, dialQueueIndex, isDialerOpen } = useAppSelector(
    (state) => state.dialer
  );

  const renderFullName = () => {
    if (!dialQueue || dialQueueIndex === null) {
      return "";
    }

    const lead = dialQueue[dialQueueIndex];

    if (!lead) return "";

    return `${lead.first_name} ${lead.last_name}`;
  };

  const renderPhoneNumber = () => {
    if (!dialQueue || dialQueueIndex === null) {
      return "";
    }

    const lead = dialQueue[dialQueueIndex];

    if (!lead) return "";

    return phoneFormatter(lead.phone);
  };

  return (
    // Note: `overflow: visible` is required to support menu bleeding outside of Card bounds (before, it would cut off and not be visible)
    <Card
      withBorder
      shadow="md"
      style={{
        overflow: "visible",
        display: dialQueue.length ? "flex" : "none",
        alignItems: "center",
        opacity: isDialerOpen ? 0.3 : 1,
        pointerEvents: isDialerOpen ? "none" : "all",
      }}
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
            style={{
              overflow: "visible",
              display: dialQueueIndex === null ? "none" : "flex",
              alignItems: "center",
            }}
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
          {/* <Tooltip label="Open dialer options">
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
          </Tooltip> */}
        </Flex>
      </Flex>
    </Card>
  );
};

export default BetaDialer;
