import { Navigate } from "react-router-dom";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { dashboardPath } from "@/lib/roles";

export function DashboardHome() {
  const { user, loading, rolesReady, role } = useAuth();

  if (loading || !rolesReady) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="muted">Cargando tu dashboard…</p>
        </main>
      </>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <Navigate to={dashboardPath(role)} replace />;
}
