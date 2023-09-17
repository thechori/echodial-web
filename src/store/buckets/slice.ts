import { createSlice } from "@reduxjs/toolkit";
//
import type { RootState } from "..";
import { TBucketsState } from "./types";

const initialState: TBucketsState = {
  buckets: [
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

export const BucketsSlice = createSlice({
  name: "buckets",
  initialState,
  reducers: {
    setBuckets: (state, action) => {
      state.buckets = action.payload;
    },
  },
});

export const { setBuckets } = BucketsSlice.actions;

export const selectBuckets = (state: RootState) => state.buckets.buckets;

export default BucketsSlice.reducer;
