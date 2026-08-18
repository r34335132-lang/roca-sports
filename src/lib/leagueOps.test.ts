import { describe, expect, it } from "vitest";
import type { Player } from "@/lib/types";
import {
  buildStatsPatch,
  emptyMatchForm,
  getStatFields,
  leaderStatKey,
  matchHeadline,
  matchStatusLabel,
  parseStatNumber,
  rankPlayers,
  toggleTotwPlayer,
  totwLimit,
  totwWeekLabel,
  validateMatchdayForm,
  validateMatchForm,
  validateTotw,
} from "./leagueOps";

function player(id: string, name: string, goals = 0, points = 0): Player {
  return {
    id,
    league_id: "liga-1",
    team_id: null,
    auth_user_id: null,
    full_name: name,
    nickname: null,
    number: "10",
    position: "DEL",
    birth_date: null,
    photo_url: null,
    status: "active",
    credential_code: `CODE-${id}`,
    created_at: "",
    updated_at: "",
    player_stats: [
      {
        id: `s-${id}`,
        player_id: id,
        league_id: "liga-1",
        season: "2026",
        games: 4,
        points,
        touchdowns: 0,
        goals,
        assists: 1,
        tackles: 0,
        interceptions: 0,
        mvp_count: 0,
        created_at: "",
        updated_at: "",
      },
    ],
  };
}

describe("estadísticas por deporte", () => {
  it("da campos de fútbol para cargar goles y tarjetas", () => {
    const fields = getStatFields("soccer").map((f) => f.key);
    expect(fields).toContain("goals");
    expect(fields).toContain("assists");
    expect(fields).toContain("yellow_cards");
  });

  it("arma el patch numérico que se guarda en player_stats", () => {
    const patch = buildStatsPatch(getStatFields("soccer"), {
      games: "8",
      goals: "12",
      assists: "",
      yellow_cards: -2,
      red_cards: "1",
      minutes_played: "720",
    });
    expect(patch.games).toBe(8);
    expect(patch.goals).toBe(12);
    expect(patch.assists).toBe(0);
    expect(patch.yellow_cards).toBe(0);
    expect(patch.red_cards).toBe(1);
  });

  it("ordena goleadores para el ranking público", () => {
    const ranked = rankPlayers(
      [player("a", "Ana", 2), player("b", "Beto", 9), player("c", "Cris", 4)],
      "goals",
      2,
    );
    expect(ranked.map((row) => row.player.full_name)).toEqual(["Beto", "Cris"]);
    expect(ranked[0].value).toBe(9);
  });

  it("elige la stat líder según el deporte", () => {
    expect(leaderStatKey("soccer")).toBe("goals");
    expect(leaderStatKey("boxing")).toBe("mvp_count");
    expect(leaderStatKey("basketball")).toBe("points");
  });
});

describe("rol de juegos", () => {
  it("rechaza un partido sin equipos o con el mismo club", () => {
    const base = emptyMatchForm();
    expect(validateMatchForm(base)).toBe("Elige el equipo local.");
    expect(
      validateMatchForm({ ...base, home_team_id: "t1" }),
    ).toBe("Elige el equipo visitante.");
    expect(
      validateMatchForm({ ...base, home_team_id: "t1", away_team_id: "t1" }),
    ).toBe("Local y visitante no pueden ser el mismo equipo.");
  });

  it("acepta un partido local vs visitante con marcador", () => {
    expect(
      validateMatchForm({
        ...emptyMatchForm(),
        home_team_id: "roca",
        away_team_id: "visitante",
        home_score: 2,
        away_score: 1,
      }),
    ).toBeNull();
  });

  it("arma el encabezado y el status para la cartelera", () => {
    expect(matchHeadline("ROCA FC", "Águilas")).toBe("ROCA FC vs Águilas");
    expect(matchHeadline("ROCA FC", "Águilas", "Clásico")).toBe("Clásico · ROCA FC vs Águilas");
    expect(matchStatusLabel("live")).toBe("En vivo");
    expect(matchStatusLabel("final")).toBe("Final");
  });

  it("valida la jornada antes de publicarla", () => {
    expect(validateMatchdayForm({ number: 0, title: "J1" })).toBe("La jornada debe ser 1 o mayor.");
    expect(validateMatchdayForm({ number: 1, title: " " })).toBe("Ponle nombre a la jornada.");
    expect(validateMatchdayForm({ number: 3, title: "Jornada 3" })).toBeNull();
  });
});

describe("equipo de la semana", () => {
  it("respeta el cupo según el deporte", () => {
    expect(totwLimit("soccer")).toBe(11);
    expect(totwLimit("basketball")).toBe(5);
    expect(totwLimit("boxing")).toBe(2);
  });

  it("agrega, quita y no se pasa del límite", () => {
    const first = toggleTotwPlayer([], "p1", 2);
    const full = toggleTotwPlayer(first, "p2", 2);
    const blocked = toggleTotwPlayer(full, "p3", 2);
    const removed = toggleTotwPlayer(full, "p1", 2);
    expect(full).toEqual(["p1", "p2"]);
    expect(blocked).toEqual(["p1", "p2"]);
    expect(removed).toEqual(["p2"]);
  });

  it("no publica un XI vacío", () => {
    expect(validateTotw([], 11)).toMatch(/al menos un jugador/i);
    expect(validateTotw(["p1", "p2"], 5)).toBeNull();
    expect(validateTotw(["a", "b", "c"], 2)).toMatch(/máximo/i);
  });

  it("etiqueta la semana con la jornada activa", () => {
    expect(totwWeekLabel(4)).toBe("Jornada 4");
    expect(totwWeekLabel()).toBe("Jornada 1");
  });
});

describe("parseStatNumber", () => {
  it("limpia basura y negativos", () => {
    expect(parseStatNumber("7")).toBe(7);
    expect(parseStatNumber("nope")).toBe(0);
    expect(parseStatNumber(-4)).toBe(0);
  });
});
