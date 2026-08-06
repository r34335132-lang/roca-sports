import { useState } from "react";
import type { CardTemplate, PlayerProfile } from "@/lib/types";
import { PlayerCredentialCard } from "./PlayerCredentialCard";
import { PlayerCardPreview } from "./PlayerCardPreview";

export function CredentialFlip({
  profile,
  template,
}: {
  profile: PlayerProfile;
  template?: CardTemplate | null;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flip-scene">
      <button
        type="button"
        className={`flip-card ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((v) => !v)}
        aria-label="Voltear credencial"
      >
        <div className="flip-face flip-front">
          <PlayerCredentialCard profile={profile} />
        </div>
        <div className="flip-face flip-back">
          <PlayerCardPreview profile={profile} template={template} />
        </div>
      </button>
      <p className="flip-hint">Toca para voltear · Credencial / Upper Deck</p>
    </div>
  );
}
