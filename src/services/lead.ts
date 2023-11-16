import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
//
<<<<<<< HEAD
import { Lead, LeadCustomProperty, LeadPropertyGroup, LeadStandardProperty} from "../types";
=======
import { Lead } from "../types";
import { setJwt, signOut } from "../store/user/slice";
import { baseQuery } from "./helpers/base-query";
>>>>>>> main

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

export const leadApi = createApi({
  reducerPath: "leadApi",
  baseQuery: baseQueryWithReauth,
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
    addCustomProperty: builder.mutation<LeadCustomProperty, any>({
      query(body) {
        return {
          url: `lead/property/custom`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Lead"],
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
    addValidateDataCsv: builder.mutation<any, any>({
      query(body) {
        return {
          url: `lead/csv/validate`,
          method: "POST",
          body,
        };
      },
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
  useGetLeadPropertyGroupQuery,
  useAddCustomPropertyMutation,
  useAddValidateDataCsvMutation
} = leadApi;
