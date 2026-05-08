import { api } from "@/lib/apiClient";

export const materialsApi = {
  list: (params) => api.get("/materials", { params }),
  get: (id) => api.get(`/materials/${id}`),
  create: (body) => api.post("/materials", body),
  update: (id, body) => api.patch(`/materials/${id}`, body),
  remove: (id) => api.delete(`/materials/${id}`),
  priceComparison: (params) => api.get("/materials/price-comparison", { params }),
};

