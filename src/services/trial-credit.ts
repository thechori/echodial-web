import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//
import { TrialCredit } from "../types";
import { LOCAL_STORAGE_JWT } from "../configs/local-storage";

const apiBaseUrl = import.meta.env.VITE_API_HOST;

export const trialCreditApi = createApi({
  reducerPath: "trialCreditApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem(LOCAL_STORAGE_JWT);
      if (jwt) {
        headers.set("authorization", `Bearer ${jwt}`);
      }
    },
  }),
  tagTypes: ["TrialCredit"],
  endpoints: (builder) => ({
    getTrialCredits: builder.query<TrialCredit, void>({
      query: () => "/trial-credit",
      providesTags: ["TrialCredit"],
    }),
    deductTrialCredit: builder.mutation<TrialCredit, number>({
      query(number) {
        return {
          url: "/trial-credit/deduct",
          method: "POST",
          body: {
            amount: number,
          },
        };
      },
      invalidatesTags: ["TrialCredit"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTrialCreditsQuery, useDeductTrialCreditMutation } =
  trialCreditApi;
