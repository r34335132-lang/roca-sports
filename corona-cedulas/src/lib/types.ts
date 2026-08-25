export type CedulaData = {
  nombre: string;
  equipo: string;
  categoria: string;
  posicion: string;
  numero: string;
  temporada: string;
  fotoUrl: string | null;
};

export const INITIAL_CEDULA: CedulaData = {
  nombre: "JUAN PÉREZ GARCÍA",
  equipo: "DEPORTIVO CORONA",
  categoria: "LIBRE",
  posicion: "DELANTERO",
  numero: "0000",
  temporada: "2026",
  fotoUrl: null,
};

export const EMPTY_CEDULA: CedulaData = {
  nombre: "",
  equipo: "",
  categoria: "",
  posicion: "",
  numero: "",
  temporada: "",
  fotoUrl: null,
};

export function createBlankCedulas(
  count: number,
  defaults: Partial<CedulaData> = {},
): CedulaData[] {
  const n = Math.max(1, Math.min(40, Math.floor(count)));
  return Array.from({ length: n }, () => ({
    ...EMPTY_CEDULA,
    ...defaults,
    fotoUrl: null,
  }));
}
