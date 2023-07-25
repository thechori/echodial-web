import axios from "axios";

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
});

export default apiService;
