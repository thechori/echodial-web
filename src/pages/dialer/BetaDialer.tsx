import {
  ActionIcon,
  Button,
  Card,
  Flex,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";
// import { useDisclosure } from "@mantine/hooks";
import { PiPhone } from "react-icons/pi";
import { useAppDispatch } from "../../store/hooks";
import { setShowOptions } from "../../store/dialer/slice";
// import { BiDotsVerticalRounded } from "react-icons/bi";

//
// import NewLeadsMenu from "./NewLeadsMenu";
// import EditLeadSelectionMenu from "./EditLeadSelectionMenu";
// import UploadLeadsViaCsvModal from "./UploadLeadsViaCsvModal";
// import ManualInputLeadModal from "./ManualInputLeadModal";
// import DeleteLeadConfirmationModal from "./DeleteLeadConfirmationModal";
// import EditLeadModal from "./EditLeadModal";

const BetaDialer = () => {
  // const [opened, { open, close }] = useDisclosure(false);
  // const [openedManual, { open: openManual, close: closeManual }] =
  //   useDisclosure(false);
  // const [
  //   openedDeleteConfirmationModal,
  //   { open: openDeleteConfirmationModal, close: closeDeleteConfirmationModal },
  // ] = useDisclosure(false);
  // const [openedEditModal, { open: openEditModal, close: closeEditModal }] =
  //   useDisclosure(false);

  // function deleteLeads() {
  //   openDeleteConfirmationModal();
  // }

  // function editLead() {
  //   openEditModal();
  // }
  const dispatch = useAppDispatch();

  function openDialerOptions() {
    dispatch(setShowOptions(true));
  }

  return (
    // Note: `overflow: visible` is required to support menu bleeding outside of Card bounds (before, it would cut off and not be visible)
    <Card withBorder style={{ overflow: "visible" }}>
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <ThemeIcon radius="xl" size="xl" mr="xs">
            <PiPhone style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Title order={2}>Dialer</Title>
        </Flex>

        <Flex align="center">
          {/* <EditLeadSelectionMenu onDelete={deleteLeads} onEdit={editLead} />
          <NewLeadsMenu onCsvUpload={open} onManualInput={openManual} /> */}
          <ActionIcon
            variant="outline"
            size="lg"
            aria-label="Settings"
            color="primary"
            mx={4}
            onClick={openDialerOptions}
          >
            <IconAdjustments stroke={1.5} />
          </ActionIcon>

          <Button mx={4}>Something 2</Button>
        </Flex>
      </Flex>

      {/* Modals */}
    </Card>
  );
};

export default BetaDialer;
