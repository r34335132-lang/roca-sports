import { getDefaultCommissionPct, supabase } from "@/lib/supabase";
import type {
  CardTemplate,
  League,
  LeagueInput,
  LeaguePricing,
  Matchday,
  Player,
  PlayerCard,
  PlayerInput,
  PlayerPayment,
  PlayerProfile,
  PlayerStats,
  SportsMatch,
  Team,
  TeamInput,
  TeamOfWeek,
} from "@/lib/types";

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.id ?? null;
}

export async function fetchLeagues() {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as League[];
}

export async function fetchLeaguesBySport(sport: string) {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("sport", sport)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as League[];
}

export async function fetchLeague(idOrSlug: string) {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      idOrSlug,
    );
  const column = isUuid ? "id" : "slug";
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq(column, idOrSlug)
    .maybeSingle();
  if (error) throw error;
  return data as League | null;
}

export async function fetchOwnedLeagues(ownerId: string) {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as League[];
}

export async function createLeague(input: LeagueInput) {
  const owner_id = await getCurrentUserId();
  const { data, error } = await supabase
    .from("leagues")
    .insert({ ...input, owner_id })
    .select("*")
    .single();
  if (error) throw error;
  await ensureDefaultTemplates((data as League).id);
  await ensureLeaguePricing((data as League).id, 80, getDefaultCommissionPct());
  return data as League;
}

export async function updateLeague(id: string, input: Partial<LeagueInput>) {
  const { data, error } = await supabase
    .from("leagues")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as League;
}

export async function fetchTeamsByLeague(leagueId: string) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Team[];
}

export async function createTeam(input: TeamInput) {
  const { data, error } = await supabase.from("teams").insert(input).select("*").single();
  if (error) throw error;
  return data as Team;
}

export async function fetchPlayersByLeague(leagueId: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*, teams(id,name,logo_url,primary_color,secondary_color), player_stats(*)")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Player[];
}

export async function fetchPlayersByAuthUser(userId: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*, leagues(*), teams(*), player_stats(*)")
    .eq("auth_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Array<
    Player & { leagues: League; teams: Team | null; player_stats: PlayerStats[] }
  >;
}

export async function fetchPlayerProfile(playerId: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*, leagues(*), teams(*), player_stats(*)")
    .eq("id", playerId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const raw = data as Player & {
    leagues: League;
    teams: Team | null;
    player_stats: PlayerStats[];
  };
  return {
    ...raw,
    league: raw.leagues,
    team: raw.teams,
    stats: raw.player_stats?.[0] ?? null,
  } as PlayerProfile;
}

export async function createPlayer(input: PlayerInput) {
  const code = await nextCredentialCode(input.league_id);
  const { data, error } = await supabase
    .from("players")
    .insert({ ...input, credential_code: code, status: input.status ?? "active" })
    .select("*")
    .single();
  if (error) throw error;

  const player = data as Player;
  const league = await fetchLeague(input.league_id);
  if (league) {
    await supabase.from("player_stats").insert({
      player_id: player.id,
      league_id: input.league_id,
      season: league.season,
    });
    const pricing = await fetchLeaguePricing(input.league_id);
    if (pricing) {
      await supabase.from("player_payments").insert({
        player_id: player.id,
        league_id: input.league_id,
        amount: pricing.fee_per_player,
        status: "pending",
      });
    }
  }
  return player;
}

export async function nextCredentialCode(leagueId: string) {
  const league = await fetchLeague(leagueId);
  const prefix = (league?.slug ?? "liga").replace(/-/g, "").slice(0, 6).toUpperCase();
  const season =
    (league?.season ?? new Date().getFullYear().toString()).replace(/\D/g, "").slice(0, 4) ||
    "2026";
  const { count, error } = await supabase
    .from("players")
    .select("id", { count: "exact", head: true })
    .eq("league_id", leagueId);
  if (error) throw error;
  return `${prefix}-PLAYER-${season}-${String((count ?? 0) + 1).padStart(4, "0")}`;
}

export async function fetchCardTemplates(leagueId: string) {
  const { data, error } = await supabase
    .from("card_templates")
    .select("*")
    .eq("league_id", leagueId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CardTemplate[];
}

export async function ensureDefaultTemplates(leagueId: string) {
  const existing = await fetchCardTemplates(leagueId);
  if (existing.length > 0) return existing;

  const templates = [
    {
      league_id: leagueId,
      name: "Upper Deck Elite",
      template_type: "upper_deck_elite",
      background_style: "gradient",
      is_default: true,
      layout_json: { logoPosition: "top-left", photoStyle: "cutout", frame: "metallic" },
    },
    {
      league_id: leagueId,
      name: "Rookie Card",
      template_type: "rookie_card",
      background_style: "solid_premium",
      is_default: false,
      layout_json: { logoPosition: "top-center", photoStyle: "vertical", badge: "ROOKIE" },
    },
    {
      league_id: leagueId,
      name: "MVP Edition",
      template_type: "mvp_edition",
      background_style: "gradient",
      is_default: false,
      layout_json: { logoPosition: "top-right", photoStyle: "full-card", badge: "MVP" },
    },
    {
      league_id: leagueId,
      name: "Team Identity",
      template_type: "team_identity",
      background_style: "sport_pattern",
      is_default: false,
      layout_json: { logoPosition: "top-left", photoStyle: "circular", teamWatermark: true },
    },
  ];

  const { data, error } = await supabase.from("card_templates").insert(templates).select("*");
  if (error) throw error;
  return (data ?? []) as CardTemplate[];
}

export async function fetchPlayerCredential(playerId: string) {
  const profile = await fetchPlayerProfile(playerId);
  if (!profile) return null;
  const { data: card } = await supabase
    .from("player_cards")
    .select("*")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const templates = await fetchCardTemplates(profile.league_id);
  const template =
    templates.find((t) => t.is_default) ?? templates[0] ?? null;
  return { profile, card: (card as PlayerCard | null) ?? null, template };
}

export async function ensureLeaguePricing(
  leagueId: string,
  feePerPlayer = 80,
  commissionPct = 50,
) {
  const existing = await fetchLeaguePricing(leagueId);
  if (existing) return existing;
  const { data, error } = await supabase
    .from("league_pricing")
    .insert({
      league_id: leagueId,
      fee_per_player: feePerPlayer,
      platform_commission_pct: commissionPct,
      currency: "MXN",
    })
    .select("*")
    .single();
  if (error) {
    // tabla opcional aún no migrada
    console.warn("league_pricing:", error.message);
    return null;
  }
  return data as LeaguePricing;
}

export async function fetchLeaguePricing(leagueId: string) {
  const { data, error } = await supabase
    .from("league_pricing")
    .select("*")
    .eq("league_id", leagueId)
    .maybeSingle();
  if (error) return null;
  return data as LeaguePricing | null;
}

export async function upsertLeaguePricing(
  leagueId: string,
  feePerPlayer: number,
  commissionPct: number,
) {
  const existing = await fetchLeaguePricing(leagueId);
  if (existing) {
    const { data, error } = await supabase
      .from("league_pricing")
      .update({
        fee_per_player: feePerPlayer,
        platform_commission_pct: commissionPct,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw error;
    return data as LeaguePricing;
  }
  return ensureLeaguePricing(leagueId, feePerPlayer, commissionPct);
}

export async function fetchPaymentsByLeague(leagueId: string) {
  const { data, error } = await supabase
    .from("player_payments")
    .select("*, players(id,full_name,number,credential_code)")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: false });
  if (error) return [] as PlayerPayment[];
  return (data ?? []) as PlayerPayment[];
}

export async function fetchAllPayments() {
  const { data, error } = await supabase
    .from("player_payments")
    .select("*, players(id,full_name,number,credential_code), leagues(id,name,sport)")
    .order("created_at", { ascending: false });
  if (error) return [] as PlayerPayment[];
  return (data ?? []) as PlayerPayment[];
}

export async function markPaymentPaid(paymentId: string) {
  const { data, error } = await supabase
    .from("player_payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", paymentId)
    .select("*")
    .single();
  if (error) throw error;
  return data as PlayerPayment;
}

export async function fetchMatchdays(leagueId: string) {
  const { data, error } = await supabase
    .from("matchdays")
    .select("*")
    .eq("league_id", leagueId)
    .order("number", { ascending: true });
  if (error) return [] as Matchday[];
  return (data ?? []) as Matchday[];
}

export async function createMatchday(input: {
  league_id: string;
  number: number;
  title: string;
  starts_at?: string | null;
}) {
  const { data, error } = await supabase
    .from("matchdays")
    .insert({ ...input, status: "scheduled" })
    .select("*")
    .single();
  if (error) throw error;
  return data as Matchday;
}

export async function fetchTeamOfWeek(leagueId: string) {
  const { data, error } = await supabase
    .from("team_of_week")
    .select("*")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data as TeamOfWeek | null;
}

export async function upsertTeamOfWeek(input: {
  league_id: string;
  title: string;
  week_label: string;
  player_ids: string[];
  matchday_id?: string | null;
}) {
  const { data, error } = await supabase
    .from("team_of_week")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as TeamOfWeek;
}

export async function fetchLiveMatches(leagueId?: string) {
  let query = supabase
    .from("sports_matches")
    .select("*")
    .order("starts_at", { ascending: true });
  if (leagueId) query = query.eq("league_id", leagueId);
  const { data, error } = await query;
  if (error) return [] as SportsMatch[];
  return (data ?? []) as SportsMatch[];
}

export async function countAllPlayers() {
  const { count, error } = await supabase
    .from("players")
    .select("id", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function uploadLeagueAsset(file: File, folder: string) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("league-assets").upload(path, file, {
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("league-assets").getPublicUrl(path);
  return data.publicUrl;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export { calcBudget } from "@/lib/finance";
