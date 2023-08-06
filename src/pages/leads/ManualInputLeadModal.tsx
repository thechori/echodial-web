import { useForm } from "@mantine/form";
import { Box, Button, Center, Modal, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import apiService from "../../services/api";
import { extractErrorMessage } from "../../utils/error";

const ManualInputLeadModal = ({ opened, close }: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      error: "",
    },
    validate: {
      // Allow blank, but validate if something has been entered
      email: (val) => {
        if (!val) return null;
        return /^\S+@\S+$/.test(val) ? null : "Invalid email";
      },
      phone: (val) => {
        // Trim and strip all non-numeric characters
        const trimmedVal = val.trim();
        const digits = trimmedVal.replace(/\D/g, "");
        return digits.length === 10 ? null : "Invalid phone number";
      },
    },
  });

  async function createLead() {
    form.validate();

    if (form.errors) {
      console.log("errors found");
      return;
    }

    if (!form.isValid()) {
      console.log("form invalid");
      return;
    }

    setLoading(true);
    try {
      apiService.post("/lead");
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal opened={opened} onClose={close} title="Create new lead">
      <Modal.Body>
        <Text mb="md">Manually create your new Lead via the form below:</Text>

        <form>
          <Box>
            <TextInput label="Email" {...form.getInputProps("email")} />
            <TextInput
              label="First name"
              {...form.getInputProps("firstName")}
            />
            <TextInput label="Last name" {...form.getInputProps("lastName")} />

            <TextInput
              required
              label="Phone"
              {...form.getInputProps("phone")}
            />
          </Box>

          <Center py="md">
            <Button loading={loading} onClick={createLead}>
              Create
            </Button>
          </Center>
        </form>

        <Text w="100%" color="red">
          {error}
        </Text>
      </Modal.Body>
    </Modal>
  );
};

export default ManualInputLeadModal;
