import { createSlice } from "@reduxjs/toolkit";

export type TLeadDetailState = {
  isOpen: boolean;
};

const initialState: TLeadDetailState = {
  isOpen: false,
};

export const MetricSlice = createSlice({
  name: "metric",
  initialState,
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setIsOpen } = MetricSlice.actions;

export default MetricSlice.reducer;
