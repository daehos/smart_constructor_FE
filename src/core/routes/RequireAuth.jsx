import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/authContext";

export function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

