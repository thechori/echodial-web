import { AgGridReact } from "ag-grid-react";
import { Box, Container, Flex, TextInput, Title } from "@mantine/core";
import { format } from "date-fns";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
//
import { useGetCallsQuery } from "../../services/call";
import phoneFormatter from "../../utils/phone-formatter";
import { Call } from "../../types";
import { ColDef } from "ag-grid-community";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

export function CallHistory() {
  const { data } = useGetCallsQuery();
  const [keyword, setKeyword] = useState("");

  const columnDefs: ColDef<Call>[] = [
    {
      sortable: true,
      resizable: true,
      filter: true,
      headerName: "Called at",
      field: "created_at",
      valueFormatter: (val) => format(new Date(val.value), "Pp"),
    },
    {
      sortable: true,
      resizable: true,
      filter: true,
      field: "from_number",
      headerName: "My phone number",
      valueFormatter: (val) => phoneFormatter(val.value) || "",
    },
    {
      sortable: true,
      resizable: true,
      filter: true,
      field: "to_number",
      headerName: "Lead phone number",
      valueFormatter: (val) => phoneFormatter(val.value) || "",
    },
    {
      sortable: true,
      resizable: true,
      filter: true,
      field: "status",
      headerName: "Status",
    },
    {
      sortable: true,
      resizable: true,
      filter: true,
      field: "duration_ms",
      headerName: "Call duration",
    },
  ];

  return (
    <Container p="md" fluid>
      <Flex justify="space-between" align="center">
        <Title order={3} mb={16}>
          Call history
        </Title>
      </Flex>

      <TextInput
        placeholder="Search..."
        maw={300}
        icon={<IconSearch size="1rem" />}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <Box
        className="ag-theme-alpine lead-grid-container"
        my="md"
        style={{
          height: "calc(100vh - 150px)",
        }}
      >
        <AgGridReact<Call>
          rowData={data}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          quickFilterText={keyword}
        />
      </Box>
    </Container>
  );
}

export default CallHistory;
