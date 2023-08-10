import { Button, Center, Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
//
import { Lead, useDeleteMultipleLeadsMutation } from "../../services/lead";
import { extractErrorMessage } from "../../utils/error";

type TDeleteLeadConfirmationModalProps = {
  opened: boolean;
  close: () => void;
  rowsSelected: Lead[];
};

const DeleteLeadConfirmationModal = ({
  opened,
  close,
  rowsSelected,
}: TDeleteLeadConfirmationModalProps) => {
  const [deleteLeads, { isLoading, error }] = useDeleteMultipleLeadsMutation();

  async function handleDeleteLeads() {
    const ids = rowsSelected.map((lead) => lead.id);
    try {
      const res = await deleteLeads(ids);
      console.log("res", res);
      notifications.show({
        title: "Success",
        message: "Deleted leads",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: extractErrorMessage(error),
      });
    }
  }

  return (
    <Modal opened={opened} onClose={close} title="Delete lead">
      <Modal.Body>
        <Text mb="md">Are your sure you want to lead this lead(s)?</Text>

        <Center py="md">
          <Button loading={isLoading} onClick={handleDeleteLeads}>
            Confirm
          </Button>
        </Center>

        <Text w="100%" color="red">
          {/* @ts-ignore */}
          {error?.status} {JSON.stringify(error?.data)}
        </Text>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteLeadConfirmationModal;
