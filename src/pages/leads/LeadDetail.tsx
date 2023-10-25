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
import { useGetLeadStatusesQuery } from "../../services/lead-status";
import { useUpdateLeadMutation } from "../../services/lead";
import { setSelectedRows } from "../../store/leads/slice";
import { extractErrorMessage } from "../../utils/error";
import { PhoneInput } from "../../components/phone-input";
import { setSelectedLead } from "../../store/lead-detail/slice";

export const LeadDetail = () => {
  const dispatch = useAppDispatch();
  const { selectedLead } = useAppSelector((state) => state.leadDetail);

  const [error, setError] = useState("");
  const { data: availableStatuses } = useGetLeadStatusesQuery();
  const [updateLead, { isLoading }] = useUpdateLeadMutation();

  const form = useForm({
    initialValues: {
      ...selectedLead,
      appointment_at:
        selectedLead && selectedLead.appointment_at
          ? new Date(selectedLead.appointment_at)
          : null,
    },
    validate: {
      // Allow blank, but validate if something has been entered
      email: (val: any) => {
        if (!val) return null;
        return /^\S+@\S+$/.test(val) ? null : "Invalid email";
      },
      phone: (val: any) => {
        if (!val) return "Phone number required";
        const isValid = isPossiblePhoneNumber(val);
        return isValid ? null : "Invalid phone number";
      },
    },
  });

  useEffect(() => {
    form.setValues({
      ...selectedLead,
      appointment_at:
        selectedLead && selectedLead.appointment_at
          ? new Date(selectedLead.appointment_at)
          : null,
    });
    form.resetDirty();
  }, [selectedLead]);

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
    });
    form.resetDirty();
  }

  async function editLead() {
    form.validate();

    if (!form.isValid()) {
      return;
    }

    if (!form.values) {
      return;
    }

    try {
      await updateLead(form.values).unwrap();
      notifications.show({ message: "Successfully updated lead" });
      dispatch(setSelectedRows([]));
      handleClose();
    } catch (e) {
      setError(extractErrorMessage(e));
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
        <Box>
          <Flex align="center" justify="space-between" mb="md">
            <Box>
              <Flex align="center" justify="space-between">
                <ThemeIcon size="md" mr="xs">
                  <MdPerson />
                </ThemeIcon>
                <Title order={2}>
                  {selectedLead?.first_name} {selectedLead?.last_name}
                </Title>
              </Flex>
              <Text size="sm">Local time: ??</Text>
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
              {...form.getInputProps("first_name")}
            />
            <TextInput
              mb="xs"
              label="Last name"
              {...form.getInputProps("last_name")}
            />
            <Box mb="xs">
              <PhoneInput
                label="Phone number"
                required
                {...form.getInputProps("phone")}
              />
            </Box>
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
            <DateInput label="Sale at" {...form.getInputProps("sale_at")} />
            <Textarea
              minRows={2}
              w="100%"
              label="Sale notes"
              {...form.getInputProps("sale_notes")}
            />
          </Group>
        </Box>

        <Group id="footer-buttons" spacing="sm">
          {form.isDirty() ? (
            <Button
              onClick={discardChanges}
              variant="subtle"
              w={200}
              mx="auto"
              size="xs"
              compact
            >
              Discard changes
            </Button>
          ) : (
            <Button
              onClick={handleClose}
              variant="subtle"
              w={200}
              mx="auto"
              size="xs"
              compact
            >
              Close
            </Button>
          )}
          <Button loading={isLoading} onClick={editLead} w={200} mx="auto">
            Save changes
          </Button>
        </Group>

        <Text w="100%" color="red">
          {/*  @ts-ignore */}
          {/* {form.errors?.map((e) => (
            <Text color="red">{e}</Text>
          ))} */}
          {error}
        </Text>
        <Box></Box>
        <Box></Box>
      </Card>
    </LeadDetailStyled>
  );
};
