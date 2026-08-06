import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { fetchLeagues } from "@/lib/services/leagues";
import type { League } from "@/lib/types";
import { SPORT_IMAGES, SPORT_LABELS } from "@/lib/types";

export function LigasPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeagues()
      .then(setLeagues)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="section-pad">
        <div className="section-head row-between">
          <div>
            <p className="eyebrow">Ligas</p>
            <h1>Todas las ligas</h1>
          </div>
          <Link className="btn btn-primary" to="/crear-liga">
            Crear liga
          </Link>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="league-cards">
          {leagues.map((league) => (
            <Link
              key={league.id}
              to={`/liga/${league.slug || league.id}`}
              className="league-card"
              style={{
                backgroundImage: `linear-gradient(160deg, rgba(5,7,8,.88), rgba(5,7,8,.55)), url(${
                  league.banner_url || SPORT_IMAGES[league.sport]
                })`,
                borderColor: `${league.accent_color}55`,
              }}
            >
              {league.logo_url ? (
                <img className="league-logo" src={league.logo_url} alt="" />
              ) : (
                <span className="league-logo placeholder" style={{ color: league.accent_color }}>
                  {SPORT_LABELS[league.sport]?.[0] ?? "R"}
                </span>
              )}
              <div>
                <p className="eyebrow">{SPORT_LABELS[league.sport]}</p>
                <h3>{league.name}</h3>
                <p>
                  {league.city} · {league.season}
                </p>
              </div>
            </Link>
          ))}
          {leagues.length === 0 && !error && (
            <p className="muted">Aún no hay ligas. Crea la primera.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
