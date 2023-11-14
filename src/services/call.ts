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

export const callApi = createApi({
  reducerPath: "callApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Call", "Lead"],
  endpoints: (builder) => ({
    getCalls: builder.query<Call[], void>({
      query: () => "call",
      providesTags: ["Call"],
    }),
    addCall: builder.mutation<Call, Partial<Call>>({
      query(call) {
        return {
          url: `call`,
          method: "POST",
          body: call,
        };
      },
      invalidatesTags: ["Call", "Lead"],
    }),
    updateCallViaTwilioCallSid: builder.mutation<Call, Partial<Call>>({
      query(call) {
        return {
          url: `call/twilio-call-sid/${call.twilio_call_sid}`,
          method: "PUT",
          body: call,
        };
      },
      invalidatesTags: ["Call", "Lead"],
    }),
    updateCallViaId: builder.mutation<Call, Partial<Call>>({
      query(call) {
        return {
          url: `call/${call.id}`,
          method: "PUT",
          body: call,
        };
      },
      invalidatesTags: ["Call", "Lead"],
    }),
    endCall: builder.mutation<Call, number>({
      query(id) {
        return {
          url: `call/${id}/end`,
          method: "GET",
        };
      },
      invalidatesTags: ["Call", "Lead"],
    }),
    deleteCall: builder.mutation<Call, number>({
      query(id) {
        return {
          url: `call/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Call"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddCallMutation,
  useUpdateCallViaTwilioCallSidMutation,
  useUpdateCallViaIdMutation,
  useGetCallsQuery,
  useEndCallMutation,
  useDeleteCallMutation,
} = callApi;
