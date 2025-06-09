import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "https://danielbrutos-001-site1.ftempurl.com/api",
  // baseURL: "http://localhost:8000/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

api.interceptors.response.use(undefined, function axiosRetryinterceptor(err) {
  if (err.response?.status === 401) window.location = "/login";
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
