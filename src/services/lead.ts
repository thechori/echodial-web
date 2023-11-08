import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//
import { Lead, LeadCustomProperty, LeadPropertyGroup, LeadStandardProperty} from "../types";

const apiBaseUrl = import.meta.env.VITE_API_HOST;

// Define a service using a base URL and expected endpoints
export const leadApi = createApi({
  reducerPath: "leadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        headers.set("authorization", `Bearer ${jwt}`);
      }
    },
  }),
  tagTypes: ["Lead"],
  endpoints: (builder) => ({
    getLeads: builder.query<Lead[], void>({
      query: () => "lead",
      providesTags: ["Lead"],
    }),
    getLeadById: builder.query<Lead, string>({
      query: (id) => `lead/${id}`,
      providesTags: ["Lead"],
    }),
    getLeadStandardProperties: builder.query<LeadStandardProperty[], void>({
      query: () => `lead/property/standard`,
      providesTags: ["Lead"],
    }),
    getLeadCustomProperties: builder.query<LeadCustomProperty[], void>({
      query: () => `lead/property/custom`,
      providesTags: ["Lead"],
    }),
    getLeadPropertyGroup: builder.query<LeadPropertyGroup[], void>({
      query: () => `lead/property/group`,
      providesTags: ["Lead"],
    }),
    addLead: builder.mutation<Lead, Partial<Lead>>({
      query(body) {
        return {
          url: `lead`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Lead"],
    }),
    addLeadsViaCsv: builder.mutation<Lead[], any>({
      query(body) {
        return {
          url: `lead/csv`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Lead"],
    }),
    updateLead: builder.mutation<Lead, Partial<Lead>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `lead/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Lead"],
    }),

    deleteMultipleLeads: builder.mutation<
      { message: string; data: number[] },
      number[]
    >({
      query(ids) {
        return {
          url: "lead/bulk-delete",
          method: "POST",
          body: {
            ids,
          },
        };
      },
      invalidatesTags: ["Lead"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetLeadByIdQuery,
  useGetLeadsQuery,
  useAddLeadMutation,
  useAddLeadsViaCsvMutation,
  useUpdateLeadMutation,
  useDeleteMultipleLeadsMutation,
  useGetLeadStandardPropertiesQuery,
  useGetLeadCustomPropertiesQuery,
  useGetLeadPropertyGroupQuery
} = leadApi;
