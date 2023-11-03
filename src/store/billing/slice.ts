import { createSlice } from "@reduxjs/toolkit";

function billingHistoryData() {
  const billingData = [];
  let newPage = [];
  for (let i = 0; i < 45; i++) {
    newPage.push({
      date: "July 25, 2023",
      description: "Payment (Visa)",
      amount: i,
      pdf: "Download: PDF",
    });
    if (newPage.length === 10) {
      billingData.push(newPage);
      newPage = [];
    }
  }
  if (newPage.length > 0) {
    billingData.push(newPage);
  }
  return billingData;
}

export type BillingDate = {
  date: string;
  description: string;
  amount: number;
  pdf: string;
};
const billingData = billingHistoryData();

export type TBillingState = {
  maxLimit: number;
  currentMinutes: number;
  currentBalance: number;
  billingData: BillingDate[][];
};
const initialState: TBillingState = {
  maxLimit: 2000,
  currentMinutes: 350,
  currentBalance: 26.11,
  billingData: billingData,
};

export const BillingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {},
});

export default BillingSlice.reducer;
