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
