import { Button, Card, Flex, ThemeIcon, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdGroups } from "react-icons/md";
import { IconTrash } from "@tabler/icons-react";
//
import { useAppSelector } from "../../store/hooks";
import NewLeadsMenu from "./NewLeadsMenu";
import UploadLeadsViaCsvModal from "./UploadLeadsViaCsvModal";
import ManualInputLeadModal from "./ManualInputLeadModal";
import DeleteLeadConfirmationModal from "./DeleteLeadConfirmationModal";

const LeadsFilter = () => {
  const { selectedRows } = useAppSelector((state) => state.leads);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedManual, { open: openManual, close: closeManual }] =
    useDisclosure(false);
  const [
    openedDeleteConfirmationModal,
    { open: openDeleteConfirmationModal, close: closeDeleteConfirmationModal },
  ] = useDisclosure(false);

  function deleteLeads() {
    openDeleteConfirmationModal();
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
          <Flex
            className="action-buttons"
            style={{
              visibility: selectedRows.length === 0 ? "hidden" : "unset",
            }}
          >
            <Button
              size="xs"
              color="red"
              mx={6}
              leftIcon={<IconTrash />}
              variant="subtle"
              onClick={deleteLeads}
            >
              Delete
            </Button>
          </Flex>
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
    </Card>
  );
};

export default LeadsFilter;
