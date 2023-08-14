import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type TCall = {
  id: number;
  user_id: number;
  lead_id: number;
  duration_ms: number | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  from_number: string;
  to_number: string;
  was_answered: boolean;
  status: string | null;
};

const apiBaseUrl = import.meta.env.VITE_API_HOST;

// Define a service using a base URL and expected endpoints
export const callApi = createApi({
  reducerPath: "callApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        headers.set("authorization", `Bearer ${jwt}`);
      }
    },
  }),
  tagTypes: ["Call"],
  endpoints: (builder) => ({
    getCalls: builder.query<TCall[], void>({
      query: () => "call",
      providesTags: ["Call"],
    }),
    addCall: builder.mutation<TCall, Partial<TCall>>({
      query(call) {
        return {
          url: `call`,
          method: "POST",
          body: call,
        };
      },
      invalidatesTags: ["Call"],
    }),
    updateCall: builder.mutation<TCall, Partial<TCall>>({
      query(call) {
        return {
          url: `call/${call.id}`,
          method: "PUT",
          body: call,
        };
      },
      invalidatesTags: ["Call"],
    }),
    deleteCall: builder.mutation<void, number>({
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
export const { useAddCallMutation, useGetCallsQuery, useDeleteCallMutation } =
  callApi;
