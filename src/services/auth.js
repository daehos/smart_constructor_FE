import { api } from "@/lib/apiClient";

export const authApi = {
  register: (body) => api.post("/auth/register", body),
  login: (body) => api.post("/auth/login", body),
  verifyOtp: (body) => api.post("/auth/verify-otp", body),
};

