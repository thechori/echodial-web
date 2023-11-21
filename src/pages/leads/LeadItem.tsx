import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Paper,
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
import phoneFormatter from "../../utils/phone-formatter";

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
        if (!val) return null;
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

  function handleCancelEdit() {
    setEditing(false);
  }

  async function handleSave() {
    try {
      const updatedLead = await updateLead(form.values).unwrap();
      setEditing(false);
      form.setValues(updatedLead);
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

  if (editing) {
    return (
      <Paper shadow="sm">
        <Flex className="lead-item" align="center" justify="space-between">
          <Flex align="center">
            <Checkbox mr="md" checked={selected} onChange={onSelectionChange} />
            <Box>
              <Flex>
                <TextInput
                  size="sm"
                  readOnly={!editing}
                  {...form.getInputProps("first_name")}
                  placeholder="First name"
                />
                <TextInput
                  size="sm"
                  readOnly={!editing}
                  {...form.getInputProps("last_name")}
                  placeholder="Last name"
                />
              </Flex>
              <TextInput
                readOnly={!editing}
                size="sm"
                {...form.getInputProps("phone")}
                placeholder="Phone"
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
                  <TextInput
                    {...form.getInputProps("city")}
                    placeholder="City"
                  />
                  <TextInput
                    {...form.getInputProps("state")}
                    placeholder="State"
                  />
                  <TextInput {...form.getInputProps("zip")} placeholder="Zip" />
                </Flex>
              </Box>
            </Box>
          </Flex>

          <Box w={200}>
            <Textarea
              label="Notes"
              {...form.getInputProps("notes")}
              placeholder="No notes yet"
            />
          </Box>

          <Box>
            <Box>
              <Button onClick={handleSave}>Save changes</Button>
              <Button onClick={handleCancelEdit} variant="outline">
                Cancel
              </Button>
              <Button color="red">Delete</Button>
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
        </Flex>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm">
      <Flex className="lead-item" align="center" justify="space-between">
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
                <Text ml={4}>{last_name}</Text>
              </Flex>
              <Text>{phoneFormatter(phone)}</Text>
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
          <Textarea
            label="Notes"
            value={notes || ""}
            readOnly
            placeholder="No notes yet"
          />
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
      </Flex>
    </Paper>
  );
};

export default LeadItem;
