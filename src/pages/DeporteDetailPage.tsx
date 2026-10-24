import { Link, useParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { SportHub } from "@/components/sports/SportHub";
import { FlagEventBanner } from "@/components/flag/FlagEventBanner";
import { FLAG_EVENTS } from "@/lib/flagEvents";
import { SPORT_LABELS } from "@/lib/types";

export function DeporteDetailPage() {
  const { sport = "soccer" } = useParams();
  const label = SPORT_LABELS[sport] ?? sport;

  return (
    <>
      <SiteHeader />
      <main className="section-pad">
        <div className="section-head">
          <p className="eyebrow">
            <Link to="/deportes">Deportes</Link> / {label}
          </p>
          <h1>{label}</h1>
        </div>
        {sport === "flag" && FLAG_EVENTS.length > 0 && (
          <div className="flag-banners">
            {FLAG_EVENTS.map((event) => (
              <FlagEventBanner key={event.slug} event={event} />
            ))}
          </div>
        )}
        <SportHub sport={sport} />
      </main>
      <SiteFooter />
    </>
  );
}
