import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
//
import { CallerId } from "../types";
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

export const callerIdApi = createApi({
  reducerPath: "callerIdApi",
  baseQuery: baseQueryWithReauth,
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
