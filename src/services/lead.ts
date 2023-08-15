import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type TLead = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  source: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

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
    getLeads: builder.query<TLead[], void>({
      query: () => "lead",
      providesTags: ["Lead"],
    }),
    getLeadById: builder.query<TLead, string>({
      query: (id) => `lead/${id}`,
      providesTags: ["Lead"],
    }),
    addLead: builder.mutation<TLead, Partial<TLead>>({
      query(body) {
        return {
          url: `lead`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Lead"],
    }),
    addLeadsViaCsv: builder.mutation<TLead[], any>({
      query(body) {
        return {
          url: `lead/csv`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Lead"],
    }),
    updateLead: builder.mutation<TLead, Partial<TLead>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `lead/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (lead) => [{ type: "Lead", id: lead?.id }],
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
} = leadApi;
