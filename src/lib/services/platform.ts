import { DEFAULT_COLLABORATORS, type Collaborator } from "@/lib/collaborators";
import { clampPct } from "@/lib/finance";
import { supabase } from "@/lib/supabase";

function mapRow(row: Record<string, unknown>): Collaborator {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? "Colaborador"),
    role: String(row.role_label ?? row.role ?? "Staff"),
    pct: clampPct(Number(row.pct) || 0),
  };
}

export async function fetchPlatformCollaborators(): Promise<Collaborator[] | null> {
  const { data, error } = await supabase
    .from("platform_collaborators")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return null;
  const rows = (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  return rows.length ? rows : DEFAULT_COLLABORATORS;
}

export async function savePlatformCollaborators(list: Collaborator[]) {
  const payload = list
    .filter((c) => c.name.trim())
    .map((c) => ({
      id: c.id.startsWith("col-") ? undefined : c.id,
      name: c.name.trim(),
      role_label: c.role || "Staff",
      pct: clampPct(c.pct),
    }));

  const { error: delError } = await supabase
    .from("platform_collaborators")
    .delete()
    .neq("name", "__never__");
  if (delError) throw delError;

  if (payload.length === 0) return [];
  const { data, error } = await supabase
    .from("platform_collaborators")
    .insert(
      payload.map((row) => ({
        name: row.name,
        role_label: row.role_label,
        pct: row.pct,
      })),
    )
    .select("*");
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}
