import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import "../index.css";
import { router } from "./routes";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/lib/authContext";
import { ToastProvider } from "@/lib/toast.jsx";
import { ToastBanner } from "@/components/ui/toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <ToastBanner />
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
