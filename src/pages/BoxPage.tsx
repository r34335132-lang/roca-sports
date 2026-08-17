import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { UpperDeckBox } from "@/components/box/UpperDeckBox";

export function BoxPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-pad fight-night-page">
        <div className="section-head">
          <p className="eyebrow">Fight Night Box</p>
          <h1>Sube al ring y abre el pack</h1>
          <p className="muted">
            Diseño de boxeo total: cuerdas, esquinas y campana. Las cartas chocan
            y revelan cada deporte con su rareza.
          </p>
        </div>
        <UpperDeckBox />
      </main>
      <SiteFooter />
    </>
  );
}
