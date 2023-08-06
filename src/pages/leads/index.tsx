import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { Box, Button, Container, Flex, Title } from "@mantine/core";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
//
import LeadsStyled from "./Leads.styles";
import NewLeadModal from "./NewLeadModal";

function Leads() {
  const [opened, { open, close }] = useDisclosure(false);
  const gridRef = useRef<any>(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  const [columnDefs] = useState([
    { field: "make", filter: true },
    { field: "model", filter: true },
    { field: "price" },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
    }),
    []
  );

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event: any) => {
    console.log("cellClicked", event);
  }, []);

  // Example load data from server
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/row-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  return (
    <LeadsStyled>
      <Container py="xl">
        <Flex align="center" justify="space-between">
          <Title order={2}>Leads</Title>
          <Button onClick={open}>Upload .CSV</Button>
        </Flex>

        <Box
          className="ag-theme-alpine"
          style={{ minWidth: 700, height: 500 }}
          my="md"
        >
          <AgGridReact
            ref={gridRef} // Ref for accessing Grid's API
            rowData={rowData} // Row Data for Rows
            columnDefs={columnDefs} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection="multiple" // Options - allows click selection of rows
            onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          />
        </Box>

        <NewLeadModal opened={opened} close={close} />
      </Container>
    </LeadsStyled>
  );
}

export default Leads;
