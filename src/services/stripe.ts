import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type TTrialDetails = {
  status: string;
  trial_start: number;
  trial_end: number;
};

const apiBaseUrl = import.meta.env.VITE_API_HOST;

export const stripeApi = createApi({
  reducerPath: "stripeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        headers.set("authorization", `Bearer ${jwt}`);
      }
    },
  }),
  tagTypes: ["Trial"],
  endpoints: (builder) => ({
    getStripeTrialDetails: builder.query<TTrialDetails, void>({
      query: () => "/stripe/trial-status",
      providesTags: ["Trial"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetStripeTrialDetailsQuery } = stripeApi;
