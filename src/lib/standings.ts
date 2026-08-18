import type { SportType, SportsMatch, Team } from "@/lib/types";

export type StandingKey =
  | "played"
  | "won"
  | "drawn"
  | "lost"
  | "goals_for"
  | "goals_against"
  | "goal_diff"
  | "penalty_wins"
  | "points";

export type StandingField = {
  key: StandingKey;
  short: string;
  label: string;
  computed?: boolean;
  signed?: boolean;
};

export type StandingRow = {
  team_id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  penalty_wins: number;
  points: number;
};

export const SOCCER_STANDING_FIELDS: StandingField[] = [
  { key: "played", short: "JJ", label: "Juegos jugados", computed: true },
  { key: "won", short: "JG", label: "Juegos ganados" },
  { key: "drawn", short: "JE", label: "Juegos empatados" },
  { key: "lost", short: "JP", label: "Juegos perdidos" },
  { key: "goals_for", short: "GF", label: "Goles a favor" },
  { key: "goals_against", short: "GC", label: "Goles en contra" },
  { key: "goal_diff", short: "DIF", label: "Diferencia", computed: true, signed: true },
  { key: "penalty_wins", short: "PGP", label: "Ganados por penales" },
  { key: "points", short: "PUNTOS", label: "Puntos" },
];

export const STANDING_FIELDS_BY_SPORT: Record<SportType | "default", StandingField[]> = {
  soccer: SOCCER_STANDING_FIELDS,
  basketball: [
    { key: "played", short: "JJ", label: "Juegos jugados", computed: true },
    { key: "won", short: "JG", label: "Ganados" },
    { key: "lost", short: "JP", label: "Perdidos" },
    { key: "goals_for", short: "PF", label: "Puntos a favor" },
    { key: "goals_against", short: "PC", label: "Puntos en contra" },
    { key: "goal_diff", short: "DIF", label: "Diferencia", computed: true, signed: true },
    { key: "points", short: "PUNTOS", label: "Puntos" },
  ],
  flag: [
    { key: "played", short: "JJ", label: "Juegos jugados", computed: true },
    { key: "won", short: "JG", label: "Ganados" },
    { key: "lost", short: "JP", label: "Perdidos" },
    { key: "goals_for", short: "PF", label: "Puntos a favor" },
    { key: "goals_against", short: "PC", label: "Puntos en contra" },
    { key: "goal_diff", short: "DIF", label: "Diferencia", computed: true, signed: true },
    { key: "points", short: "PUNTOS", label: "Puntos" },
  ],
  volleyball: [
    { key: "played", short: "JJ", label: "Juegos jugados", computed: true },
    { key: "won", short: "JG", label: "Ganados" },
    { key: "lost", short: "JP", label: "Perdidos" },
    { key: "goals_for", short: "SF", label: "Sets a favor" },
    { key: "goals_against", short: "SC", label: "Sets en contra" },
    { key: "goal_diff", short: "DIF", label: "Diferencia", computed: true, signed: true },
    { key: "points", short: "PUNTOS", label: "Puntos" },
  ],
  baseball: [
    { key: "played", short: "JJ", label: "Juegos jugados", computed: true },
    { key: "won", short: "JG", label: "Ganados" },
    { key: "lost", short: "JP", label: "Perdidos" },
    { key: "goals_for", short: "CA", label: "Carreras a favor" },
    { key: "goals_against", short: "CR", label: "Carreras en contra" },
    { key: "goal_diff", short: "DIF", label: "Diferencia", computed: true, signed: true },
    { key: "points", short: "PUNTOS", label: "Puntos" },
  ],
  boxing: [
    { key: "played", short: "JJ", label: "Peleas", computed: true },
    { key: "won", short: "JG", label: "Ganadas" },
    { key: "drawn", short: "JE", label: "Empates" },
    { key: "lost", short: "JP", label: "Perdidas" },
    { key: "penalty_wins", short: "KO", label: "Knockouts" },
    { key: "points", short: "PUNTOS", label: "Puntos" },
  ],
  cycling: [
    { key: "played", short: "JJ", label: "Eventos", computed: true },
    { key: "won", short: "JG", label: "Podios" },
    { key: "points", short: "PUNTOS", label: "Puntos" },
  ],
  other: SOCCER_STANDING_FIELDS.filter((f) => f.key !== "penalty_wins"),
  default: SOCCER_STANDING_FIELDS.filter((f) => f.key !== "penalty_wins"),
};

export function getStandingFields(sport?: string | null): StandingField[] {
  return STANDING_FIELDS_BY_SPORT[(sport as SportType) ?? "default"] ?? STANDING_FIELDS_BY_SPORT.default;
}

export function emptyStanding(teamId: string): StandingRow {
  return {
    team_id: teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goals_for: 0,
    goals_against: 0,
    goal_diff: 0,
    penalty_wins: 0,
    points: 0,
  };
}

export function parseStandingNumber(value: unknown, signed = false) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  if (!signed && n < 0) return 0;
  return Math.round(n);
}

export function finishStanding(row: StandingRow): StandingRow {
  const played = row.won + row.drawn + row.lost;
  const goal_diff = row.goals_for - row.goals_against;
  return { ...row, played, goal_diff };
}

export function suggestPoints(row: Pick<StandingRow, "won" | "drawn">) {
  return row.won * 3 + row.drawn;
}

export function applyStandingValue(row: StandingRow, key: StandingKey, value: unknown): StandingRow {
  const fieldSigned = key === "goal_diff";
  const next = { ...row, [key]: parseStandingNumber(value, fieldSigned) };
  if (key === "points" || key === "penalty_wins") return next;
  return finishStanding(next);
}

export function computeStandingsFromMatches(teams: Team[], matches: SportsMatch[]): StandingRow[] {
  const rows = new Map(teams.map((team) => [team.id, emptyStanding(team.id)]));

  for (const match of matches) {
    if (match.status !== "final" && match.status !== "live") continue;
    const homeId = match.home_team_id;
    const awayId = match.away_team_id;
    if (!homeId || !awayId || homeId === awayId) continue;
    const home = rows.get(homeId);
    const away = rows.get(awayId);
    if (!home || !away) continue;

    home.goals_for += match.home_score;
    home.goals_against += match.away_score;
    away.goals_for += match.away_score;
    away.goals_against += match.home_score;

    if (match.home_score > match.away_score) {
      home.won += 1;
      away.lost += 1;
    } else if (match.home_score < match.away_score) {
      away.won += 1;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
    }
  }

  return [...rows.values()].map((row) => {
    const finished = finishStanding(row);
    return { ...finished, points: suggestPoints(finished) };
  });
}

export function sortStandings(rows: StandingRow[]) {
  return [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goal_diff !== a.goal_diff) return b.goal_diff - a.goal_diff;
    if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;
    return a.team_id.localeCompare(b.team_id);
  });
}

export function buildStandingsTable(
  teams: Team[],
  saved: StandingRow[],
  matches: SportsMatch[],
) {
  const computed = computeStandingsFromMatches(teams, matches);
  const savedMap = new Map(saved.map((row) => [row.team_id, finishStanding(row)]));
  const computedMap = new Map(computed.map((row) => [row.team_id, row]));
  const useSaved = saved.length > 0;

  const rows = teams.map((team) => {
    if (useSaved) return savedMap.get(team.id) ?? emptyStanding(team.id);
    return computedMap.get(team.id) ?? emptyStanding(team.id);
  });

  return sortStandings(rows);
}

export function formatDiff(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}
