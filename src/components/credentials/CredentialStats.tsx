import { getSportCardConfig } from "@/lib/cardSportConfig";
import type { PlayerProfile } from "@/lib/types";

export function CredentialStatsStrip({ profile }: { profile: PlayerProfile }) {
  const stats = getSportCardConfig(profile.league.sport).getStats(profile);

  return (
    <div className="pass-stats">
      {stats.map((item) => (
        <div key={item.key}>
          <span>{item.label}</span>
          <i>{item.value}</i>
        </div>
      ))}
    </div>
  );
}

export function PlayerStatsBoard({ profile }: { profile: PlayerProfile }) {
  const stats = getSportCardConfig(profile.league.sport).getStats(profile);

  return (
    <div className="cred-stats-board">
      <p className="eyebrow">Estadísticas</p>
      <div className="cred-stats-grid">
        {stats.map((item) => (
          <article key={item.key}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
