import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { CredentialFlip } from "@/components/credentials/CredentialFlip";
import { useAuth } from "@/context/AuthContext";
import { fetchPlayerCredential } from "@/lib/services/leagues";
import type { CardTemplate, PlayerProfile } from "@/lib/types";

export function PlayerDashboard() {
  const { user, playerProfiles, configured } = useAuth();
  const [selectedId, setSelectedId] = useState(playerProfiles[0]?.id ?? "");
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [template, setTemplate] = useState<CardTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (playerProfiles[0] && !selectedId) setSelectedId(playerProfiles[0].id);
  }, [playerProfiles, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    fetchPlayerCredential(selectedId)
      .then((res) => {
        if (!res) {
          setProfile(null);
          return;
        }
        setProfile(res.profile);
        setTemplate(res.template);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [selectedId]);

  if (!configured) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="warn-banner">Configura el .env para ver tu credencial.</p>
        </main>
      </>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  if (playerProfiles.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad panel-empty">
          <h1>Sin credencial vinculada</h1>
          <p>
            Cuando el dueño de tu liga te vincule con tu cuenta, aquí verás tu
            credencial y Upper Deck.
          </p>
          <Link className="btn btn-outline" to="/ligas">
            Explorar ligas
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="section-pad dashboard player-dash">
        <div className="section-head row-between">
          <div>
            <p className="eyebrow">Mi perfil</p>
            <h1>Credencial digital</h1>
            <p className="muted">
              Mismo diseño Upper Deck, logo y rareza según el deporte de tu liga.
            </p>
          </div>
          {playerProfiles.length > 1 && (
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {playerProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name} · #{p.number}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}

        {profile && (
          <div className="player-cred-layout">
            <CredentialFlip profile={profile} template={template} />
            <div className="dash-panel">
              <h3>{profile.full_name}</h3>
              <ul className="simple-list">
                <li>
                  <strong>Liga</strong>
                  <span>{profile.league.name}</span>
                </li>
                <li>
                  <strong>Equipo</strong>
                  <span>{profile.team?.name ?? "Sin equipo"}</span>
                </li>
                <li>
                  <strong>Código</strong>
                  <span>{profile.credential_code}</span>
                </li>
                <li>
                  <strong>Deporte</strong>
                  <span>{profile.league.sport}</span>
                </li>
              </ul>
              <Link className="text-link" to={`/jugador/${profile.id}`}>
                Abrir perfil público →
              </Link>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
