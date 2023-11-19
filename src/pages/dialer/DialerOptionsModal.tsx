import { Button, Group, Text } from "@mantine/core";
//
import { StyledModal } from "./DialerOptionsModal.styles";

type TDialerOptionsModalProps = {
  opened: boolean;
  onClose: () => void;
};

const DialerOptionsModal = ({ opened, onClose }: TDialerOptionsModalProps) => {
  return (
    <StyledModal opened={opened} onClose={onClose} title="Dialer settings">
      <Text>
        Configure your call settings to maximize productivity in your unique
        situation.
      </Text>

      <Group spacing="md" p="md">
        <Text py="xl" italic color="dimmed">
          Nothing here yet
        </Text>

        {/* <NumberInput
          label={
            <Flex align="center" justify="space-between">
              <Text pr="xs">Max ringing time (in seconds)</Text>
              <Tooltip
                label="Amount of time to ring before hanging up and moving to the next action"
                position="top"
                withArrow
                transitionProps={{ transition: "pop-bottom-right" }}
              >
                <Text color="dimmed" sx={{ cursor: "help" }}>
                  <Center>
                    <IconInfoCircle size="1.1rem" stroke={1.5} />
                  </Center>
                </Text>
              </Tooltip>
            </Flex>
          }
          placeholder="Pick one"
          value={maxRingTimeInSeconds}
          onChange={(newValue) => {
            dispatch(
              setOptions({ ...options, maxRingTimeInSeconds: newValue })
            );
          }}
        /> */}

        {/* <NumberInput
          label={
            <Flex align="center" justify="space-between">
              <Text pr="xs">Call attempts per lead</Text>
              <Tooltip
                label="Number of consecutive times we'll try to call before proceeding to the next lead"
                position="top"
                withArrow
                transitionProps={{ transition: "pop-bottom-right" }}
              >
                <Text color="dimmed" sx={{ cursor: "help" }}>
                  <Center>
                    <IconInfoCircle size="1.1rem" stroke={1.5} />
                  </Center>
                </Text>
              </Tooltip>
            </Flex>
          }
          placeholder="Pick one"
          value={maxCallTries}
          onChange={(newValue) => {
            dispatch(setOptions({ ...options, maxCallTries: newValue }));
          }}
        /> */}

        {/* <NumberInput
          label={
            <Flex align="center" justify="space-between">
              <Text pr="xs">Cooldown time (in seconds)</Text>
              <Tooltip
                label="Amount of time the dialer will wait before making the next call"
                position="top"
                withArrow
                transitionProps={{ transition: "pop-bottom-right" }}
              >
                <Text color="dimmed" sx={{ cursor: "help" }}>
                  <Center>
                    <IconInfoCircle size="1.1rem" stroke={1.5} />
                  </Center>
                </Text>
              </Tooltip>
            </Flex>
          }
          value={cooldownTimeInSeconds}
          onChange={(newValue) => {
            dispatch(
              setOptions({ ...options, cooldownTimeInSeconds: newValue })
            );
          }}
        /> */}

        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </Group>
    </StyledModal>
  );
};

export default DialerOptionsModal;
