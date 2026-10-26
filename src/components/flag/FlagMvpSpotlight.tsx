import { championOf, findMvp, honorText, overall, type FlagEvent } from "@/lib/flagEvents";
import { FlagTcgCard } from "./FlagTcgCard";
import { FlagIcon } from "./flagUi";

export function FlagMvpSpotlight({ event }: { event: FlagEvent }) {
  const mvp = findMvp(event);
  if (!mvp) return null;
  const { player, team } = mvp;
  const champion = championOf(event);

  return (
    <section className="fmvp" aria-labelledby="fmvp-title">
      <div className="fmvp-copy">
        <p className="fmvp-kicker">
          <FlagIcon name="crown" size={14} filled />
          MVP del {event.title}
        </p>
        <h2 id="fmvp-title">{player.name}</h2>
        <p className="fmvp-meta">
          {player.number != null ? `#${player.number} · ` : ""}
          {player.position} · {team.name}
        </p>

        <div className="fmvp-facts">
          <div>
            <strong>{overall(player.ratings)}</strong>
            <small>OVR</small>
          </div>
          {event.score && (
            <div>
              <strong>
                {event.score.home}-{event.score.away}
              </strong>
              <small>Final</small>
            </div>
          )}
          <div>
            <strong>1/1</strong>
            <small>Edición</small>
          </div>
        </div>

        {champion && (
          <p className="fmvp-champ">
            <FlagIcon name="trophy" size={15} />
            Campeona con {champion.name}
          </p>
        )}
        <p className="fmvp-note">Carta especial de la jugadora más valiosa. Toca "Saber más" para ver su perfil.</p>
      </div>

      <div className="fmvp-stage">
        <span className="fmvp-rays" aria-hidden="true" />
        <FlagTcgCard player={player} team={team} width="min(78vw, 320px)" edition="mvp" honor={honorText(event, "mvp")} serial="1/1" />
      </div>
    </section>
  );
}
