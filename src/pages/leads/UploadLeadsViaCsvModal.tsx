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
// import { notifications } from "@mantine/notifications";
//
import Dropzone from "./Dropzone";
import { extractErrorMessage } from "../../utils/error";
// import { useAddLeadsViaCsvMutation } from "../../services/lead";
import routes from "../../configs/routes";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { useDispatch } from "react-redux";
import { setFileHeaders, setFileRows, setFile } from "../../store/import/slice";

const UploadLeadsViaCsvModal = ({ opened, close }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  // const [addLeadsViaCsv, { isLoading }] = useAddLeadsViaCsvMutation();

  const form = useForm<{ source: string; file: null | FileWithPath }>({
    initialValues: {
      source: "",
      file: null,
    },
  });

  async function handleSubmit() {
    setError("");

    // Validation
    if (!form.values.file) {
      return setError("Upload file before submitting");
    }

    const csvFile = form.values.file;
    const formData = new FormData();
    formData.append("file", form.values.file);
    dispatch(setFile(formData));
    if (csvFile) {
      Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          if (results.meta.fields && results.data) {
            const firstRowLength = Object.getOwnPropertyNames(
              results.data[0]
            ).length;

            const filteredRows = results.data.filter((row) => {
              const rowKeys = Object.getOwnPropertyNames(row);
              return rowKeys.length === firstRowLength;
            });
            dispatch(setFileHeaders(results.meta.fields));
            dispatch(setFileRows(filteredRows));
            navigate(routes.importLeads);
          }
        },
        error: function (error) {
          return setError(error.message);
        },
      });
    } else {
      setError("File cannot be parsed.");
    }
  }

  function handleClose() {
    form.reset();
    setError("");
    close();
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Upload new leads">
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
            onDrop={(file) => {
              setError("");
              form.setFieldValue("file", file[0]);
            }}
            onReject={(error: any) => {
              setError(extractErrorMessage(error));
            }}
            filename={(form.values.file && form.values.file.name) || ""}
          />
        </Box>

        <Box>
          <TextInput
            label="Source (optional, but recommended)"
            placeholder="e.g., EverQuote"
            py="xs"
            {...form.getInputProps("source")}
          />
          {/* <Button loading={isLoading} onClick={() => navigate(routes.leads)}> */}
          <Button onClick={handleSubmit}>Submit</Button>
          <Text w="100%" mt="sm" color="red">
            {error}
          </Text>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default UploadLeadsViaCsvModal;
