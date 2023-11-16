import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
//
import { LeadStatus } from "../types";
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
