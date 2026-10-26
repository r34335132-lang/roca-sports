import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { editionOf, honorText, overall, type FlagEvent, type FlagEventTeam } from "@/lib/flagEvents";
import { FlagTcgCard } from "./FlagTcgCard";
import { useReducedMotion } from "./flagUi";

const AUTOPLAY_MS = 4500;
const PAUSE_MS = 12000;

function TeamCarousel({ event, team, duelIds }: { event: FlagEvent; team: FlagEventTeam; duelIds: Set<string> }) {
  const reduceMotion = useReducedMotion();
  const players = useMemo(
    () => [...team.roster].sort((a, b) => overall(b.ratings) - overall(a.ratings)),
    [team],
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const pausedUntil = useRef(0);
  const flipped = useRef(new Set<string>());

  const step = useCallback(() => {
    const slides = trackRef.current?.children;
    if (!slides || slides.length < 2) return 1;
    return (slides[1] as HTMLElement).offsetLeft - (slides[0] as HTMLElement).offsetLeft || 1;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      trackRef.current?.scrollTo({ left: index * step(), behavior: reduceMotion ? "auto" : "smooth" });
    },
    [reduceMotion, step],
  );

  const pause = () => {
    pausedUntil.current = Date.now() + PAUSE_MS;
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.min(players.length - 1, Math.max(0, Math.round(el.scrollLeft / step())));
    if (index !== activeRef.current) {
      activeRef.current = index;
      setActive(index);
    }
  };

  useEffect(() => {
    if (reduceMotion || players.length < 2) return;
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      if (flipped.current.has(players[activeRef.current]?.id)) return;
      goTo((activeRef.current + 1) % players.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [goTo, players, reduceMotion]);

  const focusSlide = (index: number) => (e: MouseEvent) => {
    if (index === activeRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    pause();
    goTo(index);
  };

  return (
    <>
      <div className="fr-viewport">
        <div
          ref={trackRef}
          className="fr-track"
          onScroll={onScroll}
          onPointerDown={pause}
          onTouchStart={pause}
          onWheel={pause}
          onKeyDown={pause}
        >
          {players.map((player, i) => {
            const edition = editionOf(event, player);
            return (
              <div
                key={player.id}
                className={`fr-slide ${i === active ? "is-active" : ""}`}
                onClickCapture={focusSlide(i)}
              >
                <FlagTcgCard
                  player={player}
                  team={team}
                  width="100%"
                  active={i === active}
                  edition={edition}
                  honor={edition && honorText(event, edition)}
                  serial={
                    edition === "mvp" ? "1/1" : `${String(i + 1).padStart(2, "0")}/${String(players.length).padStart(2, "0")}`
                  }
                  badge={duelIds.has(player.id) ? "Duelo destacado" : undefined}
                  onSideChange={(side) => {
                    if (side === "back") flipped.current.add(player.id);
                    else flipped.current.delete(player.id);
                    pause();
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="fr-dots" aria-label={`Cartas de ${team.name}`}>
        {players.map((player, i) => (
          <button
            key={player.id}
            type="button"
            aria-current={i === active ? "true" : undefined}
            aria-label={`Ver carta de ${player.name}`}
            className={i === active ? "is-active" : undefined}
            onClick={() => {
              pause();
              goTo(i);
            }}
          />
        ))}
      </div>
    </>
  );
}

export function FlagRosterCarousel({ event }: { event: FlagEvent }) {
  const teams = [event.home, event.away];
  const [teamId, setTeamId] = useState(event.home.id);
  const team = teams.find((t) => t.id === teamId) ?? event.home;
  const duelIds = useMemo(
    () => new Set([event.featuredDuel?.homePlayerId, event.featuredDuel?.awayPlayerId].filter((id): id is string => !!id)),
    [event],
  );

  return (
    <section className="fr-section" aria-labelledby="fr-title">
      <header className="fr-head">
        <p className="fr-kicker">Roster</p>
        <h2 id="fr-title">Upper Deck Premium</h2>
      </header>

      <div className="fr-tabs" role="tablist" aria-label="Equipos">
        {teams.map((t) => {
          const selected = t.id === team.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`fr-tab-${t.id}`}
              aria-selected={selected}
              aria-controls="fr-panel"
              className={`fr-tab ${selected ? "is-active" : ""}`}
              style={{ "--team": t.primary, "--team-accent": t.accent } as CSSProperties}
              onClick={() => setTeamId(t.id)}
            >
              <span style={{ background: t.logoBackground }}>
                <img src={t.logo} alt="" />
              </span>
              {t.name}
            </button>
          );
        })}
      </div>

      <div id="fr-panel" role="tabpanel" aria-labelledby={`fr-tab-${team.id}`}>
        <TeamCarousel key={team.id} event={event} team={team} duelIds={duelIds} />
      </div>

      <p className="fr-help">
        Las cartas van cambiando solas: desliza para verlas a tu ritmo. Toca "Saber más" para voltearla y mantenla presionada
        para verla en 3D.
      </p>
    </section>
  );
}
