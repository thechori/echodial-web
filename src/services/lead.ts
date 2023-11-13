import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
//
import { Lead } from "../types";
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
} = leadApi;
