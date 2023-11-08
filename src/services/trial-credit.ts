import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//
import { TrialCredit } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_HOST;

export const trialCreditApi = createApi({
  reducerPath: "trialCreditApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("jwt");
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
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTrialCreditsQuery } = trialCreditApi;
