import { Button, Checkbox, Group, Modal, Text } from "@mantine/core";
import { isPossiblePhoneNumber } from "react-phone-number-input";
//
import { useRequestAddCallerIdMutation } from "../../services/caller-id";
import { useState } from "react";
import { extractErrorMessage } from "../../utils/error";
import { PhoneInput } from "../../components/phone-input";

type TNewCallerIdModalProps = {
  opened: boolean;
  close: () => void;
  triggerOpenValidatingModal: () => void;
};

const NewCallerIdModal = ({
  opened,
  close,
  triggerOpenValidatingModal,
}: TNewCallerIdModalProps) => {
  const [
    requestAddCallerId,
    { error: errorRequestAddCallerId, isLoading: isLoadingRequestAddCallerId },
  ] = useRequestAddCallerIdMutation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [agree, setAgree] = useState(false);

  async function handleSubmit() {
    // Clear errors
    setPhoneError("");

    // Validate
    const isValid = isPossiblePhoneNumber(phoneNumber);
    if (!isValid) {
      setPhoneError("Invalid phone number");
      return;
    }

    try {
      await requestAddCallerId(phoneNumber).unwrap();
      triggerOpenValidatingModal();
      close();
    } catch (e) {
      console.error(e);
    }
  }

  function handleClose() {
    setPhoneNumber("");
    setAgree(false);
    close();
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Add phone number">
      <Modal.Body>
        <Text mb="md">
          In order to protect our users, we must securely verify that you own
          this number. We'll send you a text message and a phone call
          simultaneously.
        </Text>

        <Text mb="md">
          Enter the Validation Code that you receive via SMS into the phone call
          to complete this step.
        </Text>

        <Group>
          <PhoneInput
            label="Phone number"
            required
            value={phoneNumber}
            error={phoneError}
            onChange={(phone: any) => setPhoneNumber(phone)}
          />

          <Checkbox
            miw={300}
            label="I verify that this number belongs to me"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />

          <Button
            disabled={!agree || phoneNumber.length < 10}
            loading={isLoadingRequestAddCallerId}
            onClick={handleSubmit}
          >
            Submit request
          </Button>

          <Text w="100%" color="red">
            {extractErrorMessage(errorRequestAddCallerId)}
          </Text>
        </Group>
      </Modal.Body>
    </Modal>
  );
};

export default NewCallerIdModal;
