import type { PlayerProfile, SportType } from "@/lib/types";

export type SportCardStat = {
  key: string;
  label: string;
  value: string | number;
};

export type SportCardConfig = {
  icon: string;
  accent: string;
  rarity: string;
  variant: "elite" | "rookie" | "mvp" | "team" | "endurance" | "classic";
  getStats: (profile: PlayerProfile) => SportCardStat[];
};

function stat(profile: PlayerProfile, key: string) {
  const raw = profile.stats as unknown as Record<string, unknown> | null;
  const value = raw?.[key];
  return typeof value === "number" || typeof value === "string" ? value : 0;
}

export const SPORT_CARD_CONFIG: Record<SportType | "default", SportCardConfig> = {
  flag: {
    icon: "🏈",
    accent: "#FF6A00",
    rarity: "AIR RAID",
    variant: "elite",
    getStats: (profile) => [
      { key: "touchdowns", label: "TD", value: stat(profile, "touchdowns") },
      { key: "interceptions", label: "INT", value: stat(profile, "interceptions") },
      { key: "sacks", label: "SACK", value: stat(profile, "sacks") },
    ],
  },
  soccer: {
    icon: "⚽",
    accent: "#b9ff00",
    rarity: "GOAL MACHINE",
    variant: "elite",
    getStats: (profile) => [
      { key: "goals", label: "GOLES", value: stat(profile, "goals") },
      { key: "assists", label: "AST", value: stat(profile, "assists") },
      { key: "games", label: "PJ", value: stat(profile, "games") },
    ],
  },
  basketball: {
    icon: "🏀",
    accent: "#0057FF",
    rarity: "COURT VISION",
    variant: "mvp",
    getStats: (profile) => [
      { key: "points", label: "PTS", value: stat(profile, "points") },
      { key: "rebounds", label: "REB", value: stat(profile, "rebounds") },
      { key: "assists", label: "AST", value: stat(profile, "assists") },
    ],
  },
  volleyball: {
    icon: "🏐",
    accent: "#FFD600",
    rarity: "NET FORCE",
    variant: "team",
    getStats: (profile) => [
      { key: "points", label: "PTS", value: stat(profile, "points") },
      { key: "blocks", label: "BLQ", value: stat(profile, "blocks") },
      { key: "aces", label: "ACES", value: stat(profile, "aces") },
    ],
  },
  boxing: {
    icon: "🥊",
    accent: "#E10600",
    rarity: "KNOCKOUT",
    variant: "mvp",
    getStats: (profile) => [
      { key: "knockouts", label: "KO", value: stat(profile, "mvp_count") },
      { key: "wins", label: "W", value: stat(profile, "games") },
      { key: "rounds", label: "RDS", value: stat(profile, "points") },
    ],
  },
  baseball: {
    icon: "⚾",
    accent: "#E10600",
    rarity: "CLUTCH HITTER",
    variant: "classic",
    getStats: (profile) => [
      { key: "hits", label: "HITS", value: stat(profile, "hits") },
      { key: "home_runs", label: "HR", value: stat(profile, "home_runs") },
      { key: "rbi", label: "RBI", value: stat(profile, "rbi") },
    ],
  },
  cycling: {
    icon: "🚴",
    accent: "#FC4C02",
    rarity: "ENDURANCE",
    variant: "endurance",
    getStats: (profile) => [
      { key: "distance", label: "KM", value: stat(profile, "cycling_total_distance_km") },
      { key: "activities", label: "RUTAS", value: stat(profile, "cycling_activity_count") },
      { key: "avg_speed", label: "VEL", value: stat(profile, "cycling_avg_speed_kmh") },
    ],
  },
  other: {
    icon: "🏆",
    accent: "#b9ff00",
    rarity: "ATHLETE",
    variant: "elite",
    getStats: (profile) => [
      { key: "games", label: "PJ", value: stat(profile, "games") },
      { key: "points", label: "PTS", value: stat(profile, "points") },
      { key: "mvp_count", label: "MVP", value: stat(profile, "mvp_count") },
    ],
  },
  default: {
    icon: "🏆",
    accent: "#b9ff00",
    rarity: "ATHLETE",
    variant: "elite",
    getStats: (profile) => [
      { key: "games", label: "PJ", value: stat(profile, "games") },
      { key: "points", label: "PTS", value: stat(profile, "points") },
      { key: "mvp_count", label: "MVP", value: stat(profile, "mvp_count") },
    ],
  },
};

export function getSportCardConfig(sport?: string | null) {
  return SPORT_CARD_CONFIG[(sport as SportType) ?? "default"] ?? SPORT_CARD_CONFIG.default;
}
