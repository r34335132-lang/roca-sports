import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import {
  FLAG_DURANGO_LOGO,
  RATING_LABELS,
  overall,
  rarityOf,
  type FlagCardPlayer,
  type FlagEventTeam,
  type FlagRarity,
} from "@/lib/flagEvents";
import { FlagIcon, RARITY_FOIL, RARITY_INK, RARITY_LABEL, focusOf, ratingColor, useReducedMotion } from "./flagUi";

type Side = "front" | "back";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Encuadre de la foto a toda la carta, en % de la carta: el punto de enfoque queda arriba de las stats. */
function photoFrame(player: FlagCardPlayer): CSSProperties {
  const { x, y, zoom } = focusOf(player);
  return {
    width: `${zoom * 100}%`,
    height: `${zoom * 100}%`,
    left: `${clamp(0.5 - x * zoom, 1 - zoom, 0) * 100}%`,
    top: `${clamp(0.4 - y * zoom, 1 - zoom, 0) * 100}%`,
  };
}

export function FlagTcgCard({
  player,
  team,
  width,
  active = true,
  serial,
  badge,
  onSideChange,
}: {
  player: FlagCardPlayer;
  team: FlagEventTeam;
  width: string;
  active?: boolean;
  serial?: string;
  badge?: string;
  onSideChange?: (side: Side) => void;
}) {
  const reduceMotion = useReducedMotion();
  const rarity = rarityOf(player);
  const ovr = overall(player.ratings);
  const [side, setSide] = useState<Side>("front");
  const [flip, setFlip] = useState({ deg: 0, animate: true });
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50, live: false, pressed: false });
  const tiltRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const toggleSide = () => {
    const next: Side = side === "front" ? "back" : "front";
    onSideChange?.(next);
    if (reduceMotion) {
      setSide(next);
      return;
    }
    setFlip({ deg: 90, animate: true });
    timers.current.push(
      window.setTimeout(() => {
        setSide(next);
        setFlip({ deg: -90, animate: false });
        requestAnimationFrame(() => requestAnimationFrame(() => setFlip({ deg: 0, animate: true })));
      }, 175),
    );
  };

  const resetTilt = () => setTilt((t) => ({ ...t, x: 0, y: 0, live: false, pressed: false }));

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: clamp((0.5 - py) * 32, -16, 16), y: clamp((px - 0.5) * 36, -18, 18), gx: px * 100, gy: py * 100, live: true, pressed: false });
  };

  useEffect(() => {
    const el = tiltRef.current;
    if (!el || reduceMotion) return;
    let hold: number | undefined;
    let holding = false;
    let start = { x: 0, y: 0 };

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      start = { x: t.clientX, y: t.clientY };
      hold = window.setTimeout(() => {
        holding = true;
        setTilt((s) => ({ ...s, live: true, pressed: true }));
      }, 180);
    };
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (!holding) {
        if (Math.hypot(dx, dy) > 8) window.clearTimeout(hold);
        return;
      }
      e.preventDefault();
      const r = el.getBoundingClientRect();
      setTilt({
        x: clamp(-dy / 9, -16, 16),
        y: clamp(dx / 9, -18, 18),
        gx: ((t.clientX - r.left) / r.width) * 100,
        gy: ((t.clientY - r.top) / r.height) * 100,
        live: true,
        pressed: true,
      });
    };
    const onEnd = () => {
      window.clearTimeout(hold);
      holding = false;
      setTilt((s) => ({ ...s, x: 0, y: 0, live: false, pressed: false }));
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      window.clearTimeout(hold);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [reduceMotion]);

  const animated = active && !reduceMotion;
  const ink = RARITY_INK[rarity];
  const foil = RARITY_FOIL[rarity];
  const glare = clamp((Math.abs(tilt.x) + Math.abs(tilt.y)) / 26, 0, 0.55);

  const style = {
    width,
    "--ink": ink,
    "--foil": `conic-gradient(from 0deg, ${[...foil, foil[0]].join(", ")})`,
    "--team": team.primary,
  } as CSSProperties;

  return (
    <div className={`tcg ${animated ? "is-animated" : ""} ${tilt.live ? "is-tilting" : ""}`} style={style} data-rarity={rarity}>
      <div className="tcg-sway">
        <div
          ref={tiltRef}
          className="tcg-tilt"
          onPointerMove={onPointerMove}
          onPointerLeave={resetTilt}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.pressed ? 1.04 : 1})`,
          }}
        >
          <div
            className="tcg-flip"
            style={{
              transform: `rotateY(${flip.deg}deg)`,
              transition: flip.animate && !reduceMotion ? undefined : "none",
            }}
          >
            <div className="tcg-frame">
              <div className="tcg-face">
                {side === "front" ? (
                  <CardFront player={player} team={team} rarity={rarity} ovr={ovr} serial={serial} badge={badge} onMore={toggleSide} />
                ) : (
                  <CardBack player={player} team={team} rarity={rarity} ovr={ovr} onBack={toggleSide} />
                )}
                <span className="tcg-shine" aria-hidden="true" />
                <span
                  className="tcg-glare"
                  aria-hidden="true"
                  style={{
                    opacity: glare,
                    background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardFront({
  player,
  team,
  rarity,
  ovr,
  serial,
  badge,
  onMore,
}: {
  player: FlagCardPlayer;
  team: FlagEventTeam;
  rarity: FlagRarity;
  ovr: number;
  serial?: string;
  badge?: string;
  onMore: () => void;
}) {
  return (
    <div className="tcg-front">
      {player.photo ? (
        <img className="tcg-photo" src={player.photo} style={photoFrame(player)} alt={`Foto de ${player.name}`} draggable={false} />
      ) : (
        <div className="tcg-nophoto">
          <img src={team.logo} alt="" />
          <span>Foto próximamente</span>
        </div>
      )}
      <span className="tcg-stripe s1" aria-hidden="true" />
      <span className="tcg-stripe s2" aria-hidden="true" />
      <span className="tcg-fade-top" aria-hidden="true" />
      <span className="tcg-fade-bottom" aria-hidden="true" />

      <div className="tcg-ovr">
        <strong>{ovr}</strong>
        <small>OVR</small>
        <span className={player.position.length > 10 ? "is-long" : undefined}>{player.position}</span>
        <i style={{ background: team.logoBackground }}>
          <img src={team.logo} alt={team.name} />
        </i>
      </div>

      <img className="tcg-fd" src={FLAG_DURANGO_LOGO} alt="Flag Durango" />

      <div className="tcg-bottom">
        {badge && (
          <span className="tcg-badge">
            <FlagIcon name="zap" size={11} filled />
            {badge}
          </span>
        )}
        <div className="tcg-plate">
          {player.number != null && <b>#{player.number}</b>}
          <strong className={player.name.length > 16 ? "is-long" : undefined}>{player.name}</strong>
        </div>
        <p className="tcg-team">{team.name} · Upper Deck</p>

        <div className="tcg-stats">
          {RATING_LABELS.map(({ key, short, label }) => {
            const v = player.ratings[key];
            return (
              <div key={key} title={label}>
                <strong style={{ color: ratingColor(v) }}>{v}</strong>
                <small>{short}</small>
              </div>
            );
          })}
        </div>

        <div className="tcg-footer">
          <span className="tcg-rarity">{RARITY_LABEL[rarity]}</span>
          {serial && <span className="tcg-serial">{serial}</span>}
          <button type="button" className="tcg-more" onClick={onMore} aria-label={`Saber más de ${player.name}`}>
            Saber más
            <FlagIcon name="rotate-cw" size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CardBack({
  player,
  team,
  rarity,
  ovr,
  onBack,
}: {
  player: FlagCardPlayer;
  team: FlagEventTeam;
  rarity: FlagRarity;
  ovr: number;
  onBack: () => void;
}) {
  return (
    <div className="tcg-back">
      <header>
        <img className="tcg-back-fd" src={FLAG_DURANGO_LOGO} alt="Flag Durango" />
        <div>
          <h3 className={player.name.length > 16 ? "is-long" : undefined}>{player.name}</h3>
          <p>
            {player.number != null ? `#${player.number} · ` : ""}
            {player.position} · {team.name}
          </p>
        </div>
        <div className="tcg-back-ovr">
          <strong>{ovr}</strong>
          <small>OVR</small>
        </div>
      </header>

      <ul className="tcg-bars">
        {RATING_LABELS.map(({ key, label }) => {
          const v = player.ratings[key];
          return (
            <li key={key}>
              <span>{label}</span>
              <i>
                <b style={{ width: `${clamp(v, 0, 99)}%`, background: ratingColor(v) }} />
              </i>
              <strong style={{ color: ratingColor(v) }}>{v}</strong>
            </li>
          );
        })}
      </ul>

      <div className="tcg-bio" tabIndex={0} aria-label={`Perfil de ${player.name}`}>
        <h4>Perfil</h4>
        {player.bio.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <button type="button" className="tcg-back-btn" onClick={onBack} aria-label={`Ver carta de ${player.name}`}>
        <FlagIcon name="rotate-ccw" size={14} />
        Ver carta
      </button>
    </div>
  );
}
