import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Box, Button, Card, Flex, MultiSelect, TextInput } from "@mantine/core";
import { format } from "date-fns";
//
import { Lead } from "../../types";
import phoneFormatter from "../../utils/phone-formatter";
// import { useAppSelector } from "../../store/hooks";
import { useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { useGetLeadsQuery } from "../../services/lead";

const colDefs: ColDef<Lead>[] = [
  {
    filter: true,
    width: 10,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true,
    headerCheckboxSelectionFilteredOnly: true,
  },
  {
    field: "first_name",
    headerName: "First name",
    filter: true,
    resizable: true,
  },
  {
    field: "last_name",
    headerName: "Last name",
    filter: true,
    resizable: true,
  },
  {
    field: "phone",
    filter: true,
    resizable: true,
    cellRenderer: (param: any) => phoneFormatter(param.value),
  },
  { field: "email", filter: true, resizable: true },
  { field: "source", filter: true, headerName: "Lead vendor", resizable: true },
  {
    field: "created_at",
    headerName: "Created at",
    filter: true,
    resizable: true,
    valueFormatter: (param) => format(new Date(param.value), "Pp"),
  },
];

type TOption = {
  value: string;
  label: string;
};

function LeadsFilteredList() {
  const availableStatuses: TOption[] = [
    { value: "new", label: "New" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "inProgress", label: "In progress" },
    { value: "unqualified", label: "Unqualified" },
    { value: "attemptedToContact", label: "Attempted to contact" },
  ];

  const [keyword, setKeyword] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const selectFilteredLeads = useMemo(() => {
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (res) => res.data,
      (data) => data
    );
  }, []);

  // Use the same posts query, but extract only part of its data
  const { filteredLeads } = useGetLeadsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      filteredLeads: selectFilteredLeads(result),
    }),
  });

  function onSelectionChanged(e: any) {
    console.log("e", e);
  }

  console.log("filteredLeads", filteredLeads);

  return (
    <Card withBorder>
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <MultiSelect
            w={300}
            label="Status"
            placeholder="Choose a status"
            data={availableStatuses}
            value={selectedStatuses}
            onChange={(values) => setSelectedStatuses(values)}
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

        <Flex>
          <Button mx={6} variant="subtle">
            Action 1
          </Button>
          <Button mx={6} variant="light">
            Action 2
          </Button>
          <Button mx={6} variant="outline">
            Action 3
          </Button>
        </Flex>
      </Flex>
      <Box className="ag-theme-alpine lead-grid-container" h={500} my="md">
        <AgGridReact<Lead>
          // ref={gridRef}
          // @ts-ignore
          rowData={filteredLeads}
          columnDefs={colDefs}
          quickFilterText={keyword}
          animateRows={true}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
        />
      </Box>
    </Card>
  );
}

export default LeadsFilteredList;
