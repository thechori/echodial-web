import { useRef, useEffect, useCallback, useState } from "react";
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
import EditLeadSelectionMenu from "./EditLeadSelectionMenu";
import DeleteLeadConfirmationModal from "./DeleteLeadConfirmationModal";
import EditLeadModal from "./EditLeadModal";

const colDefs: ColDef<Lead>[] = [
  {
    filter: true,
    width: 10,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true,
    headerCheckboxSelectionFilteredOnly: true,
  },
  { field: "first_name", headerName: "First name", filter: true },
  { field: "last_name", headerName: "Last name", filter: true },
  {
    field: "phone",
    filter: true,
    cellRenderer: (param: any) => phoneFormatter(param.value),
  },
  { field: "email", filter: true },
  { field: "source", filter: true },
  { field: "created_at", headerName: "Created at", filter: true },
];

function Leads() {
  const { data: leads } = useGetLeadsQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [openedManual, { open: openManual, close: closeManual }] =
    useDisclosure(false);
  const [
    openedDeleteConfirmationModal,
    { open: openDeleteConfirmationModal, close: closeDeleteConfirmationModal },
  ] = useDisclosure(false);
  const [openedEditModal, { open: openEditModal, close: closeEditModal }] =
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

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef?.current?.api.getSelectedRows();
    setSelectedRows(selectedRows);
  }, []);

  function deleteLeads() {
    openDeleteConfirmationModal();
  }

  function editLead() {
    openEditModal();
  }

  // Reset selection every time leads changes
  useEffect(() => {
    setSelectedRows([]);
  }, [leads]);

  return (
    <LeadsStyled>
      <Container fluid py="xl">
        <Flex align="center" justify="space-between">
          <Title order={2}>Leads</Title>
          <Flex>
            <EditLeadSelectionMenu
              rowsSelected={selectedRows}
              onDelete={deleteLeads}
              onEdit={editLead}
            />
            <NewLeadsMenu onCsvUpload={open} onManualInput={openManual} />
          </Flex>
        </Flex>

        <Box className="ag-theme-alpine lead-grid-container" h={500} my="md">
          <AgGridReact<Lead>
            ref={gridRef} // Ref for accessing Grid's API
            // @ts-ignore
            rowData={data} // Row Data for Rows
            columnDefs={colDefs} // Column Defs for Columns
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection="multiple" // Options - allows click selection of rows
            onSelectionChanged={onSelectionChanged}
          />
        </Box>

        <Text color="red">
          {leadsApiError && "status" in leadsApiError
            ? leadsApiError.status
            : ""}
        </Text>

        <UploadLeadsViaCsvModal opened={opened} close={close} />
        <ManualInputLeadModal opened={openedManual} close={closeManual} />
        <DeleteLeadConfirmationModal
          rowsSelected={selectedRows}
          opened={openedDeleteConfirmationModal}
          close={closeDeleteConfirmationModal}
        />
        <EditLeadModal
          rowSelected={selectedRows[0]}
          opened={openedEditModal}
          close={closeEditModal}
        />
      </Container>
    </LeadsStyled>
  );
}

export default Leads;
