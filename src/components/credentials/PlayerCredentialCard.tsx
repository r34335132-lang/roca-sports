import { LeagueMark, RocaLogo } from "@/components/brand/RocaLogo";
import { CredentialStatsStrip } from "@/components/credentials/CredentialStats";
import { hexColor } from "@/lib/brand";
import { SPORT_ATHLETES, SPORT_LABELS } from "@/lib/types";
import type { PlayerProfile } from "@/lib/types";
import { QRCredentialBlock } from "./QRCredentialBlock";

export function PlayerCredentialCard({ profile }: { profile: PlayerProfile }) {
  const accent = hexColor(profile.league.accent_color, "#b9ff00");
  const primary = hexColor(profile.league.primary_color, "#121212");
  const secondary = hexColor(profile.league.secondary_color, "#333333");
  const photo =
    profile.photo_url || SPORT_ATHLETES[profile.league.sport] || SPORT_ATHLETES.other;

  return (
    <article
      className="pass-card"
      style={{
        ["--pass-accent" as string]: accent,
        ["--pass-primary" as string]: primary,
        ["--pass-secondary" as string]: secondary,
      }}
    >
      <div className="pass-holo" aria-hidden="true" />
      <header className="pass-head">
        <div className="pass-brand">
          <LeagueMark league={profile.league} />
          <div>
            <span>{profile.league.name}</span>
            <strong>PLAYER PASS</strong>
          </div>
        </div>
        <div className="pass-roca">
          <RocaLogo className="roca-logo xs" />
          <em>{profile.league.season}</em>
        </div>
      </header>
      <div className="pass-body">
        <div className="pass-photo">
          <img src={photo} alt={profile.full_name} />
          <b>#{profile.number}</b>
        </div>
        <div className="pass-meta">
          <p>Jugador</p>
          <h3>{profile.full_name}</h3>
          <ul>
            <li>
              <span>Liga</span>
              <strong>{profile.league.name}</strong>
            </li>
            <li>
              <span>Deporte</span>
              <strong>{SPORT_LABELS[profile.league.sport] ?? profile.league.sport}</strong>
            </li>
            <li>
              <span>Equipo</span>
              <strong>{profile.team?.name ?? "Free agent"}</strong>
            </li>
            <li>
              <span>Posición</span>
              <strong>{profile.position}</strong>
            </li>
          </ul>
        </div>
      </div>
      <CredentialStatsStrip profile={profile} />
      <footer className="pass-foot">
        <QRCredentialBlock code={profile.credential_code} accent={accent} size={64} />
        <div>
          <span>ID de credencial</span>
          <code>{profile.credential_code}</code>
          <small className="powered-line">Impulsado por ROCA Sport</small>
        </div>
      </footer>
    </article>
  );
}
