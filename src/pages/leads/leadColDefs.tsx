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
    width: 120,
    cellRenderer: "tableActionCell", // name comes from `components` memoized object which gets passed to AG Grid `components` parameter
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
    headerName: "Name",
    sortable: true,
    resizable: true,
    filter: "agTextColumnFilter",
    valueGetter: (params) => {
      let val = "";

      const { data } = params;

      if (!data) return val;

      const { first_name, last_name } = data;

      val = first_name || "";

      // Handle dynamic space between first and last name
      if (first_name) {
        val += " ";
      }

      val += last_name || "";

      return val;
    },
  },
  {
    field: "phone",
    sortable: true,
    resizable: true,
    filter: true,
    cellRenderer: (param: any) => phoneFormatter(param.value),
  },
  {
    field: "call_count",
    headerName: "Call count",
    width: 120,
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "appointment_at",
    headerName: "Appointment at",
    resizable: true,
    sortable: true,
    filter: "agDateColumnFilter",
    valueFormatter: ({ value }) => {
      return value ? format(new Date(value), "Pp") : "";
    },
  },
  {
    field: "source",
    headerName: "Source",
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
    field: "do_not_call",
    headerName: "Do not call (DNC)",
    resizable: true,
    sortable: true,
    filter: true,
  },
  {
    field: "created_at",
    headerName: "Created at",
    resizable: true,
    sortable: true,
    sort: "desc",
    filter: "agDateColumnFilter",
    valueFormatter: (param) => format(new Date(param.value), "Pp"),
  },
];
