import { Navigate } from "react-router-dom";
import { useSyncExternalStore } from "react";
import { authStore } from "@/stores/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useSyncExternalStore(
    authStore.subscribe,
    () => authStore.isAuthenticated()
  );
  const isLoading = useSyncExternalStore(
    authStore.subscribe,
    () => authStore.isLoading()
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Laddar…</p>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
