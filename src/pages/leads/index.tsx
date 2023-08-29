import { useDisclosure } from "@mantine/hooks";
import { Box, Container, Flex, Title } from "@mantine/core";
//
import LeadsStyled from "./Leads.styles";
import UploadLeadsViaCsvModal from "./UploadLeadsViaCsvModal";
import NewLeadsMenu from "./NewLeadsMenu";
import ManualInputLeadModal from "./ManualInputLeadModal";
import EditLeadSelectionMenu from "./EditLeadSelectionMenu";
import DeleteLeadConfirmationModal from "./DeleteLeadConfirmationModal";
import EditLeadModal from "./EditLeadModal";
import LeadsTable from "./LeadsTable";

function Leads() {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedManual, { open: openManual, close: closeManual }] =
    useDisclosure(false);
  const [
    openedDeleteConfirmationModal,
    { open: openDeleteConfirmationModal, close: closeDeleteConfirmationModal },
  ] = useDisclosure(false);
  const [openedEditModal, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  function deleteLeads() {
    openDeleteConfirmationModal();
  }

  function editLead() {
    openEditModal();
  }

  return (
    <LeadsStyled>
      <Container fluid size="xl" py="md">
        <Flex align="center" justify="space-between">
          <Title order={2}>Leads</Title>
          <Flex>
            <EditLeadSelectionMenu onDelete={deleteLeads} onEdit={editLead} />
            <NewLeadsMenu onCsvUpload={open} onManualInput={openManual} />
          </Flex>
        </Flex>

        <Box className="ag-theme-alpine lead-grid-container" h={500} my="md">
          <LeadsTable />
        </Box>

        <UploadLeadsViaCsvModal opened={opened} close={close} />
        <ManualInputLeadModal opened={openedManual} close={closeManual} />
        <DeleteLeadConfirmationModal
          opened={openedDeleteConfirmationModal}
          close={closeDeleteConfirmationModal}
        />
        <EditLeadModal opened={openedEditModal} close={closeEditModal} />
      </Container>
    </LeadsStyled>
  );
}

export default Leads;
