import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, initialized } = useAuthStore();

  // Show brief spinner for max 2s while checking auth
  if (!initialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-stone-950">
        <Loader2 className="size-6 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
