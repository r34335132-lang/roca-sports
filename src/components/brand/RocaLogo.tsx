import { ROCA_LOGO_SRC } from "@/lib/brand";
import type { League } from "@/lib/types";

export function RocaLogo({
  className = "roca-logo",
  alt = "ROCA Sport",
}: {
  className?: string;
  alt?: string;
}) {
  return <img className={className} src={ROCA_LOGO_SRC} alt={alt} />;
}

export function LeagueMark({
  league,
  className = "league-mark",
}: {
  league: Pick<League, "name" | "logo_url">;
  className?: string;
}) {
  if (league.logo_url) {
    return <img className={className} src={league.logo_url} alt={league.name} />;
  }
  return (
    <span className={`${className} is-fallback`} aria-hidden="true">
      {league.name.slice(0, 2).toUpperCase()}
    </span>
  );
}
