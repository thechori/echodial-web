import axios from "axios";
//
import { LOCAL_STORAGE_JWT } from "../../configs/local-storage";

// BUG: local storage gets mounted ONCE for this when the app spins up
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use((config) => {
  const jwt = localStorage.getItem(LOCAL_STORAGE_JWT);

  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }

  return config;
});

export default apiService;
