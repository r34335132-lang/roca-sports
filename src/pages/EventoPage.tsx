import { Link, useNavigate, useParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { FlagDuelCard } from "@/components/flag/FlagDuelCard";
import { FlagMatchupCard } from "@/components/flag/FlagMatchupCard";
import { FlagRosterCarousel } from "@/components/flag/FlagRosterCarousel";
import { FlagIcon } from "@/components/flag/flagUi";
import { findFlagEvent } from "@/lib/flagEvents";

export function EventoPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const event = findFlagEvent(slug);

  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate("/deportes/flag");
  };

  return (
    <>
      <SiteHeader />
      <main className="flag-page">
        <div className="flag-wrap">
          <div className="flag-topbar">
            <button type="button" className="flag-back" onClick={goBack}>
              <FlagIcon name="arrow-left" size={16} />
              Regresar
            </button>
            <span className="flag-topbar-tag">Flag Football</span>
          </div>

          {event ? (
            <>
              <header className="flag-hero">
                <p className="flag-kicker">
                  {event.organizer} · {event.dateLabel}
                </p>
                <h1>{event.title}</h1>
              </header>

              <FlagMatchupCard event={event} />
              <FlagDuelCard event={event} />
              <FlagRosterCarousel event={event} />

              <section className="flag-poster" aria-labelledby="flag-poster-title">
                <h2 id="flag-poster-title">Cartel oficial</h2>
                <img src={event.poster} alt={`Cartel oficial de ${event.title}`} loading="lazy" />
              </section>
            </>
          ) : (
            <section className="flag-empty">
              <h1>Evento no encontrado</h1>
              <p>Este evento ya no está disponible o el enlace es incorrecto.</p>
              <Link to="/deportes/flag" className="flag-empty-btn">
                Ver Flag Football
              </Link>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
