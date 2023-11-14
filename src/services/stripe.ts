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
  subscription: Stripe.Subscription;
  product: Stripe.Product;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(setJwt(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
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
