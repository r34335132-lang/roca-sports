import { getSportCardConfig } from "@/lib/cardSportConfig";
import { SPORT_ATHLETES, SPORT_LABELS } from "@/lib/types";
import type { CardTemplate, PlayerProfile } from "@/lib/types";

export function PlayerCardPreview({
  profile,
  template,
}: {
  profile: PlayerProfile;
  template?: CardTemplate | null;
}) {
  const league = profile.league;
  const sport = league.sport || "other";
  const sportConfig = getSportCardConfig(sport);
  const accent = league.accent_color ?? sportConfig.accent;
  const stats = sportConfig.getStats(profile).slice(0, 3);
  const templateType = template?.template_type ?? "upper_deck_elite";
  const isMvp = templateType === "mvp_edition" || sportConfig.variant === "mvp";
  const isRookie = templateType === "rookie_card";
  const isBoxing = sport === "boxing";
  const photo =
    profile.photo_url || SPORT_ATHLETES[sport] || SPORT_ATHLETES.other;
  const rarity = isBoxing
    ? "KNOCKOUT"
    : isMvp
      ? "MVP"
      : isRookie
        ? "ROOKIE"
        : sportConfig.rarity;

  return (
    <article
      className={`ud-card sport-${sport} ${isBoxing ? "is-boxing" : ""} ${isMvp ? "is-mvp" : ""}`}
      style={{ ["--ud-accent" as string]: accent }}
    >
      <div className="ud-foil">
        <div className="ud-inner">
          <div className="ud-hero">
            <img src={photo} alt={profile.full_name} />
            <span className="ud-holo" aria-hidden="true" />
            <span className="ud-grain" aria-hidden="true" />
            <div className="ud-hero-top">
              <span className="ud-mark">
                {sportConfig.icon} ROCA
              </span>
              <span className={`ud-rarity ${isMvp || isBoxing ? "gold" : ""}`}>{rarity}</span>
            </div>
            <b className="ud-jersey">{profile.number}</b>
            <div className="ud-id">
              <em>{SPORT_LABELS[sport] ?? sport}</em>
              <h3>{profile.full_name}</h3>
              <p>
                {profile.position} · {profile.team?.name ?? "Free Agent"}
              </p>
            </div>
          </div>
          <div className="ud-bar">
            {stats.map((item) => (
              <div key={item.key} className="ud-stat">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
            <div className="ud-year">
              <span>SZN</span>
              <strong>{league.season.replace(/[^\d]/g, "").slice(-2) || "26"}</strong>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
