import {
  Stepper,
  Button,
  Flex,
  Paper,
  Space,
  Modal,
  Table,
} from "@mantine/core";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";

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

  const headerToProperties = useAppSelector(
    (state) => state.importLeads.headersToProperties
  );
  const [mappingTable, setMappingTable] = useState([]);
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

  function exitModal() {
    close();
    setActive((current) => (current > 0 ? current - 1 : current));
  }

  const navigate = useNavigate();

  return (
    <ImportLeadsStyled>
      <Space h="lg" />
      <Stepper active={active} py="xl" px="xl">
        <Stepper.Step label="Import files">Contents</Stepper.Step>
        <Stepper.Step label="Map columns"></Stepper.Step>
        <Stepper.Step label="Confirmation"></Stepper.Step>
      </Stepper>
      <MappingTable />
      <Modal opened={opened} onClose={exitModal} title="Confirmation" centered>
        <Table>
          <thead>
            <tr>
              <th>Column Header</th>
              <th>Property</th>
            </tr>
          </thead>
          <tbody>{mappingTable}</tbody>
        </Table>
        <Button>Submit</Button>
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
