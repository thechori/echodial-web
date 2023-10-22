import { ColDef } from "ag-grid-community";
import { PiPhoneFill } from "react-icons/pi";
import { format } from "date-fns";
//
import { Lead } from "../../types";
import { capitalizeFirstLetter } from "../../utils/string-formatters";
import phoneFormatter from "../../utils/phone-formatter";
import { Button } from "@mantine/core";

export const leadColDefs: ColDef<Lead>[] = [
  {
    width: 10,
    sortable: true,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true,
    headerCheckboxSelectionFilteredOnly: true,
  },
  {
    colId: "actions",
    width: 100,
    cellRenderer: () => {
      return (
        <div>
          <Button variant="outline" size="xs" leftIcon={<PiPhoneFill />}>
            Call
          </Button>
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    sortable: true,
    resizable: true,
    width: 120,
    valueFormatter: (val) => capitalizeFirstLetter(val.value),
  },
  {
    field: "first_name",
    headerName: "First name",
    sortable: true,
    resizable: true,
  },
  {
    field: "last_name",
    headerName: "Last name",
    sortable: true,
    resizable: true,
  },
  {
    field: "phone",
    sortable: true,
    resizable: true,
    cellRenderer: (param: any) => phoneFormatter(param.value),
  },
  // { field: "email", filter: true, resizable: true, sortable: true },
  {
    field: "source",
    headerName: "Lead vendor",
    resizable: true,
    sortable: true,
  },
  {
    field: "do_not_call",
    headerName: "Do not call (DNC)",
    resizable: true,
    sortable: true,
  },
  {
    field: "appointment_at",
    headerName: "Appointment at",
    resizable: true,
    sortable: true,
    valueFormatter: ({ value }) => {
      return value ? format(new Date(value), "Pp") : "N/A";
    },
  },
  {
    field: "not_interested_reason",
    headerName: "Not interested reason",
    resizable: true,
    sortable: true,
  },
  {
    field: "call_count",
    headerName: "Call count",
    resizable: true,
    sortable: true,
  },
  {
    field: "address1",
    headerName: "Address",
    resizable: true,
    sortable: true,
  },
  {
    field: "city",
    headerName: "City",
    resizable: true,
    sortable: true,
  },
  {
    field: "state",
    headerName: "State",
    resizable: true,
    sortable: true,
  },
  {
    field: "zip",
    headerName: "Zip",
    resizable: true,
    sortable: true,
  },
  {
    field: "created_at",
    headerName: "Created at",
    resizable: true,
    sortable: true,
    valueFormatter: (param) => format(new Date(param.value), "Pp"),
  },
];
