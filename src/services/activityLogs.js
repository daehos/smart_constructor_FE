import { api } from "@/lib/apiClient";

export const activityLogsApi = {
  list: (params) => api.get("/activity-logs", { params }),
  mine: (params) => api.get("/activity-logs/me", { params }),
};

