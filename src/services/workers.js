import { api } from "@/lib/apiClient";

export const workersApi = {
  list: (params) => api.get("/workers", { params }),
  get: (id) => api.get(`/workers/${id}`),
  create: (body) => api.post("/workers", body),
  update: (id, body) => api.patch(`/workers/${id}`, body),
  remove: (id) => api.delete(`/workers/${id}`),
};

