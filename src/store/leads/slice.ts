import { createSlice } from "@reduxjs/toolkit";
//
import {
  LOCAL_STORAGE_KEY__LEADS_OPTIONS,
  TLeadOptions,
  TLeadsState,
} from "./types";

const buildOptions = (): TLeadOptions => {
  // Check for local storage
  const cachedOptions = localStorage.getItem(LOCAL_STORAGE_KEY__LEADS_OPTIONS);

  if (cachedOptions) {
    return JSON.parse(cachedOptions);
  }

  return {
    hideDoNotCallLeads: true,
    hideSoldLeads: true,
    hideClosedLeads: true,
    hideArchivedLeads: true,
  };
};

const buildInitialState = (): TLeadsState => ({
  keyword: "",
  filteredRows: [],
  appliedFilters: [],
  selectedRows: [],
  //
  options: buildOptions(),
});

export const LeadsSlice = createSlice({
  name: "leads",
  initialState: buildInitialState(),
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
    setAppliedFilters: (state, action) => {
      state.appliedFilters = action.payload;
    },
    setOptions: (state, action) => {
      state.options = action.payload;
      console.log(action.payload);

      // Persist in local storage
      localStorage.setItem(
        LOCAL_STORAGE_KEY__LEADS_OPTIONS,
        JSON.stringify(action.payload)
      );
    },
  },
});

// const selectFilteredLeads = createSelector()

export const {
  setKeyword,
  setAppliedFilters,
  setFilteredRows,
  setSelectedRows,
  setOptions,
} = LeadsSlice.actions;

export default LeadsSlice.reducer;
