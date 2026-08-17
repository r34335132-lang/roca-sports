export function splitPlayerName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "PLAYER", last: "ROCA" };
  if (parts.length === 1) return { first: "", last: parts[0].toUpperCase() };
  return {
    first: parts.slice(0, -1).join(" ").toUpperCase(),
    last: parts[parts.length - 1].toUpperCase(),
  };
}

export function validatePlayerForm(input: {
  full_name: string;
  number: string;
  position: string;
}) {
  const errors: string[] = [];
  if (input.full_name.trim().length < 2) errors.push("Escribe el nombre del jugador.");
  if (!input.number.trim()) errors.push("El número de camiseta es obligatorio.");
  if (!input.position.trim()) errors.push("Elige una posición.");
  return errors;
}

export const SPORT_POSITIONS: Record<string, string[]> = {
  basketball: ["PG", "SG", "SF", "PF", "C"],
  soccer: ["POR", "DEF", "MED", "DEL"],
  boxing: ["MOSCA", "PLUMA", "LIGERO", "WELTER", "MEDIO", "PESADO"],
  flag: ["QB", "WR", "RB", "LB", "DB", "C"],
  baseball: ["P", "C", "1B", "2B", "3B", "SS", "OF"],
  volleyball: ["ARM", "OP", "CEN", "LIB", "REC"],
  cycling: ["RUTA", "PISTA", "MTB"],
  other: ["ATH"],
};
