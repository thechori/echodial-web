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
    hideNoPhoneLeads: true,
    hideDoNotCallLeads: true,
    hideSoldLeads: true,
    hideClosedLeads: true,
    hideArchivedLeads: true,
  };
};

const buildInitialState = (): TLeadsState => ({
  keyword: "",
  gridRef: null,
  filteredRows: [],
  appliedFilters: [],
  selectedRows: [],
  shouldImportLeadsModalOpen: false,
  shouldManualCreateLeadModalOpen: false,
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

      // Persist in local storage
      localStorage.setItem(
        LOCAL_STORAGE_KEY__LEADS_OPTIONS,
        JSON.stringify(action.payload)
      );
    },
    setRequestForImportLeadsModal: (state, action) => {
      state.shouldImportLeadsModalOpen = action.payload;
    },
    setRequestForManualCreateLeadsModal: (state, action) => {
      state.shouldManualCreateLeadModalOpen = action.payload;
    },
    setGridRef: (state, action) => {
      state.gridRef = action.payload;
    },
  },
});

export const {
  setKeyword,
  setAppliedFilters,
  setFilteredRows,
  setSelectedRows,
  setRequestForImportLeadsModal,
  setRequestForManualCreateLeadsModal,
  setOptions,
  setGridRef,
} = LeadsSlice.actions;

export default LeadsSlice.reducer;
