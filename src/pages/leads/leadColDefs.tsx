import { ColDef } from "ag-grid-community";
import { format } from "date-fns";
//
import { Lead } from "../../types";
import { capitalizeFirstLetter } from "../../utils/string-formatters";
import phoneFormatter from "../../utils/phone-formatter";

export const leadColDefs: ColDef<Lead>[] = [
  {
    width: 50,
    sortable: true,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true,
    headerCheckboxSelectionFilteredOnly: true,
  },

  {
    field: "status",
    headerName: "Status",
    sortable: true,
    resizable: true,
    filter: true,
    width: 120,
    valueFormatter: (val) => capitalizeFirstLetter(val.value),
  },
  {
    field: "first_name",
    headerName: "First name",
    sortable: true,
    resizable: true,
    filter: true,
  },
  {
    field: "last_name",
    headerName: "Last name",
    sortable: true,
    resizable: true,
    filter: true,
  },
  {
    field: "phone",
    sortable: true,
    resizable: true,
    filter: true,
    cellRenderer: (param: any) => phoneFormatter(param.value),
  },
  // { field: "email", filter: true, resizable: true, sortable: true },
  {
    field: "source",
    headerName: "Lead vendor",
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "do_not_call",
    headerName: "Do not call (DNC)",
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "appointment_at",
    headerName: "Appointment at",
    resizable: true,
    sortable: true,
    filter: true,
    valueFormatter: ({ value }) => {
      return value ? format(new Date(value), "Pp") : "";
    },
  },
  {
    field: "not_interested_reason",
    headerName: "Not interested reason",
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "call_count",
    headerName: "Call count",
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "address1",
    headerName: "Address",
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "city",
    headerName: "City",
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "state",
    headerName: "State",
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "zip",
    headerName: "Zip",
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "created_at",
    headerName: "Created at",
    resizable: true,
    sortable: true,
    filter: true,
    valueFormatter: (param) => format(new Date(param.value), "Pp"),
  },
];
