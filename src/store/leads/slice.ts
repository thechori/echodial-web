import { createSlice } from "@reduxjs/toolkit";
//
import { Lead } from "../../types";

export type TFilterTag =
  | "call"
  | "not-called"
  | "sold"
  | "not-sold"
  | "created-today";

export type TLeadsState = {
  keyword: string;
  filteredRows: Lead[];
  filterTags: TFilterTag[];
  selectedRows: Lead[];
};

const initialState: TLeadsState = {
  keyword: "",
  filteredRows: [],
  filterTags: [],
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
    setFilterTags: (state, action) => {
      state.filterTags = action.payload;
    },
  },
});

export const { setKeyword, setFilterTags, setFilteredRows, setSelectedRows } =
  LeadsSlice.actions;

export default LeadsSlice.reducer;
