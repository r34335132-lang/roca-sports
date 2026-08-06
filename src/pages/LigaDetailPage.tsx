import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import {
  fetchLeague,
  fetchPlayersByLeague,
  fetchTeamsByLeague,
} from "@/lib/services/leagues";
import type { League, Player, Team } from "@/lib/types";
import { SPORT_IMAGES, SPORT_LABELS } from "@/lib/types";

export function LigaDetailPage() {
  const { idOrSlug = "" } = useParams();
  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const l = await fetchLeague(idOrSlug);
        setLeague(l);
        if (l) {
          const [t, p] = await Promise.all([
            fetchTeamsByLeague(l.id),
            fetchPlayersByLeague(l.id),
          ]);
          setTeams(t);
          setPlayers(p);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    })();
  }, [idOrSlug]);

  if (error) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="form-error">{error}</p>
        </main>
      </>
    );
  }

  if (!league) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="muted">Cargando liga...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section
          className="league-hero"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(5,7,8,.92), rgba(5,7,8,.55)), url(${
              league.banner_url || SPORT_IMAGES[league.sport]
            })`,
          }}
        >
          <div className="section-pad">
            {league.logo_url && <img className="league-logo lg" src={league.logo_url} alt="" />}
            <p className="eyebrow">{SPORT_LABELS[league.sport]}</p>
            <h1>{league.name}</h1>
            <p>
              {league.city}, {league.state} · {league.season} · estilo {league.visual_style}
            </p>
            <Link className="btn btn-outline" to={`/deportes/${league.sport}`}>
              Ver hub de {SPORT_LABELS[league.sport]}
            </Link>
          </div>
        </section>

        <section className="section-pad dash-split">
          <div className="dash-panel">
            <h3>Equipos ({teams.length})</h3>
            <ul className="simple-list">
              {teams.map((t) => (
                <li key={t.id}>
                  <strong>{t.name}</strong>
                  <span>{t.coach_name ?? "—"}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dash-panel">
            <h3>Jugadores ({players.length})</h3>
            <ul className="simple-list">
              {players.map((p) => (
                <li key={p.id}>
                  <Link to={`/jugador/${p.id}`}>
                    <strong>
                      #{p.number} {p.full_name}
                    </strong>
                  </Link>
                  <span>{p.position}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
