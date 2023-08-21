import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type CallerId = {
  id: number;
  twilio_sid: string;
  phone_number: string;
};

const apiBaseUrl = import.meta.env.VITE_API_HOST;

// Define a service using a base URL and expected endpoints
export const callerIdApi = createApi({
  reducerPath: "callerIdApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        headers.set("authorization", `Bearer ${jwt}`);
      }
    },
  }),
  tagTypes: ["CallerId"],
  endpoints: (builder) => ({
    getCallerIds: builder.query<CallerId[], void>({
      query: () => "caller-id",
      providesTags: ["CallerId"],
    }),
    addCallerId: builder.mutation<CallerId, string>({
      query(phoneNumber) {
        return {
          url: `caller-id`,
          method: "POST",
          body: {
            phone_number: phoneNumber,
          },
        };
      },
      invalidatesTags: ["CallerId"],
    }),
    deleteCallerId: builder.mutation<void, { id: number; twilio_sid: string }>({
      query(body) {
        return {
          url: "caller-id/delete",
          method: "POST",
          body: {
            id: body.id,
            twilio_sid: body.twilio_sid,
          },
        };
      },
      invalidatesTags: ["CallerId"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddCallerIdMutation,
  useGetCallerIdsQuery,
  useLazyGetCallerIdsQuery,
  useDeleteCallerIdMutation,
} = callerIdApi;