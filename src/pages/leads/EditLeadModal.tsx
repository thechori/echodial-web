import { useEffect, useState } from "react";
import { Box, Button, Center, Modal, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
//
import { useUpdateLeadMutation } from "../../services/lead";
import { extractErrorMessage } from "../../utils/error";
import { Lead } from "../../types";
import { useAppSelector } from "../../store/hooks";

type TEditLeadModalProps = {
  opened: boolean;
  close: () => void;
};

const EditLeadModal = ({ opened, close }: TEditLeadModalProps) => {
  const [error, setError] = useState("");
  const [lead, setLead] = useState<Lead | null>(null);
  //
  const { selectedRows } = useAppSelector((state) => state.leads);
  //
  const [updateLead, { isLoading }] = useUpdateLeadMutation();
  //
  const form = useForm({
    initialValues: lead,
    validate: {
      // Allow blank, but validate if something has been entered
      email: (val: string | null) => {
        if (!val) return null;
        return /^\S+@\S+$/.test(val) ? null : "Invalid email";
      },
      phone: (val: string | null) => {
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
      console.error("Form is not valid");
      return;
    }

    if (!form.values) {
      console.error("No lead found");
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
    if (selectedRows.length) {
      setLead(selectedRows[0]);
    }
  }, [selectedRows]);

  useEffect(() => {
    if (lead) {
      form.setValues({
        ...lead,
        phone: lead ? lead.phone.split("+1")[1] : "", // Remove +1 as not to confuse user
      });
    }
  }, [lead]);

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
