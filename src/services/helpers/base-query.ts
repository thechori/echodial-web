import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
//
import { LOCAL_STORAGE_JWT } from "../../configs/local-storage";

const apiBaseUrl = import.meta.env.VITE_API_HOST;

export const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    const jwt = localStorage.getItem(LOCAL_STORAGE_JWT);
    if (jwt) {
      headers.set("authorization", `Bearer ${jwt}`);
    }
  },
});
