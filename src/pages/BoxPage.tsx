import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { UpperDeckBox } from "@/components/box/UpperDeckBox";

export function BoxPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-pad">
        <div className="section-head">
          <p className="eyebrow">Upper Deck Box</p>
          <h1>Las cartas chocan y se revelan</h1>
          <p className="muted">
            Cada deporte trae su logo, rareza y stats. Abre el box para ver la
            animación de choque.
          </p>
        </div>
        <UpperDeckBox />
      </main>
      <SiteFooter />
    </>
  );
}
