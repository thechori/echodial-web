import { useRef, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { ColDef } from "ag-grid-community";
import { Box, Container, Flex, Text, Title } from "@mantine/core";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
//
import LeadsStyled from "./Leads.styles";
import UploadLeadsViaCsvModal from "./UploadLeadsViaCsvModal";
import NewLeadsMenu from "./NewLeadsMenu";
import ManualInputLeadModal from "./ManualInputLeadModal";
import phoneFormatter from "../../utils/phone-formatter";
import { Lead, useGetLeadsQuery } from "../../services/lead";

const colDefs: ColDef<Lead>[] = [
  { field: "id", headerName: "ID", filter: true, width: 100 },
  {
    field: "phone",
    filter: true,
    cellRenderer: (param: any) => phoneFormatter(param.value),
  },
  { field: "first_name", headerName: "First name", filter: true },
  { field: "last_name", headerName: "Last name", filter: true },
  { field: "email", filter: true },
  { field: "created_at", headerName: "Created at", filter: true },
];

function Leads() {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedManual, { open: openManual, close: closeManual }] =
    useDisclosure(false);
  const gridRef = useRef<AgGridReact<Lead>>(null); // Optional - for accessing Grid's API

  const { data, error: leadsApiError, isLoading } = useGetLeadsQuery();

  useEffect(() => {
    if (isLoading) {
      gridRef.current?.api?.showLoadingOverlay();
    } else {
      gridRef.current?.api?.hideOverlay();
    }
  }, [isLoading]);

  return (
    <LeadsStyled>
      <Container fluid py="xl">
        <Flex align="center" justify="space-between">
          <Title order={2}>Leads</Title>
          <NewLeadsMenu onCsvUpload={open} onManualInput={openManual} />
        </Flex>

        <Box className="ag-theme-alpine lead-grid-container" h={500} my="md">
          <AgGridReact<Lead>
            ref={gridRef} // Ref for accessing Grid's API
            // @ts-ignore
            rowData={data} // Row Data for Rows
            columnDefs={colDefs} // Column Defs for Columns
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection="multiple" // Options - allows click selection of rows
          />
        </Box>

        <Text color="red">
          {leadsApiError && "status" in leadsApiError
            ? leadsApiError.status
            : ""}
        </Text>

        <UploadLeadsViaCsvModal opened={opened} close={close} />
        <ManualInputLeadModal opened={openedManual} close={closeManual} />
      </Container>
    </LeadsStyled>
  );
}

export default Leads;
