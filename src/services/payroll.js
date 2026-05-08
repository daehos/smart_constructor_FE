import { api } from "@/lib/apiClient";

export const payrollApi = {
  mine: (params) => api.get("/payroll/me", { params }),
  list: (params) => api.get("/payroll", { params }),
  get: (id) => api.get(`/payroll/${id}`),
  create: (body) => api.post("/payroll", body),
  update: (id, body) => api.patch(`/payroll/${id}`, body),
  remove: (id) => api.delete(`/payroll/${id}`),
  markPaid: (id) => api.post(`/payroll/${id}/mark-paid`),
};

