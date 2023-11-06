import { SelectItem } from "@mantine/core";
export const addNewPropertySelectItem: SelectItem = {
  value: "-1",
  label: "+ Add new property",
  group: "Options",
};
export type HeaderObject = {
  columnHeader: string;
  preview: string[];
  mapped: boolean;
  property: any;
  excludeHeader: boolean;
};
export const dummyProperties: SelectItem[] = [
  {
    value: "email",
    label: "Email",
    disabled: false,
    group: "Contact",
  },
  {
    value: "first_name",
    label: "First_Name",
    disabled: false,
    group: "Contact",
  },
  {
    value: "last_name",
    label: "Last_Name",
    disabled: false,
    group: "Contact",
  },
  {
    value: "address",
    label: "Address",
    disabled: false,
    group: "Address",
  },
  {
    value: "phone",
    label: "Phone",
    disabled: false,
    group: "Contact",
  },
  { value: "city", label: "City", disabled: false, group: "Address" },
  {
    value: "state",
    label: "State",
    disabled: false,
    group: "Address",
  },
  { value: "zip", label: "Zip", disabled: false, group: "Address" },
  {
    value: "notes",
    label: "Notes",
    disabled: false,
    group: "Other",
  },
  {
    value: "status",
    label: "Status",
    disabled: false,
    group: "Other",
  },
  addNewPropertySelectItem,
];
