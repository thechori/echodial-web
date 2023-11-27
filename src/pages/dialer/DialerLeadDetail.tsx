import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Select,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { MdPerson } from "react-icons/md";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { notifications } from "@mantine/notifications";
import { format } from "date-fns";
//
import { LeadDetailStyled } from "../leads/LeadDetail.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useGetLeadStatusesQuery } from "../../services/lead.status";
import { useUpdateLeadMutation } from "../../services/lead";
import { extractErrorMessage } from "../../utils/error";
import { Lead } from "../../types";
import phoneFormatter from "../../utils/phone-formatter";
import { updateLeadById } from "../../store/dialer/slice";
import { useGetLeadCustomPropertiesQuery } from "../../services/lead";

export const DialerLeadDetail = () => {
  const dispatch = useAppDispatch();
  const { dialQueue, dialQueueIndex, call } = useAppSelector(
    (state) => state.dialer
  );

  const [error, setError] = useState("");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const { data: availableStatuses } = useGetLeadStatusesQuery();
  const [updateLead, { isLoading }] = useUpdateLeadMutation();

  const [customPropertiesInputs, setCustomPropertiesInputs] = useState([]);
  const { data: customProperties } = useGetLeadCustomPropertiesQuery();
  // TODO: Fix bug here that causes following bug:
  // Warning: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.
  // Note: Seems to be remedied when you set the initial value of a field to ""
  // This seems hacky, especially if we support custom fields...
  const form = useForm({
    initialValues: {
      ...activeLead,
      appointment_at:
        activeLead && activeLead.appointment_at
          ? new Date(activeLead.appointment_at)
          : null,
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

  // Grab lead from state use queue and index
  useEffect(() => {
    if (dialQueue.length && dialQueueIndex !== null) {
      const lead = dialQueue[dialQueueIndex];
      setActiveLead(lead);
    } else {
      setActiveLead(null);
    }
  }, [dialQueue, dialQueueIndex]);

  // Handle changed activeLead
  useEffect(() => {
    form.setValues({
      ...activeLead,
      // Note: We must manually set the value to "" in order to avoid having stale values linger -- very confusing and misleading to users
      notes: activeLead?.notes || "",
      not_interested_reason: activeLead?.not_interested_reason || "",
      sale_notes: activeLead?.sale_notes || "",
      appointment_at:
        activeLead && activeLead.appointment_at
          ? new Date(activeLead.appointment_at)
          : null,
    });
    form.resetDirty();
  }, [activeLead]);

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

  // Cancel edit
  function discardChanges() {
    form.reset();
    if (!activeLead)
      return notifications.show({
        message: "Error editing the activeLead. Please try again later.",
      });
    form.setValues({
      ...activeLead,
      appointment_at:
        activeLead && activeLead.appointment_at
          ? new Date(activeLead.appointment_at)
          : null,
    });
    form.resetDirty();
    setCustomInputs();
  }

  async function editLead() {
    form.validate();

    if (!form.isValid()) {
      return;
    }

    if (!form.values) {
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
      await updateLead(updatedProperties).unwrap();
      notifications.show({ message: "Successfully updated lead" });

      if (form.values.id === undefined) {
        throw "No lead ID found";
      }

      // Update local lead in queue
      dispatch(
        // @ts-ignore - we checked for undefined `id` above
        updateLeadById({ id: form.values.id, leadUpdated: form.values })
      );
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }

  return (
    <LeadDetailStyled>
      <Card id="dialer-lead-detail" withBorder>
        <Box id="lead-header">
          <Flex align="center" justify="space-between">
            <Box>
              <Flex align="center" justify="space-between">
                <ThemeIcon size="md" mr="xs">
                  <MdPerson />
                </ThemeIcon>
                <Box>
                  <Title order={2} lh="1.5rem">
                    {activeLead?.first_name} {activeLead?.last_name}
                  </Title>
                  <Text color={call ? "green" : "dimmed"} size="lg">
                    {phoneFormatter(activeLead?.phone)}
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box>
              <Text size="sm" color="dimmed">
                Local time: {format(new Date(), "Pp")}
              </Text>
            </Box>
          </Flex>
        </Box>

        <Text size="sm" color="dimmed">
          Contact information
        </Text>
        <Divider py={8} />
        <Box>
          <Group>
            <TextInput
              mb="xs"
              label="First name"
              {...form.getInputProps("first_name")}
            />
            <TextInput
              mb="xs"
              label="Last name"
              {...form.getInputProps("last_name")}
            />

            <TextInput
              mb="xs"
              label="Email address"
              {...form.getInputProps("email")}
            />
            <Select
              mb="xs"
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

            <Textarea
              label="Notes"
              w="100%"
              autosize
              minRows={3}
              {...form.getInputProps("notes")}
            />
          </Group>

          <Text size="sm" color="dimmed" mt="md">
            Activity details
          </Text>

          <Divider py={8} />

          <Group>
            <DateInput
              label="Appointment at"
              clearable
              {...form.getInputProps("appointment_at")}
            />
            <TextInput
              label="Call count"
              disabled
              {...form.getInputProps("call_count")}
            />
            <TextInput
              label="Answer count"
              disabled
              {...form.getInputProps("answer_count")}
            />

            <Textarea
              w="100%"
              minRows={1}
              label="Not interested reason"
              {...form.getInputProps("not_interested_reason")}
            />
          </Group>

          <Text size="sm" color="dimmed" mt="md">
            Deal information
          </Text>
          <Divider py={8} />

          <Group>
            <TextInput
              mb="xs"
              label="Sale amount"
              {...form.getInputProps("sale_amount")}
            />
            <TextInput
              mb="xs"
              label="Sale cost"
              {...form.getInputProps("sale_cost")}
            />
            <TextInput
              mb="xs"
              label="Sale commission"
              {...form.getInputProps("sale_commission")}
            />
            <DateInput
              label="Sale at"
              clearable
              {...form.getInputProps("sale_at")}
            />
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

        <Box id="footer-buttons-overlay" />
        <Group id="footer-buttons" spacing="sm">
          <Button
            onClick={discardChanges}
            variant="outline"
            w={200}
            mx="auto"
            disabled={!form.isDirty()}
          >
            Discard changes
          </Button>
          <Button loading={isLoading} onClick={editLead} w={200} mx="auto">
            Save changes
          </Button>
        </Group>

        <Text w="100%" color="red">
          {error}
        </Text>
      </Card>
    </LeadDetailStyled>
  );
};
