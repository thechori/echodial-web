import axios, { AxiosError } from "axios";
import { Store } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";
//
import { LOCAL_STORAGE_JWT } from "../../configs/local-storage";
import { setJwt, signOut } from "../../store/user/slice";
import { EXPIRED_SESSION_MESSAGE } from "../../configs/error-messages";

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
});

apiService.interceptors.request.use((config) => {
  const jwt = localStorage.getItem(LOCAL_STORAGE_JWT);

  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }

  return config;
});

apiService.interceptors.response.use(
  function (response) {
    return response;
  },
  async function ({ config }: AxiosError) {
    try {
      if (!config) throw Error("No error response config found");

      const { data } = await apiService.get("/auth/refresh-token");
      store.dispatch(setJwt(data));

      // Update req.headers["Authorization"] with new access_token
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        LOCAL_STORAGE_JWT
      )};`;

      const response = await apiService(config);

      return response;
    } catch (e) {
      notifications.show({ message: EXPIRED_SESSION_MESSAGE });
      store.dispatch(signOut());
      return Promise.reject(e);
    }
  }
);

export default apiService;

let store: Store;

export const injectStore = (_store: Store) => {
  store = _store;
};
