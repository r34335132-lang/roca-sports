import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anon && !url.includes("TU-PROYECTO"));

export const supabase: SupabaseClient = createClient(
  url || "https://placeholder.supabase.co",
  anon || "placeholder-anon-key",
);

export function getDefaultCommissionPct(): number {
  const raw = Number(import.meta.env.VITE_DEFAULT_COMMISSION_PCT ?? 50);
  return Number.isFinite(raw) ? raw : 50;
}
