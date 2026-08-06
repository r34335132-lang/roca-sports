import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { CredentialFlip } from "@/components/credentials/CredentialFlip";
import { fetchPlayerCredential } from "@/lib/services/leagues";
import type { CardTemplate, PlayerProfile } from "@/lib/types";

export function JugadorPage() {
  const { id = "" } = useParams();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [template, setTemplate] = useState<CardTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayerCredential(id)
      .then((res) => {
        if (!res) {
          setError("Jugador no encontrado");
          return;
        }
        setProfile(res.profile);
        setTemplate(res.template);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [id]);

  return (
    <>
      <SiteHeader />
      <main className="section-pad">
        {error && <p className="form-error">{error}</p>}
        {profile && (
          <div className="player-cred-layout">
            <CredentialFlip profile={profile} template={template} />
            <div className="dash-panel">
              <p className="eyebrow">{profile.league.name}</p>
              <h1>{profile.full_name}</h1>
              <p>
                #{profile.number} · {profile.position} · {profile.team?.name ?? "Sin equipo"}
              </p>
              <code>{profile.credential_code}</code>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
