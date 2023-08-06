import { useState, useRef, useEffect, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { Box, Container, Flex, Text, Title } from "@mantine/core";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
//
import LeadsStyled from "./Leads.styles";
import UploadLeadsViaCsvModal from "./UploadLeadsViaCsvModal";
import NewLeadsMenu from "./NewLeadsMenu";
import apiService from "../../services/api";
import { extractErrorMessage } from "../../utils/error";
import ManualInputLeadModal from "./ManualInputLeadModal";

function Leads() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [openedManual, { open: openManual, close: closeManual }] =
    useDisclosure(false);
  const gridRef = useRef<AgGridReact<any>>(null); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  const [columnDefs] = useState([
    { field: "id", filter: true },
    { field: "email", filter: true },
    { field: "first_name", filter: true },
    { field: "last_name", filter: true },
    { field: "phone", filter: true },
    { field: "created_at", filter: true },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
    }),
    []
  );

  useEffect(() => {
    setLoading(true);

    // Get MY Leads
    apiService("/lead")
      .then((response) => setRowData(response.data))
      .catch((error) => setError(extractErrorMessage(error)));
  }, []);

  useEffect(() => {
    if (loading) {
      gridRef.current?.api?.showLoadingOverlay();
    } else {
      gridRef.current?.api?.hideOverlay();
    }
  }, [loading]);

  return (
    <LeadsStyled>
      <Container fluid py="xl">
        <Flex align="center" justify="space-between">
          <Title order={2}>Leads</Title>
          <NewLeadsMenu onCsvUpload={open} onManualInput={openManual} />
        </Flex>

        <Box className="ag-theme-alpine lead-grid-container" h={500} my="md">
          <AgGridReact
            ref={gridRef} // Ref for accessing Grid's API
            rowData={rowData} // Row Data for Rows
            columnDefs={columnDefs} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection="multiple" // Options - allows click selection of rows
          />
        </Box>

        <Text color="red">{error}</Text>

        <UploadLeadsViaCsvModal opened={opened} close={close} />
        <ManualInputLeadModal opened={openedManual} close={closeManual} />
      </Container>
    </LeadsStyled>
  );
}

export default Leads;
