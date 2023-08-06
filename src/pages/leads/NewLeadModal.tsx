import {
  Box,
  Button,
  Center,
  List,
  Modal,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import Dropzone from "./Dropzone";

const NewLeadModal = ({ opened, close }: any) => {
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
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconCircleCheck size="0.75rem" />
            </ThemeIcon>
          }
        >
          <List.Item>email</List.Item>
          <List.Item>first_name</List.Item>
          <List.Item>last_name</List.Item>
          <List.Item>phone_number</List.Item>
        </List>

        <Box my="md">
          <Dropzone />
        </Box>

        <Center>
          <Button onClick={() => alert("ty")}>Submit</Button>
        </Center>

        {/* <Text w="100%" color="red">
              {error}
            </Text> */}
      </Modal.Body>
    </Modal>
  );
};

export default NewLeadModal;
