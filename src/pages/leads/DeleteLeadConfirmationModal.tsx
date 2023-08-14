import { useEffect, useState } from "react";
import { Box, Button, Center, Group, Modal, Text } from "@mantine/core";
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
  const [error, setError] = useState("");
  const [deleteLeads, { isLoading }] = useDeleteMultipleLeadsMutation();

  async function handleDeleteLeads() {
    const ids = rowsSelected.map((lead) => lead.id);
    try {
      const res = await deleteLeads(ids).unwrap();
      console.log("res", res);
      notifications.show({
        title: "Success",
        message: "Deleted leads",
      });
      close();
    } catch (e) {
      console.log("errrr", e);
      setError(extractErrorMessage(e));
    }
  }

  useEffect(() => {
    setError("");
  }, [rowsSelected]);

  return (
    <Modal opened={opened} onClose={close} title="Delete lead">
      <Modal.Body>
        <Text mb="md">
          Are you sure you want to delete ({rowsSelected.length}) lead
          {rowsSelected.length > 1 ? "s" : ""}?
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
