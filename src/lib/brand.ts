export const ROCA_LOGO_SRC = "/brand/roca-logo.png";

export const ROCA_BRAND_COLORS = {
  lime: "#b9ff00",
  charcoal: "#121212",
  metal: "#c0c0c0",
  slate: "#333333",
} as const;

export function hexColor(value: string | null | undefined, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value ?? "") ? (value as string) : fallback;
}
