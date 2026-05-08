import { api } from "@/lib/apiClient";

export const attendanceApi = {
  today: () => api.get("/attendance/today"),
  clockIn: (body) => api.post("/attendance/clock-in", body),
  clockOut: (body) => api.post("/attendance/clock-out", body),
  mine: (params) => api.get("/attendance/me", { params }),
  calendar: (params) => api.get("/attendance/me/calendar", { params }),
};

