import { Box, Card, Flex, ThemeIcon, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
//
import NewLeadsMenu from "./NewLeadsMenu";
import EditLeadSelectionMenu from "./EditLeadSelectionMenu";
import UploadLeadsViaCsvModal from "./UploadLeadsViaCsvModal";
import ManualInputLeadModal from "./ManualInputLeadModal";
import DeleteLeadConfirmationModal from "./DeleteLeadConfirmationModal";
import EditLeadModal from "./EditLeadModal";
import LeadsStatusFilter from "./LeadsStatusFilter";

const LeadsFilter = () => {
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
    <Card withBorder>
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <ThemeIcon radius="xl" size="xl" mr="xs">
            <IconFilter style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Title order={2}>Filter</Title>
        </Flex>

        <Flex align="center">
          <EditLeadSelectionMenu onDelete={deleteLeads} onEdit={editLead} />
          <NewLeadsMenu onCsvUpload={open} onManualInput={openManual} />
        </Flex>
      </Flex>

      <Box>
        <LeadsStatusFilter />
      </Box>

      {/* Modals */}
      <UploadLeadsViaCsvModal opened={opened} close={close} />
      <ManualInputLeadModal opened={openedManual} close={closeManual} />
      <DeleteLeadConfirmationModal
        opened={openedDeleteConfirmationModal}
        close={closeDeleteConfirmationModal}
      />
      <EditLeadModal opened={openedEditModal} close={closeEditModal} />
    </Card>
  );
};

export default LeadsFilter;
