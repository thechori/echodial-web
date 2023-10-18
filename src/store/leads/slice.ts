import { createSlice } from "@reduxjs/toolkit";
//
import { Lead } from "../../types";

export const availableFilters: TFilter[] = [
  {
    value: "hasAppointment",
    label: "Has appointment",
    type: "boolean",
    fn: (lead) => {
      if (lead.appointment_at) {
        return true;
      }
      return false;
    },
  },
  {
    value: "hasBeenCalled",
    label: "Has been called",
    type: "boolean",
    fn: (lead) => {
      if (lead.call_count > 0) {
        return true;
      }
      return false;
    },
  },
];

type TFilterType = "boolean" | "number" | "string";
type TFilter = {
  type: TFilterType;
  value: boolean | number | string;
  label: string;
  fn: (lead: Lead) => boolean;
};

export type TLeadsState = {
  keyword: string;
  filteredRows: Lead[];
  filters: TFilter[];
  selectedRows: Lead[];
};

const initialState: TLeadsState = {
  keyword: "",
  filteredRows: [],
  filters: [],
  selectedRows: [],
};

export const LeadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setFilteredRows: (state, action) => {
      state.filteredRows = action.payload;
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
    setAdvancedFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

// const selectFilteredLeads = createSelector()

export const {
  setKeyword,
  setAdvancedFilters,
  setFilteredRows,
  setSelectedRows,
} = LeadsSlice.actions;

export default LeadsSlice.reducer;
