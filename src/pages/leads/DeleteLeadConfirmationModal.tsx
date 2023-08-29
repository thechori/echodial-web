import { useEffect, useState } from "react";
import { Button, Group, Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
//
import { useDeleteMultipleLeadsMutation } from "../../services/lead";
import { extractErrorMessage } from "../../utils/error";
import { useAppSelector } from "../../store/hooks";

type TDeleteLeadConfirmationModalProps = {
  opened: boolean;
  close: () => void;
};

const DeleteLeadConfirmationModal = ({
  opened,
  close,
}: TDeleteLeadConfirmationModalProps) => {
  const [error, setError] = useState("");
  //
  const { selectedRows } = useAppSelector((state) => state.leads);
  //
  const [deleteLeads, { isLoading }] = useDeleteMultipleLeadsMutation();

  async function handleDeleteLeads() {
    const ids = selectedRows.map((lead) => lead.id);
    try {
      await deleteLeads(ids).unwrap();
      notifications.show({
        title: "Success",
        message: "Deleted leads",
      });
      close();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }

  useEffect(() => {
    setError("");
  }, [selectedRows]);

  return (
    <Modal opened={opened} onClose={close} title="Delete lead">
      <Modal.Body>
        <Text mb="md">
          Are you sure you want to delete ({selectedRows.length}) lead
          {selectedRows.length > 1 ? "s" : ""}?
        </Text>

        <Group py="md" position="center">
          <Button color="red" loading={isLoading} onClick={handleDeleteLeads}>
            Confirm
          </Button>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
        </Group>

        <Text w="100%" color="red">
          {error}
        </Text>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteLeadConfirmationModal;
