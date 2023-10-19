import { useCallback, useMemo, useRef, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { AgGridReact } from "ag-grid-react";
import {
  Box,
  Button,
  Card,
  Flex,
  MultiSelect,
  SelectItem,
  TextInput,
} from "@mantine/core";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
//
import { Lead } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useGetLeadsQuery } from "../../services/lead";
import LeadsFilterDrawer from "./LeadsFilterDrawer";
import { leadColDefs } from "./leadColDefs";
import { setSelectedRows } from "../../store/leads/slice";
import { useGetLeadStatusesQuery } from "../../services/lead-status";

function LeadsFilteredList() {
  const { data: leadStatuses } = useGetLeadStatusesQuery();

  const dispatch = useAppDispatch();
  const gridRef = useRef<any>(); // TODO: type this properly
  const [keyword, setKeyword] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const { appliedFilters } = useAppSelector((state) => state.leads);

  // Filter based on status
  // Filter based on filters (e.g., has been called)
  const selectFilteredLeads = useMemo(() => {
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (res) => res.data,
      (leads) => {
        // Handle undefined data
        if (!leads) return;

        // Handle no status filters
        if (selectedStatuses.length === 0) return leads;

        // Handle lead filtering
        // @ts-ignore
        return leads.filter((l) => {
          if (selectedStatuses.includes(l.status)) {
            return true;
          }
          return false;
        });
      }
    );
  }, [selectedStatuses]);

  // Use the same posts query, but extract only part of its data
  const { filteredLeads } = useGetLeadsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      filteredLeads: selectFilteredLeads(result),
    }),
  });

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    dispatch(setSelectedRows(selectedRows));
  }, []);

  const selectItems: SelectItem[] = leadStatuses
    ? leadStatuses.map((leadStatus) => ({
        value: leadStatus.value,
        label: leadStatus.label,
      }))
    : [];

  return (
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
        </Flex>

        <TextInput
          placeholder="Quickly filter by name, email, etc..."
          w="100%"
          px="md"
          label="Search"
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
      <Box className="ag-theme-alpine lead-grid-container" h={500} my="md">
        <AgGridReact<Lead>
          ref={gridRef}
          // @ts-ignore
          rowData={filteredLeads}
          columnDefs={leadColDefs}
          quickFilterText={keyword}
          animateRows={true}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
        />
      </Box>
      <LeadsFilterDrawer
        opened={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />
    </Card>
  );
}

export default LeadsFilteredList;
