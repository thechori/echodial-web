import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
//
import { LeadStatus } from "../types";
import { LOCAL_STORAGE_JWT } from "../configs/local-storage";
import { setJwt, signOut } from "../store/user/slice";

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

export const leadStatusApi = createApi({
  reducerPath: "leadStatusApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["LeadStatus"],
  endpoints: (builder) => ({
    getLeadStatuses: builder.query<LeadStatus[], void>({
      query: () => "lead/status",
      providesTags: ["LeadStatus"],
    }),
  }),
});

export const { useGetLeadStatusesQuery } = leadStatusApi;
