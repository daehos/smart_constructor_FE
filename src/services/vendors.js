import { api } from "@/lib/apiClient";

export const vendorsApi = {
  list: (params) => api.get("/vendors", { params }),
  get: (id) => api.get(`/vendors/${id}`),
  create: (body) => api.post("/vendors", body),
  update: (id, body) => api.patch(`/vendors/${id}`, body),
  remove: (id) => api.delete(`/vendors/${id}`),
  materialHistory: (id, params) =>
    api.get(`/vendors/${id}/material-history`, { params }),
  audit: (id, params) => api.get(`/vendors/${id}/audit`, { params }),
};

