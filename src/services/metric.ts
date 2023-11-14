import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
//
import { Call } from "../types";
import { setJwt, signOut } from "../store/user/slice";
import { baseQuery } from "./helpers/base-query";

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

export const metricApi = createApi({
  reducerPath: "metricApi",
  baseQuery: baseQueryWithReauth,
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
