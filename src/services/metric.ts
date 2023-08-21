import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//
import { Call } from "../types";

export type TMetricResolution = "day" | "week" | "month";

export type TMetrics = {
  leadsCreatedCountPreviousPeriod: number | null;
  leadsCreatedCountCurrentPeriod: number | null;
  callsMadePreviousPeriod: Call[];
  callsMadeCurrentPeriod: Call[];
  callsAnsweredCountPreviousPeriod: number | null;
  callsAnsweredCountCurrentPeriod: number | null;
  averageCallDurationInSecondsPreviousPeriod: number | null;
  averageCallDurationInSecondsCurrentPeriod: number | null;
};

const apiBaseUrl = import.meta.env.VITE_API_HOST;

// Define a service using a base URL and expected endpoints
export const metricApi = createApi({
  reducerPath: "metricApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        headers.set("authorization", `Bearer ${jwt}`);
      }
    },
  }),
  tagTypes: ["Metric"],
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<TMetrics, TMetricResolution>({
      query: (resolution) => `metric/dashboard/${resolution}`,
      providesTags: ["Metric"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetDashboardMetricsQuery } = metricApi;
