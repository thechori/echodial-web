import axios from "axios";

// BUG: local storage gets mounted ONCE for this when the app spins up
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
});

apiService.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");

  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }

  return config;
});

export default apiService;
