import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { LeagueWorkspace } from "@/components/leagues/LeagueWorkspace";
import { useAuth } from "@/context/AuthContext";

export function OwnerDashboard() {
  const { user, role, ownedLeagues, configured, refreshRoles, loading, rolesReady } = useAuth();
  const [params] = useSearchParams();
  const initial = params.get("liga") ?? ownedLeagues[0]?.id ?? "";
  const [leagueId, setLeagueId] = useState(initial);
  const league = ownedLeagues.find((l) => l.id === leagueId) ?? ownedLeagues[0] ?? null;

  useEffect(() => {
    if (league) setLeagueId(league.id);
  }, [league?.id]);

  if (!configured) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="warn-banner">Configura el .env para operar tu liga.</p>
        </main>
      </>
    );
  }
  if (loading || !rolesReady) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="muted">Cargando tu liga…</p>
        </main>
      </>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (role === "admin") return <Navigate to="/dashboard/admin" replace />;

  if (!league) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad panel-empty">
          <h1>Aún no tienes ligas</h1>
          <p>Crea tu liga, sube equipos y jugadores, y personaliza tu branding.</p>
          <Link className="btn btn-primary" to="/crear-liga">
            Crear liga
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="section-pad dashboard owner-dash">
        <div className="section-head row-between">
          <div>
            <p className="eyebrow">Dueño de liga</p>
            <h1>{league.name}</h1>
          </div>
          <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)}>
            {ownedLeagues.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <LeagueWorkspace
          league={league}
          onLeagueSaved={async () => {
            await refreshRoles();
          }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
