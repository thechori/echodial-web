import { useState } from "react";
import { Box, Button, Modal, Text, TextInput, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FileWithPath } from "@mantine/dropzone";
import Dropzone from "./Dropzone";
import { extractErrorMessage } from "../../utils/error";
import routes from "../../configs/routes";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { useDispatch } from "react-redux";
import { setFileHeaders, setFileRows, setFile } from "../../store/import/slice";
import * as amplitude from "@amplitude/analytics-browser";

const UploadLeadsViaCsvModal = ({ opened, close }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

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
    formData.append("source", form.values.source);

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
            amplitude.track("Upload files successfully uploaded");

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
          Choose a file from your computer and click the Continue button to
          proceed. On the next page, you'll finalize the column mapping and
          upload of your new leads.
        </Text>

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
            py="md"
            {...form.getInputProps("source")}
          />
          <Flex justify="center">
            <Button onClick={handleSubmit}>Continue</Button>
          </Flex>
          <Text w="100%" mt="sm" color="red">
            {error}
          </Text>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default UploadLeadsViaCsvModal;
