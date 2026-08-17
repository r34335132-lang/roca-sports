import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { UserRole } from "@/lib/types";

const ADMIN_ROLES = new Set([
  "admin",
  "administrador",
  "superadmin",
  "super_admin",
  "platform_admin",
]);

export function dashboardPath(role: UserRole) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "player") return "/dashboard/jugador";
  if (role === "guest") return "/auth";
  return "/dashboard/dueno";
}

function normalizeRole(raw: unknown): UserRole | null {
  const value = String(raw ?? "").toLowerCase().trim();
  if (ADMIN_ROLES.has(value)) return "admin";
  if (value === "player" || value === "jugador") return "player";
  if (value === "owner" || value === "dueno" || value === "dueño") return "owner";
  return null;
}

function roleFromRow(row: Record<string, unknown> | null): UserRole | null {
  if (!row) return null;
  if (row.is_admin === true || row.admin === true) return "admin";
  return normalizeRole(row.role ?? row.user_role);
}

async function ensureProfile(user: User) {
  const fullName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    user.email?.split("@")[0] ||
    "";
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: fullName,
    },
    { onConflict: "id" },
  );
}

export async function fetchProfileRole(user: User): Promise<UserRole | null> {
  await ensureProfile(user);

  const { data: rpcRole } = await supabase.rpc("my_platform_role");
  const fromRpc = normalizeRole(rpcRole);
  if (fromRpc) return fromRpc;

  const tries = [
    () => supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    () =>
      supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email ?? "")
        .maybeSingle(),
    () => supabase.from("user_roles").select("*").eq("user_id", user.id).maybeSingle(),
  ];

  for (const run of tries) {
    const { data, error } = await run();
    if (error || !data) continue;
    const role = roleFromRow(data as Record<string, unknown>);
    if (role) return role;
  }

  return null;
}

export function resolveRole(params: {
  user: User | null;
  profileRole: UserRole | null;
  ownedLeagueCount: number;
  playerCount: number;
}): UserRole {
  if (!params.user) return "guest";
  if (params.profileRole === "admin") return "admin";
  if (params.ownedLeagueCount > 0 || params.profileRole === "owner") return "owner";
  if (params.profileRole === "player" || params.playerCount > 0) return "player";
  return "owner";
}
