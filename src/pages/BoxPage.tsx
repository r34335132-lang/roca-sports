import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { BoxingHub } from "@/components/box/BoxingHub";

export function BoxPage() {
  return (
    <>
      <SiteHeader />
      <main className="boxing-page">
        <BoxingHub />
      </main>
      <SiteFooter />
    </>
  );
}
