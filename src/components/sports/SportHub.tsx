import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LeagueSeasonBoard } from "@/components/leagues/LeagueSeasonBoard";
import {
  fetchLeaguesBySport,
  fetchLiveMatches,
  fetchMatchdays,
  fetchPlayersByLeague,
  fetchTeamOfWeek,
  fetchTeamsByLeague,
} from "@/lib/services/leagues";
import type { League, Matchday, Player, SportsMatch, Team, TeamOfWeek } from "@/lib/types";
import { SPORT_LABELS } from "@/lib/types";

async function loadLeaguePack(leagueId: string) {
  const [t, p, m, w, games] = await Promise.all([
    fetchTeamsByLeague(leagueId),
    fetchPlayersByLeague(leagueId),
    fetchMatchdays(leagueId),
    fetchTeamOfWeek(leagueId),
    fetchLiveMatches(leagueId),
  ]);
  return { teams: t, players: p, matchdays: m, totw: w, matches: games };
}

export function SportHub({ sport }: { sport: string }) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);
  const [totw, setTotw] = useState<TeamOfWeek | null>(null);
  const [matches, setMatches] = useState<SportsMatch[]>([]);
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
          const pack = await loadLeaguePack(current.id);
          if (!alive) return;
          setTeams(pack.teams);
          setPlayers(pack.players);
          setMatchdays(pack.matchdays);
          setTotw(pack.totw);
          setMatches(pack.matches);
        } else {
          setTeams([]);
          setPlayers([]);
          setMatchdays([]);
          setTotw(null);
          setMatches([]);
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
            <strong>{matches.length}</strong>
            <span>Juegos</span>
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
                const pack = await loadLeaguePack(l.id);
                setTeams(pack.teams);
                setPlayers(pack.players);
                setMatchdays(pack.matchdays);
                setTotw(pack.totw);
                setMatches(pack.matches);
              }}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}

      <LeagueSeasonBoard
        league={league}
        teams={teams}
        players={players}
        matches={matches}
        matchdays={matchdays}
        totw={totw}
      />

      <section className="dash-panel" style={{ marginTop: 18 }}>
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
  );
}
