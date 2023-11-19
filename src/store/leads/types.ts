import { Lead } from "../../types";

export type TFilterType = "boolean" | "number" | "string";

export type TFilter = {
  type: TFilterType;
  value: string;
  label: string;
  fn: (lead: Lead) => boolean;
};

export type TLeadOptions = {
  hideNoPhoneLeads: boolean;
  hideDoNotCallLeads: boolean;
  hideSoldLeads: boolean;
  hideClosedLeads: boolean;
  hideArchivedLeads: boolean;
};

export type TLeadsState = {
  gridRef: any;
  keyword: string;
  filteredRows: Lead[];
  appliedFilters: TFilter[];
  selectedRows: Lead[];
  shouldImportLeadsModalOpen: boolean;
  shouldManualCreateLeadModalOpen: boolean;
  //
  options: TLeadOptions;
};

export const LOCAL_STORAGE_KEY__LEADS_OPTIONS = "leads__options";
