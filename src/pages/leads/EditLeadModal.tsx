import { useEffect, useState } from "react";
import { Box, Button, Center, Modal, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
//
import {
  Lead,
  // useDeleteMultipleLeadsMutation,
  useUpdateLeadMutation,
} from "../../services/lead";
import { extractErrorMessage } from "../../utils/error";

type TEditLeadModalProps = {
  opened: boolean;
  close: () => void;
  rowSelected: Lead;
};

const EditLeadModal = ({ opened, close, rowSelected }: TEditLeadModalProps) => {
  const [error, setError] = useState("");
  const [updateLead, { isLoading }] = useUpdateLeadMutation();
  const form = useForm({
    initialValues: rowSelected,
    validate: {
      // Allow blank, but validate if something has been entered
      email: (val) => {
        if (!val) return null;
        return /^\S+@\S+$/.test(val) ? null : "Invalid email";
      },
      phone: (val) => {
        if (!val) return "Phone number required";
        // Trim and strip all non-numeric characters
        const trimmedVal = val.trim();
        const digits = trimmedVal.replace(/\D/g, "");
        return digits.length === 10 ? null : "Invalid phone number";
      },
    },
  });

  async function editLead() {
    form.validate();

    if (!form.isValid()) {
      return;
    }

    try {
      await updateLead(form.values).unwrap();
      notifications.show({ message: "Successfully updated lead" });
      close();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }

  useEffect(() => {
    if (rowSelected) {
      form.setValues({
        ...rowSelected,
        phone: rowSelected ? rowSelected.phone.split("+1")[1] : "", // Remove +1 as not to confuse user
      });
    }
  }, [rowSelected]);

  return (
    <Modal opened={opened} onClose={close} title="Edit lead">
      <Modal.Body>
        <Box>
          <TextInput label="Email address" {...form.getInputProps("email")} />
          <TextInput label="First name" {...form.getInputProps("first_name")} />
          <TextInput label="Last name" {...form.getInputProps("last_name")} />
          <TextInput label="Phone" required {...form.getInputProps("phone")} />
        </Box>

        <Center py="md">
          <Button loading={isLoading} onClick={editLead}>
            Update
          </Button>
        </Center>

        <Text w="100%" color="red">
          {error}
        </Text>
      </Modal.Body>
    </Modal>
  );
};

export default EditLeadModal;
