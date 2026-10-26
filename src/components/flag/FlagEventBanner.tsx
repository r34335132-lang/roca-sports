import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { championOf, findMvp, type FlagEvent } from "@/lib/flagEvents";
import { FlagIcon } from "./flagUi";

export function FlagEventBanner({ event }: { event: FlagEvent }) {
  const { score } = event;
  const champion = championOf(event);
  const mvp = findMvp(event);

  return (
    <Link
      to={`/evento/${event.slug}`}
      className="flag-banner"
      style={{ "--fm-primary": event.theme.primary, "--fm-accent": event.theme.accent } as CSSProperties}
      aria-label={
        score
          ? `${event.title}: ${event.home.name} ${score.home}, ${event.away.name} ${score.away}. Ver evento`
          : `${event.title}: ${event.home.name} contra ${event.away.name}. Ver evento`
      }
    >
      <span className="flag-banner-logo">
        <img src={event.logo} alt="" />
      </span>
      <div className="flag-banner-copy">
        <small>
          {score ? "Resultado final" : "Próximo evento"} · {event.subtitle}
        </small>
        <strong>{event.title}</strong>
        {score ? (
          <p>
            {event.home.name} <b className={champion?.id === event.home.id ? "is-win" : undefined}>{score.home}</b>
            <em>-</em>
            <b className={champion?.id === event.away.id ? "is-win" : undefined}>{score.away}</b> {event.away.name}
          </p>
        ) : (
          <p>
            {event.home.name} <em>vs</em> {event.away.name}
          </p>
        )}
        <ul>
          {champion ? (
            <li className="is-gold">
              <FlagIcon name="trophy" size={12} />
              {champion.name} campeonas
            </li>
          ) : (
            <li>
              <FlagIcon name="calendar" size={12} />
              {event.dateLabel}
            </li>
          )}
          {mvp ? (
            <li className="is-gold">
              <FlagIcon name="star" size={12} filled />
              MVP: {mvp.player.name}
            </li>
          ) : (
            <li>
              <FlagIcon name="clock" size={12} />
              {event.timeLabel}
            </li>
          )}
          <li>
            <FlagIcon name="map-pin" size={12} />
            {event.venue}
          </li>
        </ul>
      </div>
      <span className="flag-banner-cta">
        {score ? "Ver cartas" : "Ver evento"}
        <FlagIcon name="arrow-right" size={14} />
      </span>
    </Link>
  );
}
