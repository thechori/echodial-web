import { useEffect } from "react";
import { Card, Flex, ThemeIcon, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdGroups } from "react-icons/md";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import NewLeadsMenu from "./LeadsHeader";
import UploadLeadsViaCsvModal from "../import-leads/UploadLeadsViaCsvModal";
import ManualInputLeadModal from "./ManualInputLeadModal";
import {
  setRequestForImportLeadsModal,
  setRequestForManualCreateLeadsModal,
} from "../../store/leads/slice";

const LeadsFilter = () => {
  const dispatch = useAppDispatch();
  const {
    selectedRows,
    shouldImportLeadsModalOpen,
    shouldManualCreateLeadModalOpen,
  } = useAppSelector((state) => state.leads);
  const [opened, { open: openImport, close }] = useDisclosure(false);
  const [openedManual, { open: openManual, close: closeManual }] =
    useDisclosure(false);

  // Allow opening of modals from other components (e.g., filtered list)
  useEffect(() => {
    if (shouldImportLeadsModalOpen) {
      openImport();
      dispatch(setRequestForImportLeadsModal(false));
    }
  }, [shouldImportLeadsModalOpen]);
  useEffect(() => {
    if (shouldManualCreateLeadModalOpen) {
      openManual();
      dispatch(setRequestForManualCreateLeadsModal(false));
    }
  }, [shouldManualCreateLeadModalOpen]);

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
          ></Flex>
          <NewLeadsMenu onCsvUpload={openImport} onManualInput={openManual} />
        </Flex>
      </Flex>

      {/* Modals */}
      <UploadLeadsViaCsvModal opened={opened} close={close} />
      <ManualInputLeadModal opened={openedManual} close={closeManual} />
    </Card>
  );
};

export default LeadsFilter;
