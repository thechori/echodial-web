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
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { MdPerson } from "react-icons/md";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { notifications } from "@mantine/notifications";
//
import { LeadDetailStyled } from "./LeadDetail.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { useGetLeadStatusesQuery } from "../../services/lead-status";
import { useUpdateLeadMutation } from "../../services/lead";
import { useForm } from "@mantine/form";
import { setSelectedRows } from "../../store/leads/slice";
import { extractErrorMessage } from "../../utils/error";
import { PhoneInput } from "../../components/phone-input";
import { AiOutlineClose } from "react-icons/ai";
import { setSelectedLead } from "../../store/lead-detail/slice";
import { useWindowEvent } from "@mantine/hooks";

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

        <Box>
          <Group>
            <TextInput
              mb="xs"
              label="Email address"
              {...form.getInputProps("email")}
            />
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
                {...form.getInputProps("phone")}
              />
            </Box>
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
          </Group>
        </Box>

        <Stack py="lg" spacing="sm">
          <Button loading={isLoading} onClick={editLead} w={200} mx="auto">
            Update
          </Button>
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
