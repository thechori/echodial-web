import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//
import { LeadStatus } from "../types";
import { LOCAL_STORAGE_JWT } from "../configs/local-storage";

const apiBaseUrl = import.meta.env.VITE_API_HOST;

// Define a service using a base URL and expected endpoints
export const leadStatusApi = createApi({
  reducerPath: "leadStatusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem(LOCAL_STORAGE_JWT);
      if (jwt) {
        headers.set("authorization", `Bearer ${jwt}`);
      }
    },
  }),
  tagTypes: ["LeadStatus"],
  endpoints: (builder) => ({
    getLeadStatuses: builder.query<LeadStatus[], void>({
      query: () => "lead/status",
      providesTags: ["LeadStatus"],
    }),
  }),
});

export const { useGetLeadStatusesQuery } = leadStatusApi;
