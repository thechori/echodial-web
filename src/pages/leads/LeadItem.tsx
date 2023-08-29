import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { format } from "date-fns";
//
import { extractErrorMessage } from "../../utils/error";
import { useUpdateLeadMutation } from "../../services/lead";
import { Lead } from "../../types";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { BiPhone } from "react-icons/bi";

export type TLeadItemProps = {
  originalLead: Lead;
  selected: boolean;
  onSelectionChange: () => void;
};

const LeadItem = ({
  originalLead,
  selected,
  onSelectionChange,
}: TLeadItemProps) => {
  const [editing, setEditing] = useState(false);

  const form = useForm({
    initialValues: { ...originalLead },
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

  const [updateLead, { isLoading, error }] = useUpdateLeadMutation();

  function handleEdit() {
    setEditing(true);
  }

  async function handleSave() {
    try {
      const res = await updateLead(form.values).unwrap();
      console.log("res", res);
      setEditing(false);
    } catch (e) {
      notifications.show({ message: extractErrorMessage(e) });
    }
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    address1,
    address2,
    city,
    state,
    zip,
    notes,
    created_at,
    updated_at,
    call_count,
  } = form.values;

  console.log("originalLead", originalLead);

  if (editing) {
    return (
      <Box className="lead-item">
        <Flex align="center">
          <Checkbox mr="md" checked={selected} onChange={onSelectionChange} />
          <Box>
            <Flex>
              <TextInput
                size="sm"
                readOnly={!editing}
                {...form.getInputProps("first_name")}
              />
              <TextInput
                size="sm"
                readOnly={!editing}
                {...form.getInputProps("last_name")}
              />
            </Flex>
            <TextInput
              readOnly={!editing}
              size="sm"
              {...form.getInputProps("phone")}
            />

            <Box>
              <TextInput
                {...form.getInputProps("address1")}
                placeholder="Address 1"
              />
              <TextInput
                {...form.getInputProps("address2")}
                placeholder="Address 2"
              />
              <Flex>
                <TextInput {...form.getInputProps("city")} placeholder="City" />
                <TextInput
                  {...form.getInputProps("state")}
                  placeholder="State"
                />
                <TextInput {...form.getInputProps("zip")} placeholder="Zip" />
              </Flex>
            </Box>
          </Box>
        </Flex>

        <Box>
          <Textarea {...form.getInputProps("notes")} placeholder="Notes" />
        </Box>

        <Box>
          <Box>
            <Button>Call</Button>
            <Button onClick={handleSave}>Save changes</Button>
          </Box>

          <Text color="red">{extractErrorMessage(error)}</Text>
          <Text>Called {call_count}x</Text>
          <Text size="sm">
            Lead created:
            {format(new Date(created_at), "Pp")}
          </Text>
          <Text size="sm">
            Last updated:
            {format(new Date(updated_at), "Pp")}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="lead-item">
      <Flex align="center">
        <Checkbox mr="md" checked={selected} onChange={onSelectionChange} />
        <Box>
          <Flex>
            <Text size="sm" />
            <Text size="sm" />
          </Flex>
          <Text size="sm" />

          <Box>
            <Flex>
              <Text>{first_name}</Text>
              <Text>{last_name}</Text>
            </Flex>
            <Text>{phone}</Text>
            <Text>{email}</Text>

            <Box>
              <Text>{address1}</Text>
              <Text>{address2}</Text>
              <Flex>
                <Text>{city}</Text>
                <Text>{state}</Text>
                <Text>{zip}</Text>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Flex>

      <Box>
        <Textarea value={notes || ""} readOnly placeholder="No notes" />
      </Box>

      <Box>
        <Box>
          <Button leftIcon={<BiPhone />}>Call</Button>
          <Button variant="outline" loading={isLoading} onClick={handleEdit}>
            Edit
          </Button>
        </Box>

        <Text color="red">{extractErrorMessage(error)}</Text>
        <Text>Called {call_count}x</Text>
        <Text size="sm">
          Lead created:
          {format(new Date(created_at), "Pp")}
        </Text>
        <Text size="sm">
          Last updated:
          {format(new Date(updated_at), "Pp")}
        </Text>
      </Box>
    </Box>
  );
};

export default LeadItem;
