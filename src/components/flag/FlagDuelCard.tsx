import { useEffect, useRef, useState, type CSSProperties } from "react";
import { RATING_LABELS, findFeaturedDuel, overall, rarityOf, type FlagCardPlayer, type FlagEvent, type FlagEventTeam } from "@/lib/flagEvents";
import { FlagIcon, RARITY_INK, RARITY_LABEL, focusOf, useReducedMotion } from "./flagUi";

const GOLD = "#f0c419";

function firstName(name: string) {
  return name.split(" ")[0];
}

function PlayerSide({ player, team, side }: { player: FlagCardPlayer; team: FlagEventTeam; side: "left" | "right" }) {
  const ink = RARITY_INK[rarityOf(player)];
  const { x, y, zoom } = focusOf(player);
  return (
    <div className={`fd-player ${side}`} style={{ "--team": team.primary, "--ink": ink } as CSSProperties}>
      <div className="fd-photo">
        {player.photo ? (
          <img
            src={player.photo}
            alt={`Foto de ${player.name}`}
            style={{ objectPosition: `${x * 100}% ${y * 100}%`, transform: `scale(${zoom})`, transformOrigin: `${x * 100}% ${y * 100}%` }}
          />
        ) : (
          <img className="fd-photo-logo" src={team.logo} alt="" />
        )}
        <span className="fd-photo-fade" aria-hidden="true" />
        <div className="fd-ovr">
          <strong>{overall(player.ratings)}</strong>
          <small>OVR</small>
        </div>
        <span className="fd-rarity">{RARITY_LABEL[rarityOf(player)]}</span>
        <span className="fd-team-logo" style={{ background: team.logoBackground }}>
          <img src={team.logo} alt={team.name} />
        </span>
      </div>
      <strong className="fd-name">{player.name}</strong>
      <small className="fd-meta">
        {player.number != null ? `#${player.number} · ` : ""}
        {player.position}
      </small>
    </div>
  );
}

export function FlagDuelCard({ event }: { event: FlagEvent }) {
  const duel = findFeaturedDuel(event);
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  if (!duel) return null;
  const { home, away } = duel;

  let homeWins = 0;
  let awayWins = 0;
  for (const { key } of RATING_LABELS) {
    if (home.ratings[key] > away.ratings[key]) homeWins += 1;
    else if (away.ratings[key] > home.ratings[key]) awayWins += 1;
  }

  return (
    <section ref={ref} className={`fd-card ${visible ? "is-visible" : ""}`} aria-label={`${duel.title}: ${home.name} contra ${away.name}`}>
      <header className="fd-head">
        <span className="fd-bolt">
          <FlagIcon name="zap" size={16} filled />
        </span>
        <div>
          <h2>{duel.title}</h2>
          {duel.subtitle && <p>{duel.subtitle}</p>}
        </div>
      </header>

      <div className="fd-players">
        <PlayerSide player={home} team={event.home} side="left" />
        <div className="fd-vs" aria-hidden="true">
          <b>VS</b>
        </div>
        <PlayerSide player={away} team={event.away} side="right" />
      </div>

      <ul className="fd-stats">
        {RATING_LABELS.map(({ key, label }, i) => {
          const h = home.ratings[key];
          const a = away.ratings[key];
          const homeColor = h > a ? GOLD : "#f8faf5";
          const awayColor = a > h ? GOLD : "#f8faf5";
          const delay = { transitionDelay: `${i * 110}ms` };
          return (
            <li key={key} aria-label={`${label}: ${home.name} ${h}, ${away.name} ${a}`}>
              <strong style={{ color: homeColor }}>{h}</strong>
              <span className="fd-bar left">
                <i style={{ width: `${h}%`, background: h > a ? GOLD : event.home.accent, ...delay }} />
              </span>
              <small>{label}</small>
              <span className="fd-bar right">
                <i style={{ width: `${a}%`, background: a > h ? GOLD : event.away.accent, ...delay }} />
              </span>
              <strong style={{ color: awayColor }}>{a}</strong>
            </li>
          );
        })}
      </ul>

      <footer className="fd-tally">
        <span>
          {firstName(home.name)} gana {homeWins} de {RATING_LABELS.length}
        </span>
        <span>
          {firstName(away.name)} gana {awayWins} de {RATING_LABELS.length}
        </span>
      </footer>
    </section>
  );
}
