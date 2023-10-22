import { createSlice } from "@reduxjs/toolkit";
//
import type { RootState } from "..";
import { TBucketsState } from "./types";

const initialState: TBucketsState = {
  buckets: [],
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
