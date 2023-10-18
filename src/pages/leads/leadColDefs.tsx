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
    filter: true,
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
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    field: "last_name",
    headerName: "Last name",
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    field: "phone",
    filter: true,
    sortable: true,
    resizable: true,
    cellRenderer: (param: any) => phoneFormatter(param.value),
  },
  { field: "email", filter: true, resizable: true, sortable: true },
  {
    field: "source",
    filter: true,
    headerName: "Lead vendor",
    resizable: true,
    sortable: true,
  },
  {
    field: "created_at",
    headerName: "Created at",
    filter: true,
    resizable: true,
    sortable: true,
    valueFormatter: (param) => format(new Date(param.value), "Pp"),
  },
];
