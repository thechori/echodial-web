import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowEvent } from "@mantine/hooks";
import { createSelector } from "@reduxjs/toolkit";
import { AgGridReact } from "ag-grid-react";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import {
  Box,
  Button,
  Card,
  Flex,
  MultiSelect,
  SelectItem,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
//
import { Lead } from "../../types";
import DeleteLeadConfirmationModal from "./DeleteLeadConfirmationModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useGetLeadsQuery } from "../../services/lead";
import LeadsFilterDrawer from "./LeadsFilterDrawer";
import { leadColDefs } from "./leadColDefs";
import { useGetLeadStatusesQuery } from "../../services/lead.status";
import { CellClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import {
  setIsSelectModeActive,
  setRequestForImportLeadsModal,
  setRequestForManualCreateLeadsModal,
  setSelectedRows,
} from "../../store/leads/slice";
import { TableActionCell } from "./TableActionCell";
import { LeadsFilteredListStyled } from "./LeadsFilteredList.styles";
import { dialStateInstance } from "../dialer/DialState.class";
import { useGetLeadCustomPropertiesQuery } from "../../services/lead";
import { ColDef } from "ag-grid-community";
import { MdLibraryAddCheck } from "react-icons/md";

function LeadsFilteredList() {
  const { isSelectModeActive } = useAppSelector((state) => state.leads);
  const { data: leadStatuses } = useGetLeadStatusesQuery();
  const { data: leads } = useGetLeadsQuery();
  const [
    openedDeleteConfirmationModal,
    { open: openDeleteConfirmationModal, close: closeDeleteConfirmationModal },
  ] = useDisclosure(false);

  // Custom Properties
  const { data: customProperties, isLoading: customPropertiesLoading } =
    useGetLeadCustomPropertiesQuery();

  // Register custom cell renderer components for AG Grid (in hopes of improving terrible current performance)
  const components = useMemo(
    () => ({
      tableActionCell: TableActionCell,
    }),
    []
  );

  const [columnDefs, setColumnDefs] = useState<ColDef<Lead>[]>([]);

  useEffect(() => {
    let newCustomPropertiesArray: ColDef<Lead>[] = [];
    if (!customPropertiesLoading && customProperties) {
      for (const property of customProperties) {
        const newColumn: ColDef<Lead> = {
          headerName: property.label,
          // @ts-ignore - Ignoring for now, app seems to work just fine with this code
          field: property.name,
          resizable: true,
          sortable: true,
          filter: true,
        };
        if (
          !newCustomPropertiesArray.some((col) => col.field === newColumn.field)
        ) {
          newCustomPropertiesArray = [...newCustomPropertiesArray, newColumn];
        }
      }
      const updatedColsArray = [...leadColDefs, ...newCustomPropertiesArray];
      setColumnDefs(updatedColsArray);
    }
  }, [customProperties, customPropertiesLoading]);

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
            return false;
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

        // Add Custom property to leads
        const leadsWithCustomProperties = filteredLeads.map((lead: any) => {
          const customProperties = lead.custom_properties || {}; // Make sure custom_properties is defined
          return {
            ...lead,
            ...customProperties,
          };
        });

        /* TODO: Recommended filters */
        // Return what's left over from the filters
        return leadsWithCustomProperties;
      }
    );
  }, [selectedStatuses, appliedFilters]);

  // Use the same posts query, but extract only part of its data
  const { filteredLeads } = useGetLeadsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      filteredLeads: selectFilteredLeads(result),
    }),
  });

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    console.log("hey", event.api.getSelectedRows());
    dispatch(setSelectedRows(event.api.getSelectedRows()));
  };

  const onCellClicked = (event: CellClickedEvent) => {
    // TODO: Check to see if details are open and dirty, if so, show a confirmation dialog to abandon changes

    // Proceed
    console.log(event.data.id);
    // const selectedRows = e.api.getSelectedNodes();
    // console.log(selectedRows);
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

  // Lift gridRef into global state for use in other components
  useEffect(() => {
    dialStateInstance.gridRef = gridRef;
  }, [gridRef]);

  useEffect(() => {
    console.log(columnDefs);
  }, [isSelectModeActive]);

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
              w={300}
              px="md"
              icon={<IconSearch size="1rem" />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Flex>

          <Flex align="center">
            {!isSelectModeActive && (
              <Button
                variant="subtle"
                leftIcon={<MdLibraryAddCheck fontSize="1.25rem" />}
                onClick={() => dispatch(setIsSelectModeActive(true))}
              >
                Select
              </Button>
            )}
            {isSelectModeActive && (
              <Button
                size="xs"
                color="red"
                mx={8}
                leftIcon={<IconTrash />}
                variant="subtle"
                onClick={deleteLeads}
                disabled={selectedRows.length === 0}
              >
                Delete
              </Button>
            )}
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
              suppressRowClickSelection={true}
              quickFilterText={keyword}
              onSelectionChanged={onSelectionChanged}
              onCellClicked={onCellClicked}
              components={components}
              suppressMenuHide={true}
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
