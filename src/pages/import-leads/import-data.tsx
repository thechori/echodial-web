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
