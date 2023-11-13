import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
//
import { Call } from "../types";
import { LOCAL_STORAGE_JWT } from "../configs/local-storage";
import { setJwt, signOut } from "../store/user/slice";

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

const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    const jwt = localStorage.getItem(LOCAL_STORAGE_JWT);
    if (jwt) {
      headers.set("authorization", `Bearer ${jwt}`);
    }
  },
});

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
