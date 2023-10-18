import { Card, Flex, ThemeIcon, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdGroups } from "react-icons/md";
//
import NewLeadsMenu from "./NewLeadsMenu";
import EditLeadSelectionMenu from "./EditLeadSelectionMenu";
import UploadLeadsViaCsvModal from "./UploadLeadsViaCsvModal";
import ManualInputLeadModal from "./ManualInputLeadModal";
import DeleteLeadConfirmationModal from "./DeleteLeadConfirmationModal";
import EditLeadModal from "./EditLeadModal";

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
    // Note: `overflow: visible` is required to support menu bleeding outside of Card bounds (before, it would cut off and not be visible)
    <Card
      withBorder
      style={{
        overflow: "visible",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottom: "none",
      }}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <ThemeIcon radius="xl" size="xl" mr="xs">
            <MdGroups style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Title order={2}>Leads</Title>
        </Flex>

        <Flex align="center">
          <EditLeadSelectionMenu onDelete={deleteLeads} onEdit={editLead} />
          <NewLeadsMenu onCsvUpload={open} onManualInput={openManual} />
        </Flex>
      </Flex>

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
