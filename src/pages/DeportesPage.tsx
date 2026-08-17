import { Link } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { SPORT_IMAGES, SPORT_LABELS } from "@/lib/types";

const SPORTS = ["soccer", "basketball", "boxing", "flag", "baseball", "cycling"] as const;

export function DeportesPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-pad">
        <div className="section-head">
          <p className="eyebrow">Deportes</p>
          <h1>Elige tu disciplina</h1>
          <p className="muted">
            Cada liga tiene su imagen, colores y Upper Deck. Entra a ver jornadas,
            goleadores y equipo de la semana.
          </p>
        </div>
        <div className="discipline-grid big">
          {SPORTS.map((sport) => (
            <Link key={sport} className="discipline-card" to={`/deportes/${sport}`}>
              <img src={SPORT_IMAGES[sport]} alt={SPORT_LABELS[sport]} />
              <span>{SPORT_LABELS[sport]}</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
