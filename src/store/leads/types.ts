import { Lead } from "../../types";

export type TFilterType = "boolean" | "number" | "string";

export type TFilter = {
  type: TFilterType;
  value: boolean | number | string;
  label: string;
  fn: (lead: Lead) => boolean;
};

export type TLeadOptions = {
  hideDoNotCallLeads: boolean;
  hideSoldLeads: boolean;
  hideClosedLeads: boolean;
  hideArchivedLeads: boolean;
};

export type TLeadsState = {
  keyword: string;
  filteredRows: Lead[];
  appliedFilters: TFilter[];
  selectedRows: Lead[];
  //
  options: TLeadOptions;
};

export const LOCAL_STORAGE_KEY__LEADS_OPTIONS = "leads__options";
