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
import { useWindowEvent } from "@mantine/hooks";
import { MdPerson } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { notifications } from "@mantine/notifications";
//
import { LeadDetailStyled } from "./LeadDetail.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useGetLeadStatusesQuery } from "../../services/lead.status";
import { useUpdateLeadMutation } from "../../services/lead";
import { setSelectedRows } from "../../store/leads/slice";
import { extractErrorMessage } from "../../utils/error";
import { PhoneInput } from "../../components/phone-input";
import { setSelectedLead } from "../../store/lead-detail/slice";
import { useGetLeadCustomPropertiesQuery } from "../../services/lead";

export const LeadDetail = () => {
  const dispatch = useAppDispatch();
  const { selectedLead } = useAppSelector((state) => state.leadDetail);

  const [error, setError] = useState("");
  const { data: availableStatuses } = useGetLeadStatusesQuery();
  const [updateLead, { isLoading }] = useUpdateLeadMutation();

  const [customPropertiesInputs, setCustomPropertiesInputs] = useState([]);
  const { data: customProperties } = useGetLeadCustomPropertiesQuery();

  const form = useForm({
    initialValues: {
      ...selectedLead,
      appointment_at:
        selectedLead && selectedLead.appointment_at
          ? new Date(selectedLead.appointment_at)
          : null,
      sale_at:
        selectedLead && selectedLead.sale_at
          ? new Date(selectedLead.sale_at)
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

  //when we first import the leads, there might be certain custom properties that are missing
  //because the properties vary from lead to lead. We need to have this function to make sure
  //that the form contains all the custom properties that are missing
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
    form.reset();
    //we have to do form.reset() or else the custom values will linger

    form.setValues({
      ...selectedLead,
      // Note: We must manually set the value to "" in order to avoid having stale values linger -- very confusing and misleading to users
      notes: selectedLead?.notes || "",
      not_interested_reason: selectedLead?.not_interested_reason || "",
      sale_notes: selectedLead?.sale_notes || "",
      appointment_at:
        selectedLead && selectedLead.appointment_at
          ? new Date(selectedLead.appointment_at)
          : null,
      sale_at:
        selectedLead && selectedLead.sale_at
          ? new Date(selectedLead.sale_at)
          : null,
    });
    form.resetDirty();
    setCustomInputs();
  }, [selectedLead]);

  useEffect(() => {
    setCustomInputs();
  }, [form.values]);

  //set the values for each of the custom property text input boxes
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
            value={form.getInputProps(customProperties[i].name).value ?? ""}
            onChange={form.getInputProps(customProperties[i].name).onChange}
            error={form.getInputProps(customProperties[i].name).error}
          />
        );
      }
      setCustomPropertiesInputs(customInputs);
    }
  }
  // Close icon
  function handleClose() {
    discardChanges();
    dispatch(setSelectedLead(null));
  }

  // Cancel edit
  function discardChanges() {
    form.reset();
    if (!selectedLead)
      return notifications.show({
        message: "Error editing the selectedLead. Please try again later.",
      });
    form.setValues({
      ...selectedLead,
      appointment_at:
        selectedLead && selectedLead.appointment_at
          ? new Date(selectedLead.appointment_at)
          : null,
      sale_at:
        selectedLead && selectedLead.sale_at
          ? new Date(selectedLead.sale_at)
          : null,
    });
    form.resetDirty();
    setCustomInputs();
  }

  async function editLead() {
    setError("");
    form.validate();
    if (!form.isValid()) {
      return;
    }

    if (!form.values) {
      return;
    }

    //grab the property names and create a new object mapping the custom property name
    //to its value
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
      await updateLead(updatedProperties).unwrap();
      notifications.show({ message: "Successfully updated lead" });
      dispatch(setSelectedRows([]));
      handleClose();
    } catch (e) {
      const errorMessage = extractErrorMessage(e);
      setError(errorMessage);
      notifications.show({
        color: "red",
        message: errorMessage,
        title: "Error",
      });
    }
  }

  useWindowEvent("keydown", (e) => {
    if (e.key === "Escape") {
      if (selectedLead) {
        // Close window
        handleClose();
      } else {
        // Deselect row
        // TODO: add me for nice ux
      }
    }
  });

  return (
    <LeadDetailStyled>
      <Card id="lead-detail" withBorder>
        <Box id="lead-header">
          <Flex align="center" justify="space-between">
            <Box>
              <Flex align="center" justify="space-between">
                <ThemeIcon size="md" mr="xs">
                  <MdPerson />
                </ThemeIcon>
                <Title order={2}>
                  {selectedLead?.first_name} {selectedLead?.last_name}
                </Title>
              </Flex>
            </Box>

            <Button
              color="red"
              onClick={handleClose}
              leftIcon={<AiOutlineClose />}
              variant="outline"
            >
              Close
            </Button>
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
              value={form.getInputProps("first_name").value ?? ""}
              onChange={form.getInputProps("first_name").onChange}
              error={form.getInputProps("first_name").error}
            />
            <TextInput
              mb="xs"
              label="Last name"
              value={form.getInputProps("last_name").value ?? ""}
              onChange={form.getInputProps("last_name").onChange}
              error={form.getInputProps("last_name").error}
            />
            <Box mb="xs">
              <PhoneInput
                label="Phone number"
                {...form.getInputProps("phone")}
              />
            </Box>
            <TextInput
              mb="xs"
              label="Email address"
              value={form.getInputProps("email").value ?? ""}
              onChange={form.getInputProps("email").onChange}
              error={form.getInputProps("email").error}
            />
            <Select
              mb="xs"
              label="Status"
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
              value={form.getInputProps("sale_amount").value ?? ""}
              onChange={form.getInputProps("sale_amount").onChange}
              error={form.getInputProps("sale_amount").error}
            />
            <TextInput
              mb="xs"
              label="Sale cost"
              value={form.getInputProps("sale_cost").value ?? ""}
              onChange={form.getInputProps("sale_cost").onChange}
              error={form.getInputProps("sale_cost").error}
            />
            <TextInput
              mb="xs"
              label="Sale commission"
              value={form.getInputProps("sale_commission").value ?? ""}
              onChange={form.getInputProps("sale_commission").onChange}
              error={form.getInputProps("sale_commission").error}
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
          {form.isDirty() ? (
            <Button
              onClick={discardChanges}
              variant="outline"
              w={200}
              mx="auto"
            >
              Discard changes
            </Button>
          ) : (
            <Button onClick={handleClose} variant="outline" w={200} mx="auto">
              Close
            </Button>
          )}
          <Button loading={isLoading} onClick={editLead} w={200} mx="auto">
            Save changes
          </Button>
        </Group>

        <Text w="100%" color="red">
          {error}
        </Text>
        <Box></Box>
        <Box></Box>
      </Card>
    </LeadDetailStyled>
  );
};
