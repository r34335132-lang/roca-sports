import { useEffect, useMemo, useState } from "react";
import { PlayerCardPreview } from "@/components/credentials/PlayerCardPreview";
import { getSportCardConfig } from "@/lib/cardSportConfig";
import type { League, PlayerProfile, SportType } from "@/lib/types";

const DEMO_SPORTS: SportType[] = ["soccer", "basketball", "boxing", "flag"];

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

  const names = ["RIVERA", "MORALES", "CASTRO", "NÚÑEZ"];
  const positions = ["DEL", "BASE", "KO", "WR"];

  return {
    id: `p-${sport}`,
    league_id: league.id,
    team_id: null,
    auth_user_id: null,
    full_name: names[index % 4],
    nickname: sport === "boxing" ? "El Relámpago" : null,
    number: String(7 + index * 3),
    position: positions[index % 4],
    birth_date: null,
    photo_url:
      sport === "boxing"
        ? "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=70"
        : null,
    status: "active",
    credential_code: `ROCA-PLAYER-2026-000${index + 1}`,
    created_at: "",
    updated_at: "",
    league,
    team: {
      id: "t1",
      league_id: league.id,
      name: ["Tigres", "Lobos", "Corner Rojo", "Panteras"][index % 4],
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
      mvp_count: 4,
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
    <section className={`ud-box fight-box ${phase}`} aria-label="Box de boxeo Upper Deck">
      <div className="ud-box-stage ring-stage">
        <div className="ring-ropes" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span className="ring-corner tl">ROJO</span>
        <span className="ring-corner br">AZUL</span>
        <div className="ring-lights" aria-hidden="true" />

        <button
          type="button"
          className="ud-box-lid champ-pack"
          onClick={() => setOpened(true)}
          disabled={opened && phase !== "reveal"}
        >
          <span>ROCA</span>
          <strong>FIGHT NIGHT PACK</strong>
          <em>{opened ? "Campana..." : "Sube al ring"}</em>
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
        <p className="ud-box-caption">
          Pack de pelea: las Upper Deck chocan en el ring y revelan fútbol, básquet, box y flag.
        </p>
      )}
      {opened && phase === "reveal" && (
        <button className="btn btn-outline" type="button" onClick={() => setOpened(false)}>
          Otra pelea
        </button>
      )}
    </section>
  );
}
