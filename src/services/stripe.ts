import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Stripe from "stripe";
import { LOCAL_STORAGE_JWT } from "../configs/local-storage";

const apiBaseUrl = import.meta.env.VITE_API_HOST;

type TSubscriptionStatus = {
  description: string | null;
  status: Stripe.Subscription.Status | null;
  items: Stripe.ApiList<Stripe.SubscriptionItem> | null;
};

export const stripeApi = createApi({
  reducerPath: "stripeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem(LOCAL_STORAGE_JWT);
      if (jwt) {
        headers.set("authorization", `Bearer ${jwt}`);
      }
    },
  }),
  tagTypes: ["SubscriptionStatus"],
  endpoints: (builder) => ({
    getSubscriptionStatus: builder.query<TSubscriptionStatus, void>({
      query: () => "/stripe/subscription-status",
      providesTags: ["SubscriptionStatus"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSubscriptionStatusQuery } = stripeApi;
