import { SelectItem } from "@mantine/core";
import {
  useGetLeadStandardPropertiesQuery,
  useGetLeadCustomPropertiesQuery,
  useGetLeadPropertyGroupQuery,
} from "../../services/lead";

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

export function useRenderProperties(): SelectItem[] {
  const properties: SelectItem[] = [];
  //Standard Properties
  const { data: standardProperties, error: standardPropertiesError } =
    useGetLeadStandardPropertiesQuery();

  //Custom Properties
  const { data: customProperties, error: customPropertiesError } =
    useGetLeadCustomPropertiesQuery();

  //Property Groups
  const { data: propertyGroups, error: propertyGroupsError } =
    useGetLeadPropertyGroupQuery();

  if (standardPropertiesError) {
    throw standardPropertiesError;
  } else if (customPropertiesError) {
    throw customPropertiesError;
  } else if (propertyGroupsError) {
    throw propertyGroupsError;
  }
  if (propertyGroups && standardProperties) {
    const groupIdToGroupName: any = {};
    propertyGroups.forEach((item) => {
      groupIdToGroupName[item.id] = item.label;
    });
    for (const standardProperty of standardProperties) {
      properties.push({
        value: standardProperty.name,
        label: standardProperty.label,
        disabled: false,
        group: groupIdToGroupName[standardProperty.lead_property_group_id],
      });
    }
    if (customProperties && customProperties.length > 0) {
      for (const customProperty of customProperties) {
        properties.push({
          value: customProperty.name,
          label: customProperty.label,
          disabled: false,
          group: groupIdToGroupName[customProperty.lead_property_group_id],
        });
      }
    }
  }
  properties.push(addNewPropertySelectItem);
  return properties;
}
