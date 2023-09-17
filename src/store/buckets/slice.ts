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
      leads: [
        {
          id: 0,
          first_name: "Alvin",
          last_name: "Chip",
          email: "a@gmail.com",
          phone: "+18326460869",
          address1: "",
          address2: "",
          city: "houston",
          state: "tx",
          zip: "77079",
          source: null,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: 1,
          call_count: 0,
          sale_amount: null,
          sale_commission: null,
          sale_cost: null,
          sale_notes: null,
          sale_at: null,
          notes: null,
        },
        {
          id: 1,
          first_name: "Bob",
          last_name: "Daniel",
          email: "bd@gmail.com",
          phone: "+18326460860",
          address1: "",
          address2: "",
          city: "houston",
          state: "tx",
          zip: "77079",
          source: null,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: 1,
          call_count: 0,
          sale_amount: null,
          sale_commission: null,
          sale_cost: null,
          sale_notes: null,
          sale_at: null,
          notes: null,
        },
        {
          id: 2,
          first_name: "Jenny",
          last_name: "Chu",
          email: "jc@gmail.com",
          phone: "+18326460891",
          address1: "",
          address2: "",
          city: "houston",
          state: "tx",
          zip: "77079",
          source: null,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: 1,
          call_count: 0,
          sale_amount: null,
          sale_commission: null,
          sale_cost: null,
          sale_notes: null,
          sale_at: null,
          notes: null,
        },
      ],
    },
    {
      id: "hfg89h7fg89h7f897fsd89f7s",
      name: "Missed calls",
      description: "People that were called but did not answer",
      leads: [
        {
          id: 5,
          first_name: "Dough",
          last_name: "Craig",
          email: "dc@gmail.com",
          phone: "+18326460892",
          address1: "",
          address2: "",
          city: "houston",
          state: "tx",
          zip: "77079",
          source: null,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: 1,
          call_count: 0,
          sale_amount: null,
          sale_commission: null,
          sale_cost: null,
          sale_notes: null,
          sale_at: null,
          notes: null,
        },
      ],
    },
    {
      id: "scv8b7c8n689dsg89dug89d",
      name: "Appointments",
      description:
        "Leads that have have a scheduled appointment (see Excel doc named 'Lead Appointments')",
      leads: [],
    },
    {
      id: "scv8bas9d8a9s7c8n689dsg89dug89d",
      name: "Not interested",
      description: "Dead ends",
      leads: [],
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
