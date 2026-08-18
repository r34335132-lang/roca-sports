import { useEffect, useMemo, useState, type FormEvent } from "react";
import { StandingsTable } from "@/components/leagues/StandingsTable";
import {
  emptyMatchForm,
  getStatFields,
  matchHeadline,
  matchStatusLabel,
  MATCH_STATUSES,
  MATCHDAY_STATUSES,
  parseStatNumber,
  statValue,
  toggleTotwPlayer,
  totwLimit,
  totwWeekLabel,
  validateMatchdayForm,
  validateMatchForm,
  validateTotw,
} from "@/lib/leagueOps";
import {
  createMatchday,
  createSportsMatch,
  fetchLiveMatches,
  fetchLeagueStandings,
  fetchMatchdays,
  fetchTeamOfWeek,
  saveLeagueStandings,
  updateMatchday,
  updateSportsMatch,
  upsertPlayerStats,
  upsertTeamOfWeek,
} from "@/lib/services/leagues";
import {
  applyStandingValue,
  buildStandingsTable,
  computeStandingsFromMatches,
  finishStanding,
  sortStandings,
  suggestPoints,
  type StandingRow,
} from "@/lib/standings";
import type { League, Matchday, Player, PlayerStats, SportsMatch, Team } from "@/lib/types";
import { SPORT_ATHLETES } from "@/lib/types";

type Tab = "juegos" | "tabla" | "stats" | "totw";

export function LeagueOpsDesk({
  league,
  players,
  teams,
  onRefresh,
}: {
  league: League;
  players: Player[];
  teams: Team[];
  onRefresh: () => Promise<void>;
}) {
  const [tab, setTab] = useState<Tab>("juegos");
  const [matches, setMatches] = useState<SportsMatch[]>([]);
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);
  const [totwIds, setTotwIds] = useState<string[]>([]);
  const [matchForm, setMatchForm] = useState(emptyMatchForm());
  const [matchdayForm, setMatchdayForm] = useState({ number: 1, title: "Jornada 1" });
  const [statsDraft, setStatsDraft] = useState<Record<string, Record<string, number>>>({});
  const [standingsDraft, setStandingsDraft] = useState<StandingRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const fields = useMemo(() => getStatFields(league.sport), [league.sport]);
  const limit = totwLimit(league.sport);
  const teamName = (id: string | null) => teams.find((t) => t.id === id)?.name ?? "TBD";

  const loadOps = async () => {
    const [m, days, totw, saved] = await Promise.all([
      fetchLiveMatches(league.id),
      fetchMatchdays(league.id),
      fetchTeamOfWeek(league.id),
      fetchLeagueStandings(league.id),
    ]);
    setMatches(m);
    setMatchdays(days);
    setTotwIds(totw?.player_ids ?? []);
    setStandingsDraft(buildStandingsTable(teams, saved, m));
    setMatchdayForm({
      number: (days.at(-1)?.number ?? 0) + 1,
      title: `Jornada ${(days.at(-1)?.number ?? 0) + 1}`,
    });
  };

  useEffect(() => {
    setError(null);
    setMsg(null);
    void loadOps().catch((e) => setError(String(e.message ?? e)));
  }, [league.id]);

  useEffect(() => {
    if (!teams.length) return;
    void fetchLeagueStandings(league.id)
      .then((saved) => setStandingsDraft(buildStandingsTable(teams, saved, matches)))
      .catch(() => {});
  }, [teams]);

  useEffect(() => {
    const next: Record<string, Record<string, number>> = {};
    for (const player of players) {
      const stats = player.player_stats?.[0];
      next[player.id] = {};
      for (const field of fields) {
        next[player.id][field.key] = statValue(stats, field.key);
      }
    }
    setStatsDraft(next);
  }, [players, fields]);

  const save = async (action: () => Promise<void>, ok: string) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      setMsg(ok);
      await loadOps();
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  };

  const onCreateMatch = async (e: FormEvent) => {
    e.preventDefault();
    const issue = validateMatchForm(matchForm);
    if (issue) {
      setError(issue);
      return;
    }
    await save(async () => {
      await createSportsMatch({
        league_id: league.id,
        home_team_id: matchForm.home_team_id,
        away_team_id: matchForm.away_team_id,
        sport: league.sport,
        title: matchForm.title.trim() || null,
        venue: matchForm.venue.trim() || null,
        starts_at: matchForm.starts_at ? new Date(matchForm.starts_at).toISOString() : null,
        home_score: parseStatNumber(matchForm.home_score),
        away_score: parseStatNumber(matchForm.away_score),
        status: "scheduled",
      });
      setMatchForm(emptyMatchForm());
    }, "Partido publicado en el rol de juegos.");
  };

  const onCreateMatchday = async (e: FormEvent) => {
    e.preventDefault();
    const issue = validateMatchdayForm(matchdayForm);
    if (issue) {
      setError(issue);
      return;
    }
    await save(async () => {
      await createMatchday({
        league_id: league.id,
        number: matchdayForm.number,
        title: matchdayForm.title.trim(),
      });
    }, "Jornada publicada.");
  };

  const onSaveStats = () =>
    save(async () => {
      await Promise.all(
        players.map((player) =>
          upsertPlayerStats({
            player_id: player.id,
            league_id: league.id,
            season: league.season,
            patch: statsDraft[player.id] as Partial<PlayerStats>,
          }),
        ),
      );
    }, "Estadísticas actualizadas. Ya salen en las credenciales.");

  const onPublishTotw = () => {
    const issue = validateTotw(totwIds, limit);
    if (issue) {
      setError(issue);
      return;
    }
    return save(async () => {
      await upsertTeamOfWeek({
        league_id: league.id,
        title: "Equipo de la semana",
        week_label: totwWeekLabel(matchdays.at(-1)?.number),
        matchday_id: matchdays.at(-1)?.id ?? null,
        player_ids: totwIds,
      });
    }, "Equipo de la semana publicado.");
  };

  const onSaveStandings = () =>
    save(async () => {
      await saveLeagueStandings(
        league.id,
        standingsDraft.map((row) => finishStanding(row)),
      );
    }, "Tabla de posiciones publicada.");

  return (
    <section className="dash-panel ops-desk">
      <div className="ops-head">
        <div>
          <p className="eyebrow">Carga de temporada</p>
          <h3>Juegos, tabla, stats y XI</h3>
          <p className="muted">
            El admin carga el rol, la tabla de posiciones, las stats y el equipo de la semana.
            Eso es lo que se ve en el deporte y en las credenciales.
          </p>
        </div>
        <div className="ops-tabs">
          {(
            [
              ["juegos", "Rol de juegos"],
              ["tabla", "Tabla"],
              ["stats", "Estadísticas"],
              ["totw", "Equipo de la semana"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {msg && <p className="ok-banner">{msg}</p>}

      {tab === "juegos" && (
        <div className="ops-grid">
          <form className="ops-form" onSubmit={(e) => void onCreateMatchday(e)}>
            <h4>Jornada</h4>
            <div className="form-row">
              <label>
                Número
                <input
                  type="number"
                  min={1}
                  value={matchdayForm.number}
                  onChange={(e) =>
                    setMatchdayForm({ ...matchdayForm, number: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Nombre
                <input
                  value={matchdayForm.title}
                  onChange={(e) => setMatchdayForm({ ...matchdayForm, title: e.target.value })}
                />
              </label>
            </div>
            <button className="btn btn-outline" type="submit" disabled={busy}>
              Publicar jornada
            </button>
            <ul className="simple-list">
              {matchdays.map((day) => (
                <li key={day.id}>
                  <strong>
                    J{day.number} · {day.title}
                  </strong>
                  <select
                    value={day.status}
                    onChange={(e) =>
                      void save(async () => {
                        await updateMatchday(day.id, {
                          status: e.target.value as Matchday["status"],
                        });
                      }, "Jornada actualizada.")
                    }
                  >
                    {MATCHDAY_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
              {matchdays.length === 0 && <li>Aún no hay jornadas.</li>}
            </ul>
          </form>

          <form className="ops-form" onSubmit={(e) => void onCreateMatch(e)}>
            <h4>Nuevo partido</h4>
            {teams.length < 2 ? (
              <p className="muted">Crea al menos dos equipos para armar el rol.</p>
            ) : (
              <>
                <div className="form-row">
                  <label>
                    Local
                    <select
                      value={matchForm.home_team_id}
                      onChange={(e) => setMatchForm({ ...matchForm, home_team_id: e.target.value })}
                    >
                      <option value="">Elige</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Visitante
                    <select
                      value={matchForm.away_team_id}
                      onChange={(e) => setMatchForm({ ...matchForm, away_team_id: e.target.value })}
                    >
                      <option value="">Elige</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Sede / cancha
                  <input
                    value={matchForm.venue}
                    onChange={(e) => setMatchForm({ ...matchForm, venue: e.target.value })}
                    placeholder="Estadio, gimnasio, arena..."
                  />
                </label>
                <div className="form-row">
                  <label>
                    Fecha y hora
                    <input
                      type="datetime-local"
                      value={matchForm.starts_at}
                      onChange={(e) => setMatchForm({ ...matchForm, starts_at: e.target.value })}
                    />
                  </label>
                  <label>
                    Título (opcional)
                    <input
                      value={matchForm.title}
                      onChange={(e) => setMatchForm({ ...matchForm, title: e.target.value })}
                      placeholder="Clásico, semifinal..."
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Marcador local
                    <input
                      type="number"
                      min={0}
                      value={matchForm.home_score}
                      onChange={(e) => setMatchForm({ ...matchForm, home_score: e.target.value })}
                    />
                  </label>
                  <label>
                    Marcador visitante
                    <input
                      type="number"
                      min={0}
                      value={matchForm.away_score}
                      onChange={(e) => setMatchForm({ ...matchForm, away_score: e.target.value })}
                    />
                  </label>
                </div>
                <button className="btn btn-primary" type="submit" disabled={busy}>
                  Subir al rol
                </button>
              </>
            )}
          </form>

          <div className="match-board">
            {matches.length === 0 && <p className="muted">Todavía no hay partidos en el rol.</p>}
            {matches.map((match) => (
              <article key={match.id} className={`match-ticket status-${match.status}`}>
                <span className="pill">{matchStatusLabel(match.status)}</span>
                <h4>
                  {matchHeadline(
                    teamName(match.home_team_id),
                    teamName(match.away_team_id),
                    match.title,
                  )}
                </h4>
                <div className="match-score">
                  <input
                    type="number"
                    min={0}
                    value={match.home_score}
                    onChange={(e) =>
                      setMatches((rows) =>
                        rows.map((row) =>
                          row.id === match.id
                            ? { ...row, home_score: parseStatNumber(e.target.value) }
                            : row,
                        ),
                      )
                    }
                  />
                  <em>VS</em>
                  <input
                    type="number"
                    min={0}
                    value={match.away_score}
                    onChange={(e) =>
                      setMatches((rows) =>
                        rows.map((row) =>
                          row.id === match.id
                            ? { ...row, away_score: parseStatNumber(e.target.value) }
                            : row,
                        ),
                      )
                    }
                  />
                </div>
                <p className="muted">
                  {match.venue || "Sede por confirmar"}
                  {match.starts_at ? ` · ${new Date(match.starts_at).toLocaleString("es-MX")}` : ""}
                </p>
                <div className="ops-inline">
                  <select
                    value={match.status}
                    onChange={(e) =>
                      void save(async () => {
                        await updateSportsMatch(match.id, {
                          status: e.target.value as SportsMatch["status"],
                          home_score: match.home_score,
                          away_score: match.away_score,
                        });
                      }, "Partido actualizado.")
                    }
                  >
                    {MATCH_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="ghost-btn"
                    disabled={busy}
                    onClick={() =>
                      void save(async () => {
                        await updateSportsMatch(match.id, {
                          home_score: match.home_score,
                          away_score: match.away_score,
                          status: match.status === "scheduled" ? "final" : match.status,
                        });
                      }, "Marcador guardado.")
                    }
                  >
                    Guardar marcador
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === "tabla" && (
        <div className="tabla-desk">
          {teams.length === 0 ? (
            <p className="muted">Crea equipos para armar la tabla de posiciones.</p>
          ) : (
            <>
              <p className="muted">
                En fútbol la tabla lleva JJ, JG, JE, JP, GF, GC, DIF, PGP y PUNTOS. JJ y DIF se
                calculan solos. Puedes llenarla a mano o desde los partidos ya finalizados.
              </p>
              <StandingsTable
                sport={league.sport}
                teams={teams}
                rows={standingsDraft}
                accent={league.accent_color}
                editable
                onChange={(teamId, key, value) =>
                  setStandingsDraft((rows) =>
                    rows.map((row) =>
                      row.team_id === teamId ? applyStandingValue(row, key, value) : row,
                    ),
                  )
                }
              />
              <div className="ops-inline">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={busy}
                  onClick={() =>
                    setStandingsDraft(
                      sortStandings(
                        computeStandingsFromMatches(teams, matches).map((row) => {
                          const current = standingsDraft.find((r) => r.team_id === row.team_id);
                          return current ? { ...row, penalty_wins: current.penalty_wins } : row;
                        }),
                      ),
                    )
                  }
                >
                  Calcular desde partidos
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={busy}
                  onClick={() =>
                    setStandingsDraft((rows) =>
                      rows.map((row) => ({ ...row, points: suggestPoints(row) })),
                    )
                  }
                >
                  Armar puntos (3 x JG + JE)
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={busy}
                  onClick={() => void onSaveStandings()}
                >
                  Publicar tabla
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "stats" && (
        <div className="stats-desk">
          {players.length === 0 ? (
            <p className="muted">Primero registra jugadores para cargarles números.</p>
          ) : (
            <>
              <div className="table-wrap stats-table-wrap">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Jugador</th>
                      {fields.map((field) => (
                        <th key={field.key}>{field.short}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
                      <tr key={player.id}>
                        <td>
                          <strong>
                            #{player.number} {player.full_name}
                          </strong>
                          <small>{player.teams?.name ?? player.position}</small>
                        </td>
                        {fields.map((field) => (
                          <td key={field.key}>
                            <input
                              type="number"
                              min={0}
                              step={field.step ?? 1}
                              value={statsDraft[player.id]?.[field.key] ?? 0}
                              onChange={(e) =>
                                setStatsDraft((draft) => ({
                                  ...draft,
                                  [player.id]: {
                                    ...draft[player.id],
                                    [field.key]: parseStatNumber(e.target.value, field.step ?? 1),
                                  },
                                }))
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="btn btn-primary" type="button" disabled={busy} onClick={() => void onSaveStats()}>
                Guardar estadísticas
              </button>
            </>
          )}
        </div>
      )}

      {tab === "totw" && (
        <div className="totw-desk">
          <p className="muted">
            Elige hasta {limit} para {league.sport}. {totwIds.length}/{limit} seleccionados.
          </p>
          <div className="totw-picker">
            {players.map((player) => {
              const on = totwIds.includes(player.id);
              return (
                <button
                  key={player.id}
                  type="button"
                  className={`totw-pick ${on ? "is-on" : ""}`}
                  onClick={() => setTotwIds((ids) => toggleTotwPlayer(ids, player.id, limit))}
                >
                  <img
                    src={player.photo_url || SPORT_ATHLETES[league.sport] || SPORT_ATHLETES.other}
                    alt=""
                  />
                  <strong>{player.full_name}</strong>
                  <span>
                    #{player.number} · {player.position}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="totw-preview">
            {totwIds.map((id) => {
              const player = players.find((p) => p.id === id);
              return (
                <div key={id} className="totw-slot">
                  <b>#{player?.number ?? "—"}</b>
                  <strong>{player?.full_name ?? "Jugador"}</strong>
                  <span>{player?.position}</span>
                </div>
              );
            })}
          </div>
          <button className="btn btn-primary" type="button" disabled={busy} onClick={() => void onPublishTotw()}>
            Publicar equipo de la semana
          </button>
        </div>
      )}
    </section>
  );
}
