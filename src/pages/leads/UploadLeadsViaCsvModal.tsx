import { useState } from "react";
import {
  Box,
  Button,
  List,
  Modal,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FileWithPath } from "@mantine/dropzone";
import { IconCircleCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
//
import Dropzone from "./Dropzone";
import apiService from "../../services/api";
import { extractErrorMessage } from "../../utils/error";

const UploadLeadsViaCsvModal = ({ opened, close }: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<{ source: string; files: null | FileWithPath[] }>({
    initialValues: {
      source: "",
      files: null,
    },
  });

  async function handleSubmit() {
    // Clear errors
    setError("");

    // Validation
    if (!form.values.files) {
      return setError("Upload file before submitting");
    }

    setLoading(true);

    try {
      const res = await apiService.post("/lead/bulk", {
        ...form.values,
      });

      console.log("res", res);
      notifications.show({
        message: "Successfully uploaded leads",
      });
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal opened={opened} onClose={close} title="Upload new leads">
      <Modal.Body>
        <Text mb="md">
          In order to properly upload, ensure your column headers have the
          following names:
        </Text>

        <List
          ta="left"
          spacing="xs"
          size="sm"
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconCircleCheck size="0.75rem" />
            </ThemeIcon>
          }
        >
          <List.Item>email</List.Item>
          <List.Item>first_name</List.Item>
          <List.Item>last_name</List.Item>
          <List.Item>phone_number (format must be "XXX-XXX-XXXX")</List.Item>
        </List>

        <Box my="md">
          <Dropzone
            onDrop={(files) => {
              console.log("got files", files);
              form.setFieldValue("files", files);
            }}
          />
        </Box>

        <Box>
          <TextInput
            label="Source (optional, but recommended)"
            placeholder="e.g., EverQuote"
            py="xs"
          />
          <Button loading={loading} onClick={handleSubmit}>
            Submit
          </Button>
          <Text w="100%" color="red">
            {error}
          </Text>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default UploadLeadsViaCsvModal;
