import { Link, useParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { SportHub } from "@/components/sports/SportHub";
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
        <SportHub sport={sport} />
      </main>
      <SiteFooter />
    </>
  );
}
