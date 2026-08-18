export type SportType =
  | "soccer"
  | "flag"
  | "basketball"
  | "baseball"
  | "volleyball"
  | "boxing"
  | "cycling"
  | "other";

export type LeagueCategory =
  | "varonil"
  | "femenil"
  | "mixto"
  | "infantil"
  | "juvenil"
  | "libre";

export type VisualStyle =
  | "modern"
  | "upper_deck"
  | "urban"
  | "minimal"
  | "classic";

export type UserRole = "admin" | "owner" | "player" | "guest";

export type League = {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  city: string;
  state: string;
  sport: SportType;
  category: LeagueCategory;
  season: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  visual_style: VisualStyle;
  public_profiles_enabled?: boolean | null;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  league_id: string;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  coach_name: string | null;
  created_at: string;
};

export type Player = {
  id: string;
  league_id: string;
  team_id: string | null;
  auth_user_id: string | null;
  full_name: string;
  nickname: string | null;
  number: string;
  position: string;
  birth_date: string | null;
  photo_url: string | null;
  status: "active" | "pending" | "suspended";
  credential_code: string;
  created_at: string;
  updated_at: string;
  teams?: Pick<Team, "id" | "name" | "logo_url" | "primary_color" | "secondary_color"> | null;
  player_stats?: PlayerStats[];
};

export type PlayerStats = {
  id: string;
  player_id: string;
  league_id: string;
  season: string;
  games: number;
  points: number;
  touchdowns: number;
  goals: number;
  assists: number;
  tackles: number;
  interceptions: number;
  mvp_count: number;
  receptions?: number | null;
  passing_yards?: number | null;
  rushing_yards?: number | null;
  sacks?: number | null;
  minutes_played?: number | null;
  yellow_cards?: number | null;
  red_cards?: number | null;
  rebounds?: number | null;
  steals?: number | null;
  blocks?: number | null;
  aces?: number | null;
  sets_played?: number | null;
  hits?: number | null;
  runs?: number | null;
  home_runs?: number | null;
  rbi?: number | null;
  batting_average?: number | null;
  cycling_total_distance_km?: number | null;
  cycling_activity_count?: number | null;
  cycling_avg_speed_kmh?: number | null;
  created_at: string;
  updated_at: string;
};

export type CardTemplate = {
  id: string;
  league_id: string;
  name: string;
  template_type: string;
  background_style: string;
  layout_json: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
};

export type PlayerCard = {
  id: string;
  player_id: string;
  league_id: string;
  template_id: string | null;
  image_url: string | null;
  card_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type PlayerProfile = Player & {
  league: League;
  team: Team | null;
  stats: PlayerStats | null;
};

export type LeaguePricing = {
  id: string;
  league_id: string;
  fee_per_player: number;
  platform_commission_pct: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type PlayerPayment = {
  id: string;
  player_id: string;
  league_id: string;
  amount: number;
  status: "pending" | "paid" | "waived" | "overdue";
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  players?: Pick<Player, "id" | "full_name" | "number" | "credential_code"> | null;
  leagues?: Pick<League, "id" | "name" | "sport"> | null;
};

export type Matchday = {
  id: string;
  league_id: string;
  number: number;
  title: string;
  starts_at: string | null;
  status: "scheduled" | "live" | "finished";
  created_at: string;
};

export type TeamOfWeek = {
  id: string;
  league_id: string;
  matchday_id: string | null;
  title: string;
  week_label: string;
  player_ids: string[];
  created_at: string;
};

export type SportsMatch = {
  id: string;
  league_id: string;
  home_team_id: string | null;
  away_team_id: string | null;
  sport: string;
  title: string | null;
  venue: string | null;
  status: "scheduled" | "live" | "final" | "cancelled";
  starts_at: string | null;
  minute: number | null;
  home_score: number;
  away_score: number;
  created_by: string | null;
  home_team?: Pick<Team, "id" | "name" | "logo_url"> | null;
  away_team?: Pick<Team, "id" | "name" | "logo_url"> | null;
};

export type SportsMatchInput = {
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  sport: string;
  title?: string | null;
  venue?: string | null;
  status?: SportsMatch["status"];
  starts_at?: string | null;
  home_score?: number;
  away_score?: number;
};

export type LeagueInput = {
  name: string;
  slug: string;
  city: string;
  state: string;
  sport: SportType;
  category: LeagueCategory;
  season: string;
  description?: string;
  logo_url?: string | null;
  banner_url?: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  visual_style: VisualStyle;
  public_profiles_enabled?: boolean;
};

export type TeamInput = {
  league_id: string;
  name: string;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  coach_name?: string | null;
};

export type PlayerInput = {
  league_id: string;
  team_id?: string | null;
  full_name: string;
  nickname?: string | null;
  number: string;
  position: string;
  birth_date?: string | null;
  photo_url?: string | null;
  status?: "active" | "pending" | "suspended";
};

export const SPORT_OPTIONS: SportType[] = [
  "soccer",
  "basketball",
  "boxing",
  "flag",
  "baseball",
  "volleyball",
  "cycling",
  "other",
];

export const CATEGORY_OPTIONS: LeagueCategory[] = [
  "varonil",
  "femenil",
  "mixto",
  "infantil",
  "juvenil",
  "libre",
];

export const SPORT_LABELS: Record<SportType | string, string> = {
  soccer: "Fútbol",
  flag: "Flag Football",
  basketball: "Básquetbol",
  baseball: "Béisbol",
  volleyball: "Voleibol",
  boxing: "Box",
  cycling: "Ciclismo",
  other: "Otro",
};

export const SPORT_IMAGES: Record<string, string> = {
  soccer:
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80",
  flag: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1400&q=80",
  basketball:
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80",
  baseball:
    "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1400&q=80",
  volleyball:
    "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1400&q=80",
  boxing:
    "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1400&q=80",
  cycling:
    "https://images.unsplash.com/photo-1517649763962-0c623066027b?auto=format&fit=crop&w=1400&q=80",
  other:
    "https://images.unsplash.com/photo-1461896833974-ffe9f0cb4a1e?auto=format&fit=crop&w=1400&q=80",
};

export const SPORT_ATHLETES: Record<string, string> = {
  soccer:
    "https://images.unsplash.com/photo-1606925797300-0b35e9d1794d?auto=format&fit=crop&w=900&q=80",
  basketball:
    "https://images.unsplash.com/photo-1519861531473-04c8755e09e8?auto=format&fit=crop&w=900&q=80",
  boxing:
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
  flag: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=900&q=80",
  baseball:
    "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=900&q=80",
  volleyball:
    "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80",
  cycling:
    "https://images.unsplash.com/photo-1517649763962-0c623066027b?auto=format&fit=crop&w=900&q=80",
  other:
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80",
};
