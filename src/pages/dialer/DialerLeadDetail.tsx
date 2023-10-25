import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Group,
  Select,
  Stack,
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
//
import { LeadDetailStyled } from "../leads/LeadDetail.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useGetLeadStatusesQuery } from "../../services/lead-status";
import { useUpdateLeadMutation } from "../../services/lead";
import { setSelectedRows } from "../../store/leads/slice";
import { extractErrorMessage } from "../../utils/error";
import { PhoneInput } from "../../components/phone-input";
import { Lead } from "../../types";

export const DialerLeadDetail = () => {
  const dispatch = useAppDispatch();
  const { dialQueue, dialQueueIndex } = useAppSelector((state) => state.dialer);

  const [error, setError] = useState("");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const { data: availableStatuses } = useGetLeadStatusesQuery();
  const [updateLead, { isLoading }] = useUpdateLeadMutation();

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
        if (!val) return "Phone number required";
        const isValid = isPossiblePhoneNumber(val);
        return isValid ? null : "Invalid phone number";
      },
    },
  });

  // Grab lead from state use queue and index
  useEffect(() => {
    if (dialQueue.length && dialQueueIndex !== null) {
      const lead = dialQueue[dialQueueIndex];
      setActiveLead(lead);
    }
  }, [dialQueue, dialQueueIndex]);

  // Handle changed activeLead
  useEffect(() => {
    form.setValues({
      ...activeLead,
      appointment_at:
        activeLead && activeLead.appointment_at
          ? new Date(activeLead.appointment_at)
          : null,
    });
    form.resetDirty();
  }, [activeLead]);

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
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }

  return (
    <LeadDetailStyled>
      <Card
        id="lead-detail"
        withBorder
        style={{ overflow: "visible", paddingTop: "1rem" }}
      >
        <Box>
          <Flex align="center" justify="space-between" mb="md">
            <Box>
              <Flex align="center" justify="space-between">
                <ThemeIcon size="md" mr="xs">
                  <MdPerson />
                </ThemeIcon>
                <Title order={2}>
                  {activeLead?.first_name} {activeLead?.last_name}
                </Title>
              </Flex>
              <Text size="sm">Local time: ??</Text>
            </Box>
          </Flex>
        </Box>

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
            <DateInput
              label="Appointment at"
              {...form.getInputProps("appointment_at")}
            />
            <Textarea
              label="Notes"
              w="100%"
              autosize
              minRows={3}
              {...form.getInputProps("notes")}
            />
          </Group>
        </Box>

        <Stack py="lg" spacing="sm">
          <Button loading={isLoading} onClick={editLead} w={200} mx="auto">
            Update
          </Button>
          <Button
            onClick={discardChanges}
            variant="subtle"
            w={200}
            mx="auto"
            size="xs"
            compact
            style={{ visibility: form.isDirty() ? "visible" : "hidden" }}
          >
            Discard changes
          </Button>
        </Stack>

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
