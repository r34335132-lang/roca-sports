import { getSportCardConfig } from "@/lib/cardSportConfig";
import { splitPlayerName } from "@/lib/playerStudio";
import { SPORT_ATHLETES, SPORT_LABELS } from "@/lib/types";
import type { CardTemplate, PlayerProfile } from "@/lib/types";
import { SportMark } from "./SportMark";

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
  const photo = profile.photo_url || SPORT_ATHLETES[sport] || SPORT_ATHLETES.other;
  const { first, last } = splitPlayerName(profile.full_name);
  const rarity = isRookie ? "ROOKIE" : isMvp ? "GOLD" : sport === "basketball" ? "PRIZM" : sportConfig.rarity;
  const serial = profile.credential_code.slice(-4);

  return (
    <article
      className={`prizm-card sport-${sport} ${isMvp ? "is-gold" : ""} ${isRookie ? "is-rookie" : ""}`}
      style={{ ["--ud-accent" as string]: accent }}
    >
      <div className="prizm-chrome">
        <div className="prizm-cut">
          <div className="prizm-photo">
            <img src={photo} alt={profile.full_name} />
            <span className="prizm-refract" aria-hidden="true" />
            <span className="prizm-court" aria-hidden="true" />
          </div>
          <div className="prizm-top">
            <span className="prizm-brand">
              <SportMark sport={sport} />
              ROCA
            </span>
            <span className="prizm-parallel">{rarity}</span>
          </div>
          <span className="prizm-num">{profile.number}</span>
          <div className="prizm-plate">
            <em>
              {profile.team?.name ?? SPORT_LABELS[sport]} · {profile.position}
            </em>
            <strong>{last}</strong>
            {first && <b>{first}</b>}
          </div>
          <div className="prizm-stats">
            {stats.map((item) => (
              <div key={item.key}>
                <span>{item.label}</span>
                <i>{item.value}</i>
              </div>
            ))}
            <div>
              <span>NO.</span>
              <i>{serial}</i>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
