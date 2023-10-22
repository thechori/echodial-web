import { Button, Checkbox, Group, Modal, Text } from "@mantine/core";
import { isPossiblePhoneNumber } from "react-phone-number-input";
//
import { useAddCallerIdMutation } from "../../services/caller-id";
import { useState } from "react";
import { extractErrorMessage } from "../../utils/error";
import { PhoneInput } from "../../components/phone-input";

type TNewCallerIdModalProps = {
  opened: boolean;
  close: () => void;
};

const NewCallerIdModal = ({ opened, close }: TNewCallerIdModalProps) => {
  const [
    addCallerId,
    { error: errorAddCallerId, isLoading: isLoadingAddCallerId },
  ] = useAddCallerIdMutation();
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
      await addCallerId(phoneNumber).unwrap();
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
    <Modal opened={opened} onClose={handleClose} title="Add Caller ID">
      <Modal.Body>
        <Text mb="md">
          In order to verify that you own this number, we'll send you a text
          message and a phone call simultaneously. Enter the Validation Code
          that you receive via SMS in the phone call to complete this step.
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
            loading={isLoadingAddCallerId}
            onClick={handleSubmit}
          >
            Submit
          </Button>

          <Text w="100%" color="red">
            {extractErrorMessage(errorAddCallerId)}
          </Text>
        </Group>
      </Modal.Body>
    </Modal>
  );
};

export default NewCallerIdModal;
