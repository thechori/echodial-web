import { createSlice } from "@reduxjs/toolkit";
//
import type { RootState } from "../";

export type TMetricState = {
  resolution: "day" | "week" | "month";
};

const initialState: TMetricState = {
  resolution: "day",
};

export const MetricSlice = createSlice({
  name: "metric",
  initialState,
  reducers: {
    setMetricResolution: (state, action) => {
      state.resolution = action.payload;
    },
  },
});

export const { setMetricResolution } = MetricSlice.actions;

export const selectMetricResolution = (state: RootState) =>
  state.metric.resolution;

export default MetricSlice.reducer;
