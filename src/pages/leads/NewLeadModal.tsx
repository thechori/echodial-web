import { Button, Card, Modal, Text, Title } from "@mantine/core";
import Dropzone from "./Dropzone";

const NewLeadModal = ({ opened, close }: any) => {
  return (
    <Modal opened={opened} onClose={close} title="Upload new leads">
      <Modal.Body>
        <Text mb="md">
          In order to verify that you own this number, we'll send you a text
          message and a phone call simultaneously. Enter the Validation Code
          that you receive via SMS in the phone call to complete this step.
        </Text>

        <Card withBorder shadow="md" my="md">
          <Title order={2} mb="md">
            Upload new leads
          </Title>

          <Dropzone />
        </Card>

        <Button onClick={() => alert("ty")}>Submit</Button>

        {/* <Text w="100%" color="red">
              {error}
            </Text> */}
      </Modal.Body>
    </Modal>
  );
};

export default NewLeadModal;
