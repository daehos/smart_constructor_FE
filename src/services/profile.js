import { api } from "@/lib/apiClient";

export const profileApi = {
  me: () => api.get("/profile"),
};

