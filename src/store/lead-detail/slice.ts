import { createSlice } from "@reduxjs/toolkit";
//
import { Lead } from "../../types";

export type TLeadDetailState = {
  isOpen: boolean;
  selectedLead: Lead | null;
};

const initialState: TLeadDetailState = {
  isOpen: false,
  selectedLead: null,
};

export const LeadDetailSlice = createSlice({
  name: "metric",
  initialState,
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
  },
});

export const { setIsOpen, setSelectedLead } = LeadDetailSlice.actions;

export default LeadDetailSlice.reducer;
