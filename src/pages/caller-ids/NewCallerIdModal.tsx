import { Button, Checkbox, Group, Modal, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
//
import { useAddCallerIdMutation } from "../../services/caller-id";
import { useState } from "react";
import { extractErrorMessage } from "../../utils/error";

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
  const [agree, setAgree] = useState(false);

  async function handleSubmit() {
    try {
      await addCallerId(phoneNumber).unwrap(); // Using .unwrap to handle error HERE
      notifications.show({
        title: "Success",
        message: "Check your phone!",
      });
      close();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: extractErrorMessage(error),
      });
    }
  }

  return (
    <Modal opened={opened} onClose={close} title="Add Caller ID">
      <Modal.Body>
        <Text mb="md">
          In order to verify that you own this number, we'll send you a text
          message and a phone call simultaneously. Enter the Validation Code
          that you receive via SMS in the phone call to complete this step.
        </Text>

        <Group>
          <TextInput
            label="Phone number"
            miw={300}
            required
            placeholder="e.g., 832-111-3333"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
