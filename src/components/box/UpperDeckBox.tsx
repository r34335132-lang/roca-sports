import { useEffect, useMemo, useState } from "react";
import { PlayerCardPreview } from "@/components/credentials/PlayerCardPreview";
import { getSportCardConfig } from "@/lib/cardSportConfig";
import type { League, PlayerProfile, SportType } from "@/lib/types";

const DEMO_SPORTS: SportType[] = ["soccer", "basketball", "volleyball", "flag"];

function demoProfile(sport: SportType, index: number): PlayerProfile {
  const cfg = getSportCardConfig(sport);
  const league: League = {
    id: `demo-${sport}`,
    owner_id: null,
    name: `ROCA ${sport.toUpperCase()}`,
    slug: `roca-${sport}`,
    city: "Durango",
    state: "Dgo",
    sport,
    category: "libre",
    season: "2026",
    description: null,
    logo_url: null,
    banner_url: null,
    primary_color: cfg.accent,
    secondary_color: "#0a0d0f",
    accent_color: cfg.accent,
    visual_style: "upper_deck",
    created_at: "",
    updated_at: "",
  };

  return {
    id: `p-${sport}`,
    league_id: league.id,
    team_id: null,
    auth_user_id: null,
    full_name: ["RIVERA", "MORALES", "CASTRO", "NÚÑEZ"][index % 4],
    nickname: null,
    number: String(7 + index * 3),
    position: ["DEL", "BASE", "OP", "WR"][index % 4],
    birth_date: null,
    photo_url: null,
    status: "active",
    credential_code: `ROCA-PLAYER-2026-000${index + 1}`,
    created_at: "",
    updated_at: "",
    league,
    team: {
      id: "t1",
      league_id: league.id,
      name: ["Tigres", "Lobos", "Águilas", "Panteras"][index % 4],
      logo_url: null,
      primary_color: null,
      secondary_color: null,
      coach_name: null,
      created_at: "",
    },
    stats: {
      id: "s1",
      player_id: `p-${sport}`,
      league_id: league.id,
      season: "2026",
      games: 8,
      points: 22,
      touchdowns: 5,
      goals: 9,
      assists: 4,
      tackles: 3,
      interceptions: 2,
      mvp_count: 1,
      sacks: 2,
      rebounds: 7,
      blocks: 3,
      aces: 5,
      hits: 12,
      home_runs: 2,
      rbi: 8,
      cycling_total_distance_km: 42,
      cycling_activity_count: 6,
      cycling_avg_speed_kmh: 28,
      created_at: "",
      updated_at: "",
    },
  };
}

export function UpperDeckBox({ profiles }: { profiles?: PlayerProfile[] }) {
  const [opened, setOpened] = useState(false);
  const [phase, setPhase] = useState<"idle" | "open" | "clash" | "reveal">("idle");

  const cards = useMemo(
    () => profiles?.slice(0, 4) ?? DEMO_SPORTS.map((s, i) => demoProfile(s, i)),
    [profiles],
  );

  useEffect(() => {
    if (!opened) {
      setPhase("idle");
      return;
    }
    setPhase("open");
    const t1 = window.setTimeout(() => setPhase("clash"), 520);
    const t2 = window.setTimeout(() => setPhase("reveal"), 1100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [opened]);

  return (
    <section className={`ud-box ${phase}`} aria-label="Box Upper Deck">
      <div className="ud-box-stage">
        <button
          type="button"
          className="ud-box-lid"
          onClick={() => setOpened(true)}
          disabled={opened && phase !== "reveal"}
        >
          <span>ROCA</span>
          <strong>UPPER DECK BOX</strong>
          <em>{opened ? "Abriendo..." : "Abrir box"}</em>
        </button>

        <div className="ud-box-cards">
          {cards.map((profile, i) => (
            <div
              key={profile.id}
              className={`ud-box-card c${i}`}
              style={{ ["--i" as string]: i }}
            >
              <PlayerCardPreview profile={profile} />
            </div>
          ))}
        </div>
      </div>
      {phase === "reveal" && (
        <p className="ud-box-caption">Las Upper Deck chocan y revelan cada deporte con su logo y rareza.</p>
      )}
      {opened && phase === "reveal" && (
        <button className="btn btn-outline" type="button" onClick={() => setOpened(false)}>
          Reiniciar box
        </button>
      )}
    </section>
  );
}
