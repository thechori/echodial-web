import { Stepper, Button, Flex, Paper, Space, Drawer } from "@mantine/core";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import routes from "../../configs/routes";
import styled from "@emotion/styled";
import MappingTable from "./MappingTable";
import DrawerContent from "./DrawerContent";
const ImportLeadsStyled = styled.div`
  min-height: calc(100vh);
  z-index: 200;
  position: relative;
  background-color: white;
`;
function ImportLeads() {
  const [active, setActive] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  //   const prevStep = () =>
  //     setActive((current) => (current > 1 ? current - 1 : current));
  const showButton = useAppSelector((state) => state.importLeads.allMapped);
  const navigate = useNavigate();

  return (
    <ImportLeadsStyled>
      <Space h="lg" />
      <Stepper active={active} py="xl" px="xl">
        <Stepper.Step label="Import files">Contents</Stepper.Step>
        <Stepper.Step label="Map columns">
          <MappingTable />
        </Stepper.Step>
        <Stepper.Step label="Confirmation">
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Drawer
        opened={opened}
        onClose={close}
        overlayProps={{ opacity: 0.5, blur: 4 }}
        transitionProps={{
          transition: "fade",
          duration: 500,
          timingFunction: "ease",
        }}
        position="right"
      >
        <DrawerContent />
      </Drawer>

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
            <Button onClick={open}>Add Property</Button>
            <Button onClick={nextStep} disabled={!showButton}>
              Next
            </Button>
          </Flex>
        </Flex>
      </Paper>
    </ImportLeadsStyled>
  );
}

export default ImportLeads;
