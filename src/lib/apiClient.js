import axios from "axios";
import { clearToken, getToken } from "./authStorage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  if (cfg.data instanceof FormData) {
    delete cfg.headers["Content-Type"];
  }
  return cfg;
});

api.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      if (location.pathname !== "/login") location.assign("/login");
    }
    const env = err.response?.data;
    return Promise.reject({
      status: err.response?.status,
      message: env?.message ?? err.message,
      details: env?.details,
    });
  },
);

