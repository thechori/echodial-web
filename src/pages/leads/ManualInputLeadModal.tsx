import { useForm } from "@mantine/form";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import {
  Box,
  Button,
  Flex,
  Modal,
  Select,
  Text,
  TextInput,
  Divider,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
//
import { useAddLeadMutation } from "../../services/lead";
import { extractErrorMessage } from "../../utils/error";
import { useGetLeadStatusesQuery } from "../../services/lead.status";
import { useGetLeadCustomPropertiesQuery } from "../../services/lead";

import { PhoneInput } from "../../components/phone-input";
import { useState, useEffect } from "react";

const ManualInputLeadModal = ({ opened, close }: any) => {
  const [addLead, { isLoading }] = useAddLeadMutation();
  const { data: availableStatuses } = useGetLeadStatusesQuery();
  const [error, setError] = useState("");

  const [customPropertiesInputs, setCustomPropertiesInputs] = useState([]);
  const { data: customProperties } = useGetLeadCustomPropertiesQuery();

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
        if (!val) return null;
        const isValid = isPossiblePhoneNumber(val);
        return isValid ? null : "Invalid phone number";
      },
    },
  });

  useEffect(() => {
    if (customProperties) {
      for (let i = 0; i < customProperties.length; i++) {
        if (!(customProperties[i].name in form.values)) {
          form.setFieldValue(customProperties[i].name, "");
        }
      }
    }
  }, [customProperties]);

  useEffect(() => {
    setCustomInputs();
  }, [form.values]);

  function setCustomInputs() {
    let customInputs: any = [];
    if (customProperties) {
      for (let i = 0; i < customProperties.length; i++) {
        customInputs.push(
          <TextInput
            key={i}
            w="100%"
            mb="xs"
            label={customProperties[i].label}
            {...form.getInputProps(customProperties[i].name)}
          />
        );
      }
      setCustomPropertiesInputs(customInputs);
    }
  }

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
      setError("");

      close();
    } catch (e) {
      setError(extractErrorMessage(e));
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
          <Box pb="xs">
            <PhoneInput label="Phone number" {...form.getInputProps("phone")} />
          </Box>

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
            pb="xs"
            {...form.getInputProps("status")}
            data={
              availableStatuses?.map((s) => ({
                value: s.value,
                label: s.label,
              })) || []
            }
          />
          <DateInput
            label="Appointment at"
            pb="xs"
            clearable
            {...form.getInputProps("appointment_at")}
          />
          <Text size="sm" color="dimmed" mt="md">
            Custom Properties
          </Text>
          <Divider py={8} />
          <Group>{customPropertiesInputs}</Group>
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
          {error}
        </Text>
      </Modal.Body>
    </Modal>
  );
};

export default ManualInputLeadModal;
