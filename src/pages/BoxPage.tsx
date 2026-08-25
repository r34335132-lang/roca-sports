import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { BoxRecHub } from "@/components/box/BoxRecHub";

export function BoxPage() {
  return (
    <>
      <SiteHeader />
      <main className="boxrec-page">
        <BoxRecHub />
      </main>
      <SiteFooter />
    </>
  );
}
