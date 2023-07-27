import { createSlice } from "@reduxjs/toolkit";
//
import type { RootState } from "../";
import { TPhaseState } from "./types";

const initialState: TPhaseState = {
  phases: [
    {
      id: "sdfsdg67sg2837678268fd8fs",
      name: "Fresh Leads",
      description: "Brand new leads that have never been dialed",
    },
    {
      id: "hfg89h7fg89h7f897fsd89f7s",
      name: "Round 2",
      description: "Leads that have never been dialed",
    },
    {
      id: "scv8b7c8n689dsg89dug89d",
      name: "Appointments",
      description:
        "Leads that have have a scheduled appointment (see Excel doc named 'Lead Appointments')",
    },
  ],
};

export const PhaseSlice = createSlice({
  name: "phase",
  initialState,
  reducers: {
    setPhases: (state, action) => {
      state.phases = action.payload;
    },
  },
});

export const { setPhases } = PhaseSlice.actions;

export const selectPhases = (state: RootState) => state.phase.phases;

export default PhaseSlice.reducer;
