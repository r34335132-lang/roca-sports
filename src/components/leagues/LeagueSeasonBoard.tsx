import {
  getStatFields,
  leaderStatKey,
  matchHeadline,
  matchStatusLabel,
  rankPlayers,
  totwWeekLabel,
} from "@/lib/leagueOps";
import { SPORT_ATHLETES } from "@/lib/types";
import type { League, Matchday, Player, SportsMatch, Team, TeamOfWeek } from "@/lib/types";

function teamName(teams: Team[], id: string | null) {
  return teams.find((t) => t.id === id)?.name ?? "TBD";
}

export function LeagueSeasonBoard({
  league,
  teams,
  players,
  matches,
  matchdays,
  totw,
}: {
  league: League;
  teams: Team[];
  players: Player[];
  matches: SportsMatch[];
  matchdays: Matchday[];
  totw: TeamOfWeek | null;
}) {
  const fields = getStatFields(league.sport);
  const leaderKey = leaderStatKey(league.sport);
  const leaders = rankPlayers(players, leaderKey, 8);
  const leaderLabel = fields.find((f) => f.key === leaderKey)?.label ?? "Líderes";

  return (
    <div className="season-board">
      <section className="dash-panel">
        <h3>Rol de juegos</h3>
        {matches.length === 0 ? (
          <p className="muted">Aún no hay partidos publicados.</p>
        ) : (
          <div className="match-board public">
            {matches.map((match) => (
              <article key={match.id} className={`match-ticket status-${match.status}`}>
                <span className="pill">{matchStatusLabel(match.status)}</span>
                <h4>
                  {matchHeadline(
                    teamName(teams, match.home_team_id),
                    teamName(teams, match.away_team_id),
                    match.title,
                  )}
                </h4>
                <p className="match-score-read">
                  <b>{match.home_score}</b>
                  <em>VS</em>
                  <b>{match.away_score}</b>
                </p>
                <p className="muted">
                  {match.venue || "Sede por confirmar"}
                  {match.starts_at ? ` · ${new Date(match.starts_at).toLocaleString("es-MX")}` : ""}
                </p>
              </article>
            ))}
          </div>
        )}
        {matchdays.length > 0 && (
          <ul className="simple-list" style={{ marginTop: 16 }}>
            {matchdays.map((day) => (
              <li key={day.id}>
                <strong>
                  J{day.number} · {day.title}
                </strong>
                <span>{day.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dash-panel">
        <h3>{leaderLabel}</h3>
        {leaders.length === 0 ? (
          <p className="muted">Sin estadísticas todavía.</p>
        ) : (
          <ol className="scorer-list">
            {leaders.map((row, i) => (
              <li key={row.player.id}>
                <span className="rank">{i + 1}</span>
                <div>
                  <strong>{row.player.full_name}</strong>
                  <small>{row.player.teams?.name ?? row.player.position}</small>
                </div>
                <em style={{ color: league.accent_color }}>{row.value}</em>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="dash-panel">
        <h3>Equipo de la semana</h3>
        {!totw || totw.player_ids.length === 0 ? (
          <p className="muted">Todavía no se publica el XI / lineup.</p>
        ) : (
          <div>
            <p className="eyebrow">{totw.week_label || totwWeekLabel()}</p>
            <h4>{totw.title}</h4>
            <div className="totw-grid">
              {totw.player_ids.map((id) => {
                const player = players.find((p) => p.id === id);
                return (
                  <div key={id} className="totw-slot">
                    <img
                      src={
                        player?.photo_url ||
                        SPORT_ATHLETES[league.sport] ||
                        SPORT_ATHLETES.other
                      }
                      alt=""
                    />
                    <strong>{player?.full_name ?? "Jugador"}</strong>
                    <span>#{player?.number ?? "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
