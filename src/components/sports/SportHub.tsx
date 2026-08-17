import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchLeaguesBySport,
  fetchMatchdays,
  fetchPlayersByLeague,
  fetchTeamOfWeek,
  fetchTeamsByLeague,
} from "@/lib/services/leagues";
import type { League, Matchday, Player, PlayerStats, Team, TeamOfWeek } from "@/lib/types";
import { SPORT_LABELS } from "@/lib/types";

function statsFor(player: Player) {
  return player.player_stats?.[0] as PlayerStats | undefined;
}

export function SportHub({ sport }: { sport: string }) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);
  const [totw, setTotw] = useState<TeamOfWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchLeaguesBySport(sport);
        if (!alive) return;
        setLeagues(list);
        const current = list[0] ?? null;
        setLeague(current);
        if (current) {
          const [t, p, m, w] = await Promise.all([
            fetchTeamsByLeague(current.id),
            fetchPlayersByLeague(current.id),
            fetchMatchdays(current.id),
            fetchTeamOfWeek(current.id),
          ]);
          if (!alive) return;
          setTeams(t);
          setPlayers(p);
          setMatchdays(m);
          setTotw(w);
        } else {
          setTeams([]);
          setPlayers([]);
          setMatchdays([]);
          setTotw(null);
        }
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Error al cargar");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [sport]);

  const scorers = useMemo(() => {
    const key =
      sport === "soccer"
        ? "goals"
        : sport === "basketball"
          ? "points"
          : sport === "flag"
            ? "touchdowns"
            : sport === "boxing"
              ? "mvp_count"
              : "points";
    return [...players]
      .sort((a, b) => Number(statsFor(b)?.[key as keyof PlayerStats] ?? 0) - Number(statsFor(a)?.[key as keyof PlayerStats] ?? 0))
      .slice(0, 8);
  }, [players, sport]);

  const accent = league?.accent_color ?? "#b9ff00";
  const label = SPORT_LABELS[sport] ?? sport;

  if (loading) {
    return <div className="panel-empty">Cargando {label}...</div>;
  }

  if (error) {
    return (
      <div className="panel-empty">
        <h3>No se pudo cargar {label}</h3>
        <p>{error}</p>
        <p className="muted">Revisa VITE_SUPABASE_URL / ANON_KEY en tu .env</p>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="panel-empty">
        <h3>Sin ligas de {label}</h3>
        <p>Sé el primero en crear una liga de este deporte.</p>
        <Link className="btn btn-primary" to="/crear-liga">
          Crear liga
        </Link>
      </div>
    );
  }

  const scorerKey =
    sport === "soccer" ? "goals" : sport === "flag" ? "touchdowns" : "points";
  const scorerLabel =
    sport === "soccer" ? "Goleadores" : sport === "flag" ? "TD leaders" : "Líderes";

  return (
    <div className="sport-hub">
      <div
        className="sport-banner"
        style={{
          backgroundImage: league.banner_url
            ? `linear-gradient(90deg, rgba(5,7,8,.92), rgba(5,7,8,.55)), url(${league.banner_url})`
            : undefined,
          borderColor: `${accent}55`,
        }}
      >
        <div className="sport-banner-copy">
          {league.logo_url && <img className="league-logo" src={league.logo_url} alt="" />}
          <div>
            <p className="eyebrow">{label}</p>
            <h2>{league.name}</h2>
            <p>
              {league.city}, {league.state} · {league.season} · {league.category}
            </p>
          </div>
        </div>
        <div className="sport-summary">
          <div>
            <strong>{teams.length}</strong>
            <span>Equipos</span>
          </div>
          <div>
            <strong>{players.length}</strong>
            <span>Jugadores</span>
          </div>
          <div>
            <strong>{matchdays.length}</strong>
            <span>Jornadas</span>
          </div>
        </div>
      </div>

      {leagues.length > 1 && (
        <div className="chip-row">
          {leagues.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`chip ${l.id === league.id ? "active" : ""}`}
              onClick={async () => {
                setLeague(l);
                const [t, p, m, w] = await Promise.all([
                  fetchTeamsByLeague(l.id),
                  fetchPlayersByLeague(l.id),
                  fetchMatchdays(l.id),
                  fetchTeamOfWeek(l.id),
                ]);
                setTeams(t);
                setPlayers(p);
                setMatchdays(m);
                setTotw(w);
              }}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}

      <div className="sport-grid">
        <section className="dash-panel">
          <h3>Jornadas</h3>
          {matchdays.length === 0 ? (
            <p className="muted">Aún no hay jornadas publicadas.</p>
          ) : (
            <ul className="simple-list">
              {matchdays.map((m) => (
                <li key={m.id}>
                  <strong>
                    J{m.number} · {m.title}
                  </strong>
                  <span>{m.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-panel">
          <h3>{scorerLabel}</h3>
          {scorers.length === 0 ? (
            <p className="muted">Sin estadísticas todavía.</p>
          ) : (
            <ol className="scorer-list">
              {scorers.map((p, i) => (
                <li key={p.id}>
                  <span className="rank">{i + 1}</span>
                  <div>
                    <strong>{p.full_name}</strong>
                    <small>{p.teams?.name ?? "Sin equipo"}</small>
                  </div>
                  <em style={{ color: accent }}>
                    {Number(statsFor(p)?.[scorerKey as keyof PlayerStats] ?? 0)}
                  </em>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="dash-panel">
          <h3>Equipo de la semana</h3>
          {!totw ? (
            <p className="muted">El dueño de la liga publicará el XI / lineup semanal.</p>
          ) : (
            <div>
              <p className="eyebrow">{totw.week_label}</p>
              <h4>{totw.title}</h4>
              <div className="totw-grid">
                {totw.player_ids.map((id) => {
                  const p = players.find((x) => x.id === id);
                  return (
                    <div key={id} className="totw-slot">
                      <strong>{p?.full_name ?? "Jugador"}</strong>
                      <span>#{p?.number ?? "—"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="dash-panel">
          <h3>Equipos</h3>
          <ul className="simple-list">
            {teams.map((t) => (
              <li key={t.id}>
                <strong>{t.name}</strong>
                <span>{t.coach_name ?? "Sin coach"}</span>
              </li>
            ))}
          </ul>
          <Link className="text-link" to={`/liga/${league.slug || league.id}`}>
            Ver liga completa →
          </Link>
        </section>
      </div>
    </div>
  );
}
