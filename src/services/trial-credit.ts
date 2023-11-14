import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
//
import { TrialCredit } from "../types";
import { setJwt, signOut } from "../store/user/slice";
import { baseQuery } from "./helpers/base-query";

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

export const trialCreditApi = createApi({
  reducerPath: "trialCreditApi",
  baseQuery: baseQueryWithReauth,
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
