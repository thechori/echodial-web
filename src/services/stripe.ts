import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
import Stripe from "stripe";
import { setJwt, signOut } from "../store/user/slice";
import { baseQuery } from "./helpers/base-query";

type TSubscriptionStatus = {
  description: string | null;
  status: Stripe.Subscription.Status | null;
  items: Stripe.ApiList<Stripe.SubscriptionItem> | null;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // store the new token in the store or wherever you keep it
      api.dispatch(setJwt(refreshResult.data));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // refresh failed - do something like redirect to login or show a "retry" button
      api.dispatch(signOut());
    }
  }
  return result;
};

export const stripeApi = createApi({
  reducerPath: "stripeApi",
  baseQuery: baseQueryWithReauth,
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
