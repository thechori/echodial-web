import { Box, Button, Center, Modal, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
//
import {
  Lead,
  useDeleteLeadMutation,
  useDeleteMultipleLeadsMutation,
  useUpdateLeadMutation,
} from "../../services/lead";

type TEditLeadModalProps = {
  opened: boolean;
  close: () => void;
  rowSelected: Lead;
};

const EditLeadModal = ({ opened, close, rowSelected }: TEditLeadModalProps) => {
  console.log("rowSelected", rowSelected);
  const [updateLead, { isLoading, error }] = useUpdateLeadMutation();
  const form = useForm({
    initialValues: rowSelected,
  });

  function editLead() {
    console.log("editing", form.values);

    // updateLead();
  }

  return (
    <Modal opened={opened} onClose={close} title="Edit lead">
      <Modal.Body>
        <Text mb="md">Edit the following lead</Text>

        <Box>
          <TextInput label="Email address" {...form.getInputProps("email")} />
          <TextInput label="First name" {...form.getInputProps("first_name")} />
          <TextInput label="Last name" {...form.getInputProps("last_name")} />
          <TextInput label="Phone" {...form.getInputProps("phone")} />
        </Box>

        <Center py="md">
          <Button loading={isLoading} onClick={editLead}>
            Update
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

export default EditLeadModal;
