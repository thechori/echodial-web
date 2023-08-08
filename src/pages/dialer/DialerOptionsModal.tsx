import {
  Button,
  Center,
  Flex,
  Group,
  Modal,
  NumberInput,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setOptions } from "../../store/dialer/slice";

type TDialerOptionsModalProps = {
  opened: boolean;
  onClose: () => void;
};

const DialerOptionsModal = ({ opened, onClose }: TDialerOptionsModalProps) => {
  const dispatch = useAppDispatch();
  const { options } = useAppSelector((state) => state.dialer);
  const { maxCallTries, cooldownTimeInMilliseconds } = options;

  return (
    <Modal opened={opened} onClose={onClose} title="Call options">
      <Text>
        Configure your call settings to maximize productivity in your unique
        situation.
      </Text>

      <Group spacing="md" p="md">
        <NumberInput
          label={
            <Flex align="center" justify="space-between">
              <Text pr="xs">Retry attempts per call</Text>
              <Tooltip
                label="Number of times we'll try to retry the call before proceeding to the next lead"
                position="top-end"
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
        />

        <NumberInput
          label={
            <Flex align="center" justify="space-between">
              <Text pr="xs">Cooldown time (in milliseconds)</Text>
              <Tooltip
                label="Amount of time the dialer will wait before making the next call"
                position="top-end"
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
          value={cooldownTimeInMilliseconds}
          onChange={(newValue) => {
            dispatch(
              setOptions({ ...options, cooldownTimeInMilliseconds: newValue })
            );
          }}
        />

        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </Group>
    </Modal>
  );
};

export default DialerOptionsModal;
