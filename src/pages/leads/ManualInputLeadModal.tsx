import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Flex,
  Modal,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
//
import { useAddLeadMutation } from "../../services/lead";
import { extractErrorMessage } from "../../utils/error";
import { useGetLeadStatusesQuery } from "../../services/lead-status";

const ManualInputLeadModal = ({ opened, close }: any) => {
  const [addLead, { isLoading, error }] = useAddLeadMutation();
  const { data: availableStatuses } = useGetLeadStatusesQuery();

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

  function cancel() {
    form.reset();
    close();
  }

  async function createLead() {
    form.validate();

    if (!form.isValid()) {
      return;
    }

    const {
      email,
      firstName: first_name,
      lastName: last_name,
      phone,
    } = form.values;

    try {
      await addLead({
        email,
        first_name,
        last_name,
        phone,
      }).unwrap();

      notifications.show({
        title: "Success",
        message: "Your lead was successfully created",
      });

      form.reset();

      close();
    } catch (e) {
      console.error(extractErrorMessage(e));
    }
  }

  function handleClose() {
    form.reset();
    close();
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Create new lead">
      <Modal.Body>
        <Text mb="md" size="sm">
          Manually create your new Lead via the form below.
        </Text>

        <Box>
          <TextInput
            pb="xs"
            required
            label="Phone"
            {...form.getInputProps("phone")}
          />
          <TextInput
            pb="xs"
            label="First name"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            pb="xs"
            label="Last name"
            {...form.getInputProps("lastName")}
          />
          <TextInput pb="xs" label="Email" {...form.getInputProps("email")} />
          <Select
            label="Status"
            required
            {...form.getInputProps("status")}
            data={
              availableStatuses?.map((s) => ({
                value: s.value,
                label: s.label,
              })) || []
            }
          />
        </Box>

        <Flex pt="md" align="center" justify="center">
          <Button variant="outline" onClick={cancel} mx="sm">
            Cancel
          </Button>
          <Button loading={isLoading} onClick={createLead} mx="sm">
            Create
          </Button>
        </Flex>

        <Text w="100%" color="red">
          {/* @ts-ignore */}
          {error?.status} {JSON.stringify(error?.data)}
        </Text>
      </Modal.Body>
    </Modal>
  );
};

export default ManualInputLeadModal;
