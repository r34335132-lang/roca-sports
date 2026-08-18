import { describe, expect, it } from "vitest";
import type { SportsMatch, Team } from "@/lib/types";
import {
  applyStandingValue,
  buildStandingsTable,
  computeStandingsFromMatches,
  formatDiff,
  getStandingFields,
  sortStandings,
  suggestPoints,
} from "./standings";

function team(id: string, name: string): Team {
  return {
    id,
    league_id: "liga-1",
    name,
    logo_url: null,
    primary_color: null,
    secondary_color: null,
    coach_name: null,
    created_at: "",
  };
}

function match(
  home: string,
  away: string,
  homeScore: number,
  awayScore: number,
  status: SportsMatch["status"] = "final",
): SportsMatch {
  return {
    id: `${home}-${away}`,
    league_id: "liga-1",
    home_team_id: home,
    away_team_id: away,
    sport: "soccer",
    title: null,
    venue: null,
    status,
    starts_at: null,
    minute: null,
    home_score: homeScore,
    away_score: awayScore,
    created_by: null,
  };
}

describe("tabla de fútbol", () => {
  it("trae las columnas JJ JG JE JP GF GC DIF PGP PUNTOS", () => {
    const shorts = getStandingFields("soccer").map((f) => f.short);
    expect(shorts).toEqual(["JJ", "JG", "JE", "JP", "GF", "GC", "DIF", "PGP", "PUNTOS"]);
  });

  it("arma JJ, DIF y puntos al cargar JG/JE/JP/GF/GC", () => {
    const row = applyStandingValue(
      applyStandingValue(
        applyStandingValue(
          applyStandingValue(
            applyStandingValue(
              {
                team_id: "roca",
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goals_for: 0,
                goals_against: 0,
                goal_diff: 0,
                penalty_wins: 0,
                points: 0,
              },
              "won",
              4,
            ),
            "drawn",
            1,
          ),
          "lost",
          2,
        ),
        "goals_for",
        12,
      ),
      "goals_against",
      8,
    );
    expect(row.played).toBe(7);
    expect(row.goal_diff).toBe(4);
    expect(suggestPoints(row)).toBe(13);
    expect(formatDiff(row.goal_diff)).toBe("+4");
  });

  it("calcula la tabla desde partidos finales", () => {
    const teams = [team("a", "ROCA"), team("b", "Águilas"), team("c", "Norte")];
    const rows = computeStandingsFromMatches(teams, [
      match("a", "b", 2, 1),
      match("a", "c", 1, 1),
      match("b", "c", 0, 3),
      match("a", "b", 0, 0, "scheduled"),
    ]);
    const roca = rows.find((r) => r.team_id === "a")!;
    const aguilas = rows.find((r) => r.team_id === "b")!;
    const norte = rows.find((r) => r.team_id === "c")!;

    expect(roca.played).toBe(2);
    expect(roca.won).toBe(1);
    expect(roca.drawn).toBe(1);
    expect(roca.goals_for).toBe(3);
    expect(roca.goals_against).toBe(2);
    expect(roca.goal_diff).toBe(1);
    expect(roca.points).toBe(4);

    expect(aguilas.won).toBe(0);
    expect(aguilas.lost).toBe(2);
    expect(aguilas.points).toBe(0);

    expect(norte.won).toBe(1);
    expect(norte.drawn).toBe(1);
    expect(norte.points).toBe(4);
  });

  it("ordena por puntos, luego diferencia, luego goles a favor", () => {
    const ranked = sortStandings([
      { team_id: "x", played: 2, won: 1, drawn: 0, lost: 1, goals_for: 5, goals_against: 4, goal_diff: 1, penalty_wins: 0, points: 3 },
      { team_id: "y", played: 2, won: 1, drawn: 0, lost: 1, goals_for: 2, goals_against: 1, goal_diff: 1, penalty_wins: 0, points: 3 },
      { team_id: "z", played: 2, won: 2, drawn: 0, lost: 0, goals_for: 4, goals_against: 0, goal_diff: 4, penalty_wins: 0, points: 6 },
    ]);
    expect(ranked.map((r) => r.team_id)).toEqual(["z", "x", "y"]);
  });

  it("si el admin ya guardó números, esos mandan sobre el cálculo", () => {
    const teams = [team("a", "ROCA"), team("b", "Águilas")];
    const table = buildStandingsTable(
      teams,
      [
        {
          team_id: "a",
          played: 5,
          won: 5,
          drawn: 0,
          lost: 0,
          goals_for: 10,
          goals_against: 1,
          goal_diff: 9,
          penalty_wins: 1,
          points: 16,
        },
      ],
      [match("a", "b", 1, 0)],
    );
    expect(table[0].team_id).toBe("a");
    expect(table[0].points).toBe(16);
    expect(table[0].penalty_wins).toBe(1);
    expect(table[1].points).toBe(0);
  });
});
