import { getSportCardConfig } from "@/lib/cardSportConfig";
import type { CardTemplate, PlayerProfile } from "@/lib/types";
import { QRCredentialBlock } from "./QRCredentialBlock";

export function PlayerCardPreview({
  profile,
  template,
}: {
  profile: PlayerProfile;
  template?: CardTemplate | null;
}) {
  const league = profile.league;
  const sportConfig = getSportCardConfig(league.sport);
  const accent = league.accent_color ?? sportConfig.accent;
  const primary = league.primary_color ?? "#101010";
  const secondary = league.secondary_color ?? "#050505";
  const stats = sportConfig.getStats(profile).slice(0, 3);
  const templateType = template?.template_type ?? "upper_deck_elite";
  const isMvp = templateType === "mvp_edition" || sportConfig.variant === "mvp";
  const isRookie = templateType === "rookie_card";
  const isEndurance = sportConfig.variant === "endurance";

  const gradient = isMvp
    ? "linear-gradient(145deg, #4A3300, #0A0A0A, #1D1600)"
    : isEndurance
      ? `linear-gradient(145deg, #2A1200, ${primary}ee, #050505)`
      : `linear-gradient(145deg, ${primary}ee, ${secondary}, #050505)`;

  return (
    <article className="upper-deck" style={{ ["--ud-accent" as string]: accent }}>
      <div className="upper-deck-frame" style={{ background: gradient }}>
        <span className="ud-texture">{template?.name ?? "UPPER DECK"}</span>
        <div className="ud-top">
          <div className="ud-logo">
            {league.logo_url ? (
              <img src={league.logo_url} alt={league.name} />
            ) : (
              <span>{sportConfig.icon}</span>
            )}
          </div>
          <span className={`ud-badge ${isMvp ? "gold" : ""}`}>
            {isMvp ? "MVP" : isRookie ? "ROOKIE" : sportConfig.rarity}
          </span>
        </div>

        <div className="ud-photo">
          {profile.photo_url ? (
            <img src={profile.photo_url} alt={profile.full_name} />
          ) : (
            <div className="ud-photo-fallback">👤</div>
          )}
          <span className="ud-number" style={{ color: `${accent}33` }}>
            {profile.number}
          </span>
        </div>

        <div className="ud-nameplate">
          <h3>{profile.full_name.toUpperCase()}</h3>
          <p>
            #{profile.number} · {profile.position.toUpperCase()} ·{" "}
            {profile.team?.name?.toUpperCase() ?? "SIN EQUIPO"}
          </p>
        </div>

        <div className="ud-stats">
          {stats.map((item) => (
            <div key={item.key} className="ud-stat" style={{ borderColor: `${accent}55` }}>
              <span>{item.label}</span>
              <strong style={{ color: accent }}>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="ud-footer">
          <span>{league.season}</span>
          <QRCredentialBlock code={profile.credential_code} accent={accent} size={56} />
        </div>
      </div>
    </article>
  );
}
