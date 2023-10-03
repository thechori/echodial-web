import { createSlice } from "@reduxjs/toolkit";

export type TBillingState = {
    maxLimit: number,
    currentMinutes: number,
    currentBalance: number,
};
const initialState: TBillingState = {
    maxLimit: 2000,
    currentMinutes: 350,
    currentBalance: 26.11
  };
export const BillingSlice = createSlice({
    name: "metric",
    initialState,
    reducers: {
      
    },
  });


export default BillingSlice.reducer;