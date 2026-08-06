import type { PlayerProfile } from "@/lib/types";
import { QRCredentialBlock } from "./QRCredentialBlock";

export function PlayerCredentialCard({ profile }: { profile: PlayerProfile }) {
  const accent = profile.league.accent_color ?? "#b9ff00";
  const primary = profile.league.primary_color ?? "#111719";
  const secondary = profile.league.secondary_color ?? "#050708";

  return (
    <article
      className="cred-card"
      style={{
        borderColor: `${accent}66`,
        background: `linear-gradient(145deg, ${primary}dd, ${secondary}, #050505)`,
      }}
    >
      <header className="cred-header" style={{ background: accent }}>
        <span>CREDENCIAL DIGITAL</span>
        <span>{profile.league.season}</span>
      </header>
      <div className="cred-body">
        <div className="cred-photo">
          {profile.photo_url ? (
            <img src={profile.photo_url} alt={profile.full_name} />
          ) : (
            <span className="cred-photo-fallback">👤</span>
          )}
        </div>
        <div className="cred-info">
          <p className="cred-label">JUGADOR</p>
          <h3>{profile.full_name.toUpperCase()}</h3>
          <p>
            #{profile.number} · {profile.position.toUpperCase()}
          </p>
          <p>{profile.team?.name ?? "Sin equipo"}</p>
          <span className="cred-status" style={{ borderColor: accent, color: accent }}>
            <i style={{ background: accent }} />
            {profile.status.toUpperCase()}
          </span>
        </div>
      </div>
      <footer className="cred-footer">
        <QRCredentialBlock code={profile.credential_code} accent={accent} />
        <div>
          <p className="cred-label">LIGA</p>
          <strong>{profile.league.name}</strong>
          <code>{profile.credential_code}</code>
        </div>
      </footer>
    </article>
  );
}
