import { useEffect, useState } from "react";
import type { FlagCardPlayer, FlagRarity } from "@/lib/flagEvents";

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

type IconName = "calendar" | "clock" | "map-pin" | "zap" | "rotate-cw" | "rotate-ccw" | "arrow-left" | "arrow-right";

const PATHS: Record<IconName, string[]> = {
  calendar: ["M3 4h18v18H3z", "M16 2v4", "M8 2v4", "M3 10h18"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  "map-pin": ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  "rotate-cw": ["M23 4v6h-6", "M20.49 15a9 9 0 1 1-2.12-9.36L23 10"],
  "rotate-ccw": ["M1 4v6h6", "M3.51 15a9 9 0 1 0 2.13-9.36L1 10"],
  "arrow-left": ["M19 12H5", "M12 19l-7-7 7-7"],
  "arrow-right": ["M5 12h14", "M12 5l7 7-7 7"],
};

export function FlagIcon({ name, size = 14, filled = false }: { name: IconName; size?: number; filled?: boolean }) {
  return (
    <svg
      className="flag-icon"
      width={size}
      height={size}
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
