import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { FlagEvent } from "@/lib/flagEvents";
import { FlagIcon } from "./flagUi";

export function FlagEventBanner({ event }: { event: FlagEvent }) {
  return (
    <Link
      to={`/evento/${event.slug}`}
      className="flag-banner"
      style={{ "--fm-primary": event.theme.primary, "--fm-accent": event.theme.accent } as CSSProperties}
      aria-label={`${event.title}: ${event.home.name} contra ${event.away.name}. Ver evento`}
    >
      <span className="flag-banner-logo">
        <img src={event.logo} alt="" />
      </span>
      <div className="flag-banner-copy">
        <small>Próximo evento · {event.subtitle}</small>
        <strong>{event.title}</strong>
        <p>
          {event.home.name} <em>vs</em> {event.away.name}
        </p>
        <ul>
          <li>
            <FlagIcon name="calendar" size={12} />
            {event.dateLabel}
          </li>
          <li>
            <FlagIcon name="clock" size={12} />
            {event.timeLabel}
          </li>
          <li>
            <FlagIcon name="map-pin" size={12} />
            {event.venue}
          </li>
        </ul>
      </div>
      <span className="flag-banner-cta">
        Ver evento
        <FlagIcon name="arrow-right" size={14} />
      </span>
    </Link>
  );
}
