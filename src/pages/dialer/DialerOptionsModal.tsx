import { Button, Group, Text } from "@mantine/core";
//
import { StyledModal } from "./DialerOptionsModal.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectIsDialerOptionsModalOpen,
  setShowOptions,
} from "../../store/dialer/slice";

const DialerOptionsModal = () => {
  const dispatch = useAppDispatch();

  const opened = useAppSelector(selectIsDialerOptionsModalOpen);

  const onClose = () => dispatch(setShowOptions(false));

  return (
    <StyledModal opened={opened} onClose={onClose} title="Dialer settings">
      <Text>
        Configure your call settings to maximize productivity in your unique
        situation.
      </Text>

      <Group spacing="md" p="md">
        <Text size="sm" py="xl" italic color="dimmed">
          This area is currently under construction. Check back later for
          updates.
        </Text>

        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </Group>
    </StyledModal>
  );
};

export default DialerOptionsModal;
