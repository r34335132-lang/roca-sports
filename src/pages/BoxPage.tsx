import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { UpperDeckBox } from "@/components/box/UpperDeckBox";

export function BoxPage() {
  return (
    <>
      <SiteHeader />
      <main className="fight-night-page">
        <section className="fight-hero">
          <img
            src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=2200&q=80"
            alt=""
          />
          <div className="fight-hero-copy">
            <p className="eyebrow">ROCA Fight Night</p>
            <h1>El box. Las cartas. El ring.</h1>
            <p>
              Pack Upper Deck con foil, rareza Knockout y choque en el canvas.
              Rompe el sello y sube a pelear.
            </p>
          </div>
        </section>
        <div className="section-pad">
          <UpperDeckBox />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
