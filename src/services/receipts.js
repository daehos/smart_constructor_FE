import { api } from "@/lib/apiClient";

export const receiptsApi = {
  list: (params) => api.get("/receipts", { params }),
  upload: (file) => {
    const formData = new FormData();
    formData.append("receipt", file, file.name);
    return api.post("/receipts", formData);
  },
  get: (id) => api.get(`/receipts/${id}`),
};
