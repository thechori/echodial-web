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
  name: "leadDetail",
  initialState,
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setSelectedLead: (state, action) => {
      console.log("setSelectedLead", action.payload);
      state.selectedLead = action.payload;
    },
  },
});

export const { setIsOpen, setSelectedLead } = LeadDetailSlice.actions;

export default LeadDetailSlice.reducer;
