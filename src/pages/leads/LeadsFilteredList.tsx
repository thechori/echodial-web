import { useMemo, useRef, useState } from "react";
import { useWindowEvent } from "@mantine/hooks";
import { createSelector } from "@reduxjs/toolkit";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { AgGridReact } from "ag-grid-react";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import {
  Box,
  Button,
  Card,
  Flex,
  HoverCard,
  MultiSelect,
  SelectItem,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PiPhone } from "react-icons/pi";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
//
import { Lead } from "../../types";
import DeleteLeadConfirmationModal from "./DeleteLeadConfirmationModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useGetLeadsQuery } from "../../services/lead";
import LeadsFilterDrawer from "./LeadsFilterDrawer";
import { leadColDefs } from "./leadColDefs";
import { useGetLeadStatusesQuery } from "../../services/lead-status";
import { SelectionChangedEvent } from "ag-grid-community";
import {
  setAlphaDialerVisible,
  setDialQueue,
  setDialQueueIndex,
} from "../../store/dialer/slice";
import { dialStateInstance } from "../dialer/DialState.class";
import {
  setRequestForImportLeadsModal,
  setRequestForManualCreateLeadsModal,
  setSelectedRows,
} from "../../store/leads/slice";
import { TableActionCell } from "./TableActionCell";
import { LeadsFilteredListStyled } from "./LeadsFilteredList.styles";

function LeadsFilteredList() {
  const { data: leadStatuses } = useGetLeadStatusesQuery();
  const { data: leads } = useGetLeadsQuery();
  const [
    openedDeleteConfirmationModal,
    { open: openDeleteConfirmationModal, close: closeDeleteConfirmationModal },
  ] = useDisclosure(false);

  // Register custom cell renderer components for AG Grid (in hopes of improving terrible current performance)
  const components = useMemo(
    () => ({
      tableActionCell: TableActionCell,
    }),
    []
  );

  const columnDefs = useMemo(() => leadColDefs, []);

  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact<Lead>>(null);
  const [keyword, setKeyword] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const { appliedFilters, selectedRows } = useAppSelector(
    (state) => state.leads
  );
  const { selectedLead } = useAppSelector((state) => state.leadDetail);

  // Filter based on status
  // Filter based on filters (e.g., has been called)
  const selectFilteredLeads = useMemo(() => {
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (res) => res.data,
      // Filter by status
      (leads: any) => {
        // Handle undefined data
        if (!leads) return;

        // Init return array
        let filteredLeads = leads;

        /* Filter by status */

        // Filters are present, filter on them
        if (selectedStatuses.length) {
          filteredLeads = filteredLeads.filter((lead: Lead) => {
            // Status
            if (selectedStatuses.includes(lead.status || "")) {
              return true;
            }
          });
        }

        /* Filters */

        // Applied filters are present, filter on them
        if (appliedFilters.length) {
          for (const f of appliedFilters) {
            filteredLeads = filteredLeads.filter((lead: Lead) => {
              const isMatch = f.fn(lead);
              return isMatch;
            });
          }
        }

        /* TODO: Recommended filters */

        // Return what's left over from the filters
        return filteredLeads;
      }
    );
  }, [selectedStatuses, keyword, appliedFilters]);

  // Use the same posts query, but extract only part of its data
  const { filteredLeads } = useGetLeadsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      filteredLeads: selectFilteredLeads(result),
    }),
  });

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    dispatch(setSelectedRows(event.api.getSelectedRows()));
  };

  const startDialer = () => {
    // Reset index
    dialStateInstance.dialQueueIndex = null;
    dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));

    // Load up leads into queue from selected items
    const selectedLeads = gridRef.current?.api.getSelectedRows();

    dispatch(setDialQueue(selectedLeads));

    // Open dialer
    dispatch(setAlphaDialerVisible(true));
  };

  const openImportModal = () => {
    dispatch(setRequestForImportLeadsModal(true));
  };
  const openManualModal = () => {
    dispatch(setRequestForManualCreateLeadsModal(true));
  };

  const deleteLeads = () => {
    openDeleteConfirmationModal();
  };

  const selectItems: SelectItem[] = leadStatuses
    ? leadStatuses.map((leadStatus) => ({
        value: leadStatus.value,
        label: leadStatus.label,
      }))
    : [];

  // Deselect rows when ESC key is hit
  useWindowEvent("keydown", (e) => {
    if (e.key === "Escape") {
      if (!selectedLead) {
        gridRef.current?.api.deselectAll();
      }
    }
  });

  return (
    <LeadsFilteredListStyled>
      <Card
        withBorder
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <Flex align="flex-end" justify="space-between">
          <Flex align="flex-end">
            <MultiSelect
              w={200}
              label="Status"
              placeholder="Choose a status"
              data={selectItems}
              value={selectedStatuses}
              onChange={(values) => setSelectedStatuses(values)}
              clearButtonProps={{ "aria-label": "Clear selection" }}
              clearable
            />
            <TextInput
              placeholder="Search..."
              maw={200}
              px="md"
              icon={<IconSearch size="1rem" />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button
              variant={appliedFilters.length ? "light" : "subtle"}
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              leftIcon={<HiOutlineAdjustmentsHorizontal size={20} />}
            >
              Filters ({appliedFilters.length})
            </Button>
          </Flex>

          <Flex align="center">
            {selectedRows.length > 0 && (
              <Button
                size="xs"
                color="red"
                mx={8}
                leftIcon={<IconTrash />}
                variant="subtle"
                onClick={deleteLeads}
              >
                Delete
              </Button>
            )}

            <HoverCard width={280} shadow="md" openDelay={500}>
              <HoverCard.Target>
                <Button
                  mx={8}
                  leftIcon={<PiPhone size={16} />}
                  onClick={startDialer}
                  variant="gradient"
                  disabled={selectedRows.length === 0}
                >
                  Start dial session
                </Button>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm">
                  Clicking "Start dial session" will load the selected leads
                  into your dialer queue to begin dialing. You must have at
                  least one lead selected for this option to become enabled.
                </Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Flex>
        </Flex>

        {leads?.length === 0 ? (
          <Flex justify="center" align="center" w="100%" h={500}>
            <Box ta="center">
              <Text size="sm" mb="lg">
                Looks like you're new here. Add some leads to get started!
              </Text>
              <Button variant="gradient" onClick={openImportModal}>
                Upload a file
              </Button>
              <Text mt="sm">or</Text>
              <Button variant="subtle" onClick={openManualModal}>
                Create a new lead manually
              </Button>
            </Box>
          </Flex>
        ) : (
          <Box
            className="ag-theme-alpine"
            my="md"
            style={{
              width: "100%",
              height: "calc(100vh - 240px)",
            }}
          >
            <AgGridReact<Lead>
              ref={gridRef}
              rowData={filteredLeads}
              columnDefs={columnDefs}
              animateRows={true}
              rowSelection="multiple"
              suppressRowClickSelection
              quickFilterText={keyword}
              onSelectionChanged={onSelectionChanged}
              components={components}
            />
          </Box>
        )}

        <DeleteLeadConfirmationModal
          opened={openedDeleteConfirmationModal}
          close={closeDeleteConfirmationModal}
        />
        <LeadsFilterDrawer
          opened={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
        />
      </Card>
    </LeadsFilteredListStyled>
  );
}

export default LeadsFilteredList;
