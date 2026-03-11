import { Navigate } from "react-router-dom";
import { authStore } from "@/stores/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authStore.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
