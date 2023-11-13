import axios from "axios";
//
import { LOCAL_STORAGE_JWT } from "../../configs/local-storage";

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
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    console.log("!!!!");
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default apiService;
