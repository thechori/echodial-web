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
  Textarea,
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
      first_name: "",
      last_name: "",
      phone: "",
      status: "new",
      appointment_at: null,
      notes: null,
      sale_amount: null,
      sale_cost: null,
      sale_commission: null,
      sale_at: null,
      sale_notes: null,
    },
    validate: {
      // Allow blank, but validate if something has been entered
      email: (val: any) => {
        if (!val) return null;
        return /^\S+@\S+$/.test(val) ? null : "Invalid email";
      },
      phone: (val: any) => {
        if (!val) return null;
        const isValid = isPossiblePhoneNumber(val);
        return isValid ? null : "Invalid phone number";
      },
      sale_amount: (val: any) => {
        if (!val) return null;
        const floatValue = parseFloat(val);

        // Check if the parsed value is a valid number and not NaN
        return !isNaN(floatValue) ? null : "Invalid value";
      },
      sale_commission: (val: any) => {
        if (!val) return null;
        const floatValue = parseFloat(val);

        return !isNaN(floatValue) ? null : "Invalid value";
      },
      sale_cost: (val: any) => {
        if (!val) return null;
        const floatValue = parseFloat(val);

        return !isNaN(floatValue) ? null : "Invalid value";
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
      setCustomInputs();
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

    const propertyNames = customProperties?.map((property) => property.name);
    const newConstantProperties = propertyNames?.reduce(
      (acc: any, property) => {
        acc[property] = "";
        return acc;
      },
      {}
    );
    //if the key is a custom property, we store inside newConstantProperties
    //else we update it as a standard property
    const updatedProperties: any = {};
    for (const [key, value] of Object.entries(form.values)) {
      if (key in newConstantProperties) {
        newConstantProperties[key] = value;
      } else if (key != "custom_properties") {
        updatedProperties[key] = value;
      }
    }
    updatedProperties["custom_properties"] = newConstantProperties;
    try {
      await addLead(updatedProperties).unwrap();

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
        <Box style={{ height: "370px", overflow: "scroll" }}>
          <Box pb="xs">
            <PhoneInput label="Phone number" {...form.getInputProps("phone")} />
          </Box>

          <TextInput
            pb="xs"
            label="First name"
            {...form.getInputProps("first_name")}
          />
          <TextInput
            pb="xs"
            label="Last name"
            {...form.getInputProps("last_name")}
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
          <Textarea
            label="Notes"
            w="100%"
            autosize
            minRows={3}
            {...form.getInputProps("notes")}
          />
          <Group py="sm">
            <Flex justify="space-between">
              <TextInput
                pr="xs"
                mb="xs"
                label="Sale amount"
                value={form.getInputProps("sale_amount").value ?? ""}
                onChange={form.getInputProps("sale_amount").onChange}
                error={form.getInputProps("sale_amount").error}
              />
              <TextInput
                pl="xs"
                mb="xs"
                label="Sale cost"
                value={form.getInputProps("sale_cost").value ?? ""}
                onChange={form.getInputProps("sale_cost").onChange}
                error={form.getInputProps("sale_cost").error}
              />
            </Flex>

            <Flex>
              <TextInput
                pr="xs"
                mb="xs"
                label="Sale commission"
                value={form.getInputProps("sale_commission").value ?? ""}
                onChange={form.getInputProps("sale_commission").onChange}
                error={form.getInputProps("sale_commission").error}
              />
              <DateInput
                pl="xs"
                label="Sale at"
                clearable
                {...form.getInputProps("sale_at")}
              />
            </Flex>
            <Textarea
              minRows={2}
              w="100%"
              label="Sale notes"
              {...form.getInputProps("sale_notes")}
            />
          </Group>
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
