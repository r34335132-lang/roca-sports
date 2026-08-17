import { clampPct } from "@/lib/finance";

export type Collaborator = {
  id: string;
  name: string;
  role: string;
  pct: number;
};

const STORAGE_KEY = "roca-sports-collaborators";

export const DEFAULT_COLLABORATORS: Collaborator[] = [
  { id: "dir", name: "Dirección", role: "Fundador", pct: 40 },
  { id: "ops", name: "Operaciones", role: "Ligas y cobros", pct: 35 },
  { id: "com", name: "Comunidad", role: "Eventos y redes", pct: 25 },
];

function uid() {
  return `col-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function loadCollaborators(): Collaborator[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_COLLABORATORS;
    const parsed = JSON.parse(raw) as Collaborator[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_COLLABORATORS;
    return parsed.map((c) => ({
      id: String(c.id || uid()),
      name: String(c.name || "Colaborador"),
      role: String(c.role || "Staff"),
      pct: clampPct(Number(c.pct) || 0),
    }));
  } catch {
    return DEFAULT_COLLABORATORS;
  }
}

export function saveCollaborators(list: Collaborator[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function emptyCollaborator(): Collaborator {
  return { id: uid(), name: "", role: "Staff", pct: 0 };
}

export function totalPct(list: Collaborator[]) {
  return list.reduce((acc, c) => acc + clampPct(c.pct), 0);
}

export function collaboratorCuts(list: Collaborator[], pool: number) {
  const cuts = list.map((c) => {
    const pct = clampPct(c.pct);
    return {
      ...c,
      pct,
      amount: Math.round((pool * pct) / 100),
    };
  });
  const assigned = cuts.reduce((acc, c) => acc + c.amount, 0);
  const remainder = pool - assigned;
  return { cuts, assigned, remainder, totalPct: totalPct(list) };
}
