import {
  Stepper,
  Button,
  Flex,
  Paper,
  Space,
  Modal,
  Table,
  Title,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useAddLeadsViaCsvMutation } from "../../services/lead";
import { useEffect } from "react";
import routes from "../../configs/routes";
import styled from "@emotion/styled";
import MappingTable from "./MappingTable";

const ImportLeadsStyled = styled.div`
  min-height: calc(100vh);
  z-index: 200;
  position: relative;
  background-color: white;
`;
function ImportLeads() {
  const [active, setActive] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const showButton = useAppSelector((state) => state.importLeads.allMapped);
  const file = useAppSelector((state) => state.importLeads.file);
  const [addLeadsViaCsv, { isLoading }] = useAddLeadsViaCsvMutation();

  const headerToProperties = useAppSelector(
    (state) => state.importLeads.headersToProperties
  );
  const [mappingTable, setMappingTable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!file) {
      navigate(routes.leads);
    }
  });

  const openModal = () => {
    open();
    setActive((current) => (current < 2 ? current + 1 : current));
    let tempTable: any = [];
    for (let i = 0; i < headerToProperties.length; i++) {
      if (!headerToProperties[i].excludeHeader) {
        tempTable.push(
          <tr key={i}>
            <td>{headerToProperties[i].columnHeader}</td>
            <td>{headerToProperties[i].property}</td>
          </tr>
        );
      }
    }
    setMappingTable(tempTable);
  };
  async function submitModalHandler() {
    try {
      const headerToPropertiesString = JSON.stringify(headerToProperties);

      const value = file.get("headerToProperties");
      if (value) {
        file.delete("headerToProperties");
      }

      file.append("headerToProperties", headerToPropertiesString);
      await addLeadsViaCsv(file).unwrap();
      notifications.show({ message: "Leads successfully uploaded!" });
      close();
      navigate(routes.leads);
    } catch (error) {
      notifications.show({
        message:
          "There was an error uploading leads. Please double check your values",
      });
    }
  }

  function exitModal() {
    close();
    setActive((current) => (current > 0 ? current - 1 : current));
  }

  return (
    <ImportLeadsStyled>
      <Space h="lg" />
      <Stepper active={active} py="xl" px="xl">
        <Stepper.Step label="Import files">Contents</Stepper.Step>
        <Stepper.Step label="Map columns"></Stepper.Step>
        <Stepper.Step label="Confirmation"></Stepper.Step>
      </Stepper>
      <MappingTable />
      <Modal opened={opened} onClose={exitModal} centered>
        <Flex justify="center">
          <Title order={2}>Confirmation</Title>
        </Flex>
        <Flex justify="center" py="xs">
          <Text c="dimmed">Excluded headers aren't shown</Text>
        </Flex>
        <Table
          highlightOnHover
          horizontalSpacing="lg"
          verticalSpacing="xs"
          py="xl"
        >
          <thead>
            <tr>
              <th>Column Header</th>
              <th>Property</th>
            </tr>
          </thead>
          <tbody>{mappingTable}</tbody>
        </Table>
        <Flex justify="center" py="lg">
          <Button loading={isLoading} onClick={submitModalHandler}>
            Submit
          </Button>
        </Flex>
      </Modal>
      <Paper
        style={{
          position: "fixed",
          bottom: "0",
          width: "100%",
        }}
        withBorder
        radius="xs"
        bg="gray.3"
      >
        <Flex justify="space-between" align="center" py="lg" px="xl">
          <Button onClick={() => navigate(routes.leads)}>Cancel</Button>
          <Flex justify="space-between" gap="md" align="center">
            <Button onClick={openModal} disabled={!showButton}>
              Next
            </Button>
          </Flex>
        </Flex>
      </Paper>
    </ImportLeadsStyled>
  );
}

export default ImportLeads;
