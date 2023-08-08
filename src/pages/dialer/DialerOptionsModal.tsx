import { Modal, Slider, Text } from "@mantine/core";

type TDialerOptionsModalProps = {
  opened: boolean;
  onClose: () => void;
};

const DialerOptionsModal = ({ opened, onClose }: TDialerOptionsModalProps) => {
  return (
    <Modal opened={opened} onClose={onClose}>
      <Modal.Title>Call options</Modal.Title>
      <Text>
        Configure your call to maximize productivity in your unique situation.
      </Text>
      <Slider />
    </Modal>
  );
};

export default DialerOptionsModal;
