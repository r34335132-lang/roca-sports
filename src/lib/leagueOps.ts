import type { Player, PlayerStats, SportType } from "@/lib/types";

export type StatField = {
  key: keyof PlayerStats;
  label: string;
  short: string;
  step?: number;
};

export type MatchFormInput = {
  home_team_id: string;
  away_team_id: string;
  venue: string;
  starts_at: string;
  title: string;
  home_score: number | string;
  away_score: number | string;
};

export type MatchStatus = "scheduled" | "live" | "final" | "cancelled";

export const MATCH_STATUSES: { value: MatchStatus; label: string }[] = [
  { value: "scheduled", label: "Programado" },
  { value: "live", label: "En vivo" },
  { value: "final", label: "Final" },
  { value: "cancelled", label: "Cancelado" },
];

export const MATCHDAY_STATUSES = [
  { value: "scheduled", label: "Programada" },
  { value: "live", label: "En juego" },
  { value: "finished", label: "Cerrada" },
] as const;

const COMMON: StatField[] = [
  { key: "games", label: "Partidos", short: "PJ" },
  { key: "mvp_count", label: "MVP", short: "MVP" },
];

export const STAT_FIELDS_BY_SPORT: Record<SportType | "default", StatField[]> = {
  soccer: [
    { key: "games", label: "Partidos", short: "PJ" },
    { key: "goals", label: "Goles", short: "G" },
    { key: "assists", label: "Asistencias", short: "AST" },
    { key: "yellow_cards", label: "Amarillas", short: "TA" },
    { key: "red_cards", label: "Rojas", short: "TR" },
    { key: "minutes_played", label: "Minutos", short: "MIN" },
  ],
  basketball: [
    { key: "games", label: "Partidos", short: "PJ" },
    { key: "points", label: "Puntos", short: "PTS" },
    { key: "rebounds", label: "Rebotes", short: "REB" },
    { key: "assists", label: "Asistencias", short: "AST" },
    { key: "steals", label: "Robos", short: "STL" },
    { key: "blocks", label: "Tapones", short: "BLK" },
  ],
  flag: [
    { key: "games", label: "Partidos", short: "PJ" },
    { key: "touchdowns", label: "Touchdowns", short: "TD" },
    { key: "interceptions", label: "Intercepciones", short: "INT" },
    { key: "sacks", label: "Sacks", short: "SACK" },
    { key: "receptions", label: "Recepciones", short: "REC" },
    { key: "passing_yards", label: "Yardas pase", short: "PASS" },
    { key: "rushing_yards", label: "Yardas tierra", short: "RUSH" },
  ],
  boxing: [
    { key: "games", label: "Peleas ganadas", short: "W" },
    { key: "mvp_count", label: "Knockouts", short: "KO" },
    { key: "points", label: "Rounds", short: "RDS" },
  ],
  baseball: [
    { key: "games", label: "Juegos", short: "J" },
    { key: "hits", label: "Hits", short: "H" },
    { key: "runs", label: "Carreras", short: "R" },
    { key: "home_runs", label: "Jonrones", short: "HR" },
    { key: "rbi", label: "RBI", short: "RBI" },
    { key: "batting_average", label: "Average", short: "AVG", step: 0.001 },
  ],
  volleyball: [
    { key: "games", label: "Partidos", short: "PJ" },
    { key: "points", label: "Puntos", short: "PTS" },
    { key: "blocks", label: "Bloqueos", short: "BLQ" },
    { key: "aces", label: "Aces", short: "ACES" },
    { key: "sets_played", label: "Sets", short: "SETS" },
  ],
  cycling: [
    { key: "cycling_activity_count", label: "Rutas", short: "RUTAS" },
    { key: "cycling_total_distance_km", label: "Kilómetros", short: "KM", step: 0.1 },
    { key: "cycling_avg_speed_kmh", label: "Velocidad", short: "KM/H", step: 0.1 },
  ],
  other: [
    ...COMMON,
    { key: "points", label: "Puntos", short: "PTS" },
  ],
  default: [
    ...COMMON,
    { key: "points", label: "Puntos", short: "PTS" },
  ],
};

export function getStatFields(sport?: string | null): StatField[] {
  return STAT_FIELDS_BY_SPORT[(sport as SportType) ?? "default"] ?? STAT_FIELDS_BY_SPORT.default;
}

export function totwLimit(sport?: string | null) {
  if (sport === "basketball") return 5;
  if (sport === "volleyball") return 6;
  if (sport === "baseball") return 9;
  if (sport === "boxing") return 2;
  if (sport === "cycling") return 5;
  return 11;
}

export function parseStatNumber(value: unknown, step = 1) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  if (step < 1) return Math.round(n / step) * step;
  return Math.round(n);
}

export function statValue(stats: PlayerStats | null | undefined, key: keyof PlayerStats) {
  const raw = stats?.[key];
  return typeof raw === "number" ? raw : 0;
}

export function buildStatsPatch(
  fields: StatField[],
  values: Record<string, unknown>,
): Partial<Record<keyof PlayerStats, number>> {
  const patch: Partial<Record<keyof PlayerStats, number>> = {};
  for (const field of fields) {
    patch[field.key] = parseStatNumber(values[field.key], field.step ?? 1);
  }
  return patch;
}

export function validateMatchForm(input: MatchFormInput) {
  if (!input.home_team_id) return "Elige el equipo local.";
  if (!input.away_team_id) return "Elige el equipo visitante.";
  if (input.home_team_id === input.away_team_id) return "Local y visitante no pueden ser el mismo equipo.";
  const home = parseStatNumber(input.home_score);
  const away = parseStatNumber(input.away_score);
  if (home < 0 || away < 0) return "El marcador no puede ser negativo.";
  return null;
}

export function validateMatchdayForm(input: { number: number; title: string }) {
  if (!Number.isFinite(input.number) || input.number < 1) return "La jornada debe ser 1 o mayor.";
  if (input.title.trim().length < 2) return "Ponle nombre a la jornada.";
  return null;
}

export function toggleTotwPlayer(selected: string[], playerId: string, limit: number) {
  if (selected.includes(playerId)) return selected.filter((id) => id !== playerId);
  if (selected.length >= limit) return selected;
  return [...selected, playerId];
}

export function validateTotw(playerIds: string[], limit: number) {
  if (playerIds.length < 1) return "Elige al menos un jugador para el equipo de la semana.";
  if (playerIds.length > limit) return `El máximo para este deporte es ${limit}.`;
  return null;
}

export function totwWeekLabel(matchdayNumber?: number | null) {
  return `Jornada ${matchdayNumber && matchdayNumber > 0 ? matchdayNumber : 1}`;
}

export function matchStatusLabel(status: string) {
  return MATCH_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function matchHeadline(homeName: string, awayName: string, title?: string | null) {
  const vs = `${homeName} vs ${awayName}`;
  return title?.trim() ? `${title.trim()} · ${vs}` : vs;
}

export function rankPlayers(
  players: Player[],
  key: keyof PlayerStats,
  limit = 8,
) {
  return [...players]
    .map((player) => ({
      player,
      value: statValue(player.player_stats?.[0], key),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function leaderStatKey(sport?: string | null): keyof PlayerStats {
  if (sport === "soccer") return "goals";
  if (sport === "flag") return "touchdowns";
  if (sport === "boxing") return "mvp_count";
  if (sport === "baseball") return "home_runs";
  if (sport === "cycling") return "cycling_total_distance_km";
  return "points";
}

export function emptyMatchForm(): MatchFormInput {
  return {
    home_team_id: "",
    away_team_id: "",
    venue: "",
    starts_at: "",
    title: "",
    home_score: 0,
    away_score: 0,
  };
}
