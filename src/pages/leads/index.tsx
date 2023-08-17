import { useRef, useEffect, useCallback, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { ColDef } from "ag-grid-community";
import { Box, Container, Flex, Text, Title } from "@mantine/core";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { format } from "date-fns";
//
import LeadsStyled from "./Leads.styles";
import UploadLeadsViaCsvModal from "./UploadLeadsViaCsvModal";
import NewLeadsMenu from "./NewLeadsMenu";
import ManualInputLeadModal from "./ManualInputLeadModal";
import phoneFormatter from "../../utils/phone-formatter";
import { TLead, useGetLeadsQuery } from "../../services/lead";
import EditLeadSelectionMenu from "./EditLeadSelectionMenu";
import DeleteLeadConfirmationModal from "./DeleteLeadConfirmationModal";
import EditLeadModal from "./EditLeadModal";
import { extractErrorMessage } from "../../utils/error";

const colDefs: ColDef<TLead>[] = [
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

function Leads() {
  const [error, setError] = useState("");
  const { data: leads, error: leadsApiError, isLoading } = useGetLeadsQuery();
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
  const gridRef = useRef<AgGridReact<TLead>>(null); // Optional - for accessing Grid's API

  useEffect(() => {
    if (isLoading) {
      gridRef.current?.api?.showLoadingOverlay();
    } else {
      gridRef.current?.api?.hideOverlay();
    }
  }, [isLoading]);

  useEffect(() => {
    if (leadsApiError) {
      setError(extractErrorMessage(leadsApiError));
    } else {
      setError("");
    }
  }, [leadsApiError]);

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
      <Container fluid size="xl" py="md">
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
          <AgGridReact<TLead>
            ref={gridRef}
            rowData={leads}
            columnDefs={colDefs}
            animateRows={true}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
          />
        </Box>

        <Text color="red">{error}</Text>

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
