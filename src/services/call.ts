import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//
import { Call } from "../types";
import { LOCAL_STORAGE_JWT } from "../configs/local-storage";

const apiBaseUrl = import.meta.env.VITE_API_HOST;

// Define a service using a base URL and expected endpoints
export const callApi = createApi({
  reducerPath: "callApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem(LOCAL_STORAGE_JWT);
      if (jwt) {
        headers.set("authorization", `Bearer ${jwt}`);
      }
    },
  }),

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
