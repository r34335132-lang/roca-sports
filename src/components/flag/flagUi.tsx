import { useEffect, useState, type CSSProperties } from "react";
import { FEDERATION_LOGOS, type FlagCardEdition, type FlagCardPlayer, type FlagRarity } from "@/lib/flagEvents";

export function FederationLogos({ className }: { className: string }) {
  return (
    <>
      {FEDERATION_LOGOS.map((f) => (
        <span key={f.short} className={`${className} is-${f.short.toLowerCase()}`} title={f.name}>
          <img src={f.src} alt={`${f.short}: ${f.name}`} draggable={false} />
        </span>
      ))}
    </>
  );
}

export const RARITY_LABEL: Record<FlagRarity, string> = {
  base: "Base",
  oro: "Oro",
  prizm: "Prizm",
  leyenda: "Leyenda",
};

export const RARITY_INK: Record<FlagRarity, string> = {
  base: "#e6e8eb",
  oro: "#f0c419",
  prizm: "#b9ff00",
  leyenda: "#ff2e93",
};

export const RARITY_FOIL: Record<FlagRarity, string[]> = {
  base: ["#8e959f", "#f4f5f7", "#5f6670", "#e6e8eb"],
  oro: ["#f0c419", "#fff4b0", "#a8770a", "#ffe066"],
  prizm: ["#b9ff00", "#00e5ff", "#ff3df2", "#f0c419"],
  leyenda: ["#ff2e93", "#f0c419", "#00e5ff", "#8b5cf6"],
};

export const EDITION_LABEL: Record<FlagCardEdition, string> = {
  campeona: "Campeona",
  mvp: "MVP",
};

export const EDITION_INK: Record<FlagCardEdition, string> = {
  campeona: "#f0c419",
  mvp: "#ffe066",
};

export const EDITION_FOIL: Record<FlagCardEdition, string[]> = {
  campeona: ["#f0c419", "#7c3aed", "#fff4b0", "#a8770a", "#c084fc"],
  mvp: ["#fff4b0", "#f0c419", "#ff2e93", "#ffffff", "#00e5ff", "#f0c419"],
};

export function ratingColor(value: number) {
  if (value >= 90) return "#f0c419";
  if (value >= 80) return "#b9ff00";
  if (value >= 70) return "#f8faf5";
  return "#bfc8c6";
}

export function focusOf(player: FlagCardPlayer) {
  const { x = 0.5, y = 0.5, zoom = 1 } = player.photoFocus ?? {};
  return { x, y, zoom: Math.max(1, zoom) };
}

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reduce, setReduce] = useState(() => typeof window !== "undefined" && window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

type IconName =
  | "calendar"
  | "clock"
  | "map-pin"
  | "zap"
  | "rotate-cw"
  | "rotate-ccw"
  | "arrow-left"
  | "arrow-right"
  | "trophy"
  | "crown"
  | "star";

const PATHS: Record<IconName, string[]> = {
  calendar: ["M3 4h18v18H3z", "M16 2v4", "M8 2v4", "M3 10h18"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  "map-pin": ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  "rotate-cw": ["M23 4v6h-6", "M20.49 15a9 9 0 1 1-2.12-9.36L23 10"],
  "rotate-ccw": ["M1 4v6h6", "M3.51 15a9 9 0 1 0 2.13-9.36L1 10"],
  "arrow-left": ["M19 12H5", "M12 19l-7-7 7-7"],
  "arrow-right": ["M5 12h14", "M12 5l7 7-7 7"],
  trophy: [
    "M6 9H4.5a2.5 2.5 0 0 1 0-5H6",
    "M18 9h1.5a2.5 2.5 0 0 0 0-5H18",
    "M4 22h16",
    "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",
    "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",
    "M18 2H6v7a6 6 0 0 0 12 0V2Z",
  ],
  crown: ["M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z", "M5 20h14"],
  star: ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
};

export function FlagIcon({ name, size = 14, filled = false }: { name: IconName; size?: number; filled?: boolean }) {
  return (
    <svg
      className="flag-icon"
      width={size}
      height={size}
      style={{ "--icon-size": `${size}px`, "--icon-fill": filled ? "currentColor" : "none" } as CSSProperties}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
