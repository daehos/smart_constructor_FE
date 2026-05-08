import { api } from "@/lib/apiClient";

export const ordersApi = {
  create: (body) => api.post("/orders", body),
  list: (params) => api.get("/orders", { params }),
  get: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  returnOrder: (id) => api.post(`/orders/${id}/return`),
  repeat: (id) => api.post(`/orders/${id}/repeat`),
};

