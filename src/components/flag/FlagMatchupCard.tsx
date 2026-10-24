import { useEffect, useState, type CSSProperties } from "react";
import { FLAG_DURANGO_LOGO, type FlagCardPlayer, type FlagEvent, type FlagEventTeam } from "@/lib/flagEvents";
import { FlagIcon, focusOf } from "./flagUi";

const MAX_AVATARS = 6;

function useCountdown(iso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function isSameDay(iso: string) {
  const a = new Date(iso);
  const b = new Date();
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function Avatar({ player, team, index }: { player: FlagCardPlayer; team: FlagEventTeam; index: number }) {
  const { x, y } = focusOf(player);
  return (
    <span
      className="fm-avatar"
      style={{ borderColor: team.accent, background: team.primary, zIndex: 10 - index, animationDelay: `${500 + index * 70}ms` }}
      title={player.name}
    >
      {player.photo ? (
        <img src={player.photo} alt={player.name} style={{ objectPosition: `${x * 100}% ${y * 100}%` }} />
      ) : (
        <b>{player.number ?? player.name.charAt(0)}</b>
      )}
    </span>
  );
}

function AvatarStack({ team, side }: { team: FlagEventTeam; side: "left" | "right" }) {
  const overflow = team.roster.length > MAX_AVATARS;
  const shown = overflow ? team.roster.slice(0, MAX_AVATARS - 1) : team.roster;
  const extra = team.roster.length - shown.length;
  return (
    <div className={`fm-avatars ${side}`}>
      {shown.map((p, i) => (
        <Avatar key={p.id} player={p} team={team} index={i} />
      ))}
      {overflow && (
        <span
          className="fm-avatar is-more"
          style={{ borderColor: team.accent, background: team.primary, animationDelay: `${500 + shown.length * 70}ms` }}
          aria-label={`${extra} jugadoras más`}
        >
          <b>+{extra}</b>
        </span>
      )}
    </div>
  );
}

function TeamSide({ team, side }: { team: FlagEventTeam; side: "left" | "right" }) {
  return (
    <div className={`fm-team ${side}`}>
      <span className="fm-team-logo" style={{ background: team.logoBackground, boxShadow: `0 0 22px ${team.accent}cc` }}>
        <img src={team.logo} alt={`Logo ${team.name}`} />
      </span>
      <strong>{team.name}</strong>
      <small>{team.roster.length} jugadoras</small>
    </div>
  );
}

export function FlagMatchupCard({ event }: { event: FlagEvent }) {
  const countdown = useCountdown(event.kickoff);
  const today = isSameDay(event.kickoff);
  const { primary, accent } = event.theme;

  const style = {
    "--fm-primary": primary,
    "--fm-accent": accent,
    "--fm-home": `${event.home.accent}55`,
    "--fm-away": `${event.away.accent}33`,
  } as CSSProperties;

  return (
    <section className="fm-card" style={style} aria-label={`${event.title}: ${event.home.name} contra ${event.away.name}, ${event.dateLabel}`}>
      <span className="fm-divider" aria-hidden="true" />
      <span className="fm-sheen" aria-hidden="true" />

      <header className="fm-top">
        <p>Carta de enfrentamiento</p>
        <img className="fm-fd" src={FLAG_DURANGO_LOGO} alt="Flag Durango" />
      </header>

      <div className="fm-logo">
        <div className="fm-logo-box">
          <img src={event.logo} alt={event.title} />
        </div>
      </div>

      <div className="fm-row">
        <TeamSide team={event.home} side="left" />
        <div className="fm-vs" aria-label="contra">
          <span className="fm-vs-ring" aria-hidden="true" />
          <span className="fm-vs-pop">
            <b>VS</b>
          </span>
        </div>
        <TeamSide team={event.away} side="right" />
      </div>

      <div className="fm-rosters">
        <AvatarStack team={event.home} side="left" />
        <AvatarStack team={event.away} side="right" />
      </div>

      {event.score ? (
        <div className="fm-score" aria-label={`Final: ${event.home.name} ${event.score.home}, ${event.away.name} ${event.score.away}`}>
          <strong>{event.score.home}</strong>
          <span>Final</span>
          <strong>{event.score.away}</strong>
        </div>
      ) : countdown ? (
        <div className="fm-countdown" role="timer" aria-label={`Faltan ${countdown.d} días ${countdown.h} horas ${countdown.m} minutos`}>
          {(
            [
              [countdown.d, "Días"],
              [countdown.h, "Hrs"],
              [countdown.m, "Min"],
              [countdown.s, "Seg"],
            ] as const
          ).map(([n, label]) => (
            <div key={label}>
              <strong>{String(n).padStart(2, "0")}</strong>
              <small>{label}</small>
            </div>
          ))}
        </div>
      ) : (
        <p className="fm-live">{today ? "En juego" : "Juego disputado"}</p>
      )}

      <ul className="fm-info">
        <li>
          <FlagIcon name="calendar" size={13} />
          {event.dateLabel}
        </li>
        <li>
          <FlagIcon name="clock" size={13} />
          {event.timeLabel}
        </li>
        <li>
          <FlagIcon name="map-pin" size={13} />
          {event.venue}
        </li>
      </ul>
      <p className="fm-presenta">Presenta {event.organizer}</p>
    </section>
  );
}
