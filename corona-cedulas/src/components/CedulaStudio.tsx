"use client";

import { useEffect, useRef, useState } from "react";
import { CedulaCard } from "@/components/CedulaCard";
import { CedulaForm } from "@/components/CedulaForm";
import {
  downloadCardPdf,
  downloadCardPng,
  downloadPackPdf,
} from "@/lib/export";
import {
  createBlankCedulas,
  INITIAL_CEDULA,
  type CedulaData,
} from "@/lib/types";

type Mode = "individual" | "capitan";
type Busy = "png" | "pdf" | "pack" | null;

function slugify(text: string) {
  return (text || "jugador")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

const btnPrimary =
  "rounded-full bg-[#c8ff00] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#0b1c2e] disabled:opacity-60";
const btnGhost =
  "rounded-full border border-white/25 px-4 py-2 text-xs font-black uppercase tracking-wide text-white disabled:opacity-60";
const btnGold =
  "rounded-full border border-[#f2b705] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#f2b705] disabled:opacity-60";

export function CedulaStudio() {
  const [mode, setMode] = useState<Mode>("individual");
  const [data, setData] = useState<CedulaData>(INITIAL_CEDULA);
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [packProgress, setPackProgress] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Capitan pack
  const [qty, setQty] = useState(11);
  const [packEquipo, setPackEquipo] = useState("");
  const [packCategoria, setPackCategoria] = useState("");
  const [packTemporada, setPackTemporada] = useState("2026");
  const [pack, setPack] = useState<CedulaData[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const packRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    packRefs.current = packRefs.current.slice(0, pack.length);
  }, [pack.length]);

  const activeCard = pack[activeIdx] ?? null;

  const generatePack = () => {
    const cards = createBlankCedulas(qty, {
      equipo: packEquipo.trim().toUpperCase(),
      categoria: packCategoria.trim().toUpperCase(),
      temporada: packTemporada.trim(),
    });
    setPack(cards);
    setActiveIdx(0);
    setError(null);
  };

  const patchActive = (patch: Partial<CedulaData>) => {
    setPack((prev) =>
      prev.map((c, i) => (i === activeIdx ? { ...c, ...patch } : c)),
    );
  };

  const onDownloadPng = async () => {
    if (!cardRef.current) return;
    setBusy("png");
    setError(null);
    try {
      await downloadCardPng(cardRef.current, `cedula-${slugify(data.nombre)}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al exportar PNG");
    } finally {
      setBusy(null);
    }
  };

  const onDownloadPdf = async () => {
    if (!cardRef.current) return;
    setBusy("pdf");
    setError(null);
    try {
      await downloadCardPdf(cardRef.current, `cedula-${slugify(data.nombre)}.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al exportar PDF");
    } finally {
      setBusy(null);
    }
  };

  const onDownloadPack = async () => {
    if (pack.length === 0) {
      setError("Primero genera el pack con la cantidad de cédulas.");
      return;
    }
    setBusy("pack");
    setError(null);
    setPackProgress("Preparando…");
    try {
      // Wait a frame so hidden cards are painted
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const nodes = pack
        .map((_, i) => packRefs.current[i])
        .filter((n): n is HTMLDivElement => Boolean(n));
      if (nodes.length !== pack.length) {
        throw new Error("No se pudieron renderizar todas las cédulas");
      }
      const teamSlug = slugify(packEquipo || "equipo");
      await downloadPackPdf(
        nodes,
        `cedulas-${teamSlug}-${pack.length}.pdf`,
        (done, total) => setPackProgress(`${done} / ${total}`),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al exportar el pack PDF");
    } finally {
      setBusy(null);
      setPackProgress(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="no-print mb-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={mode === "individual" ? btnPrimary : btnGhost}
          onClick={() => setMode("individual")}
        >
          Una cédula
        </button>
        <button
          type="button"
          className={mode === "capitan" ? btnPrimary : btnGhost}
          onClick={() => setMode("capitan")}
        >
          Pack del capitán
        </button>
      </div>

      {mode === "individual" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.95fr)_minmax(540px,1.15fr)] lg:items-start">
          <CedulaForm
            data={data}
            onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
            title="Generador de cédulas"
            subtitle="Edita los datos y la foto. La credencial se actualiza al instante."
          />

          <section className="grid justify-items-center gap-4">
            <ExportBar
              busy={busy}
              onPng={() => void onDownloadPng()}
              onPdf={() => void onDownloadPdf()}
            />
            {error && <ErrorBanner message={error} />}
            <div id="cedula-print-root" className="origin-top scale-[0.92] sm:scale-100">
              <CedulaCard data={data} cardRef={cardRef} />
            </div>
            <p className="no-print max-w-md text-center text-xs text-[#8b949e]">
              Vista previa en vivo · Descarga en PNG o PDF.
            </p>
          </section>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(300px,0.95fr)_minmax(540px,1.15fr)] lg:items-start">
          <div className="no-print grid gap-4">
            <section className="rounded-2xl border border-white/10 bg-[#0d131a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c8ff00]">
                Pack del capitán
              </p>
              <h1 className="mt-1 text-2xl font-black uppercase italic tracking-tight text-white">
                Cédulas en blanco
              </h1>
              <p className="mt-2 text-sm text-[#9aa4ae]">
                Indica cuántas necesitas. Se generan todas vacías (o con equipo /
                temporada) para que las completes aquí o las imprimas y rellenes
                a mano. El pack se descarga en <strong className="text-white">PDF</strong>{" "}
                (2 por hoja) — mejor que Word para credenciales.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa4ae]">
                  Cantidad
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value) || 1)}
                    className="w-full rounded-lg border border-white/10 bg-[#121820] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-[#c8ff00]"
                  />
                </label>
                <label className="grid gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa4ae]">
                  Temporada
                  <input
                    value={packTemporada}
                    onChange={(e) => setPackTemporada(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#121820] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-[#c8ff00]"
                  />
                </label>
                <label className="grid gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa4ae] sm:col-span-2">
                  Equipo (opcional, se aplica a todas)
                  <input
                    value={packEquipo}
                    onChange={(e) => setPackEquipo(e.target.value.toUpperCase())}
                    placeholder="DEPORTIVO CORONA"
                    className="w-full rounded-lg border border-white/10 bg-[#121820] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-[#c8ff00]"
                  />
                </label>
                <label className="grid gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa4ae] sm:col-span-2">
                  Categoría (opcional)
                  <input
                    value={packCategoria}
                    onChange={(e) =>
                      setPackCategoria(e.target.value.toUpperCase())
                    }
                    placeholder="LIBRE"
                    className="w-full rounded-lg border border-white/10 bg-[#121820] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-[#c8ff00]"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className={btnPrimary} onClick={generatePack}>
                  Generar {qty} cédula{qty === 1 ? "" : "s"}
                </button>
                <button
                  type="button"
                  className={btnGold}
                  disabled={busy !== null || pack.length === 0}
                  onClick={() => void onDownloadPack()}
                >
                  {busy === "pack"
                    ? `PDF… ${packProgress ?? ""}`
                    : `Descargar pack PDF (${pack.length || 0})`}
                </button>
              </div>
            </section>

            {pack.length > 0 && (
              <>
                <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-[#0d131a] p-3">
                  {pack.map((c, i) => {
                    const filled = Boolean(c.nombre.trim());
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveIdx(i)}
                        className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${
                          i === activeIdx
                            ? "bg-[#c8ff00] text-[#0b1c2e]"
                            : filled
                              ? "bg-white/15 text-white"
                              : "border border-white/20 text-[#9aa4ae]"
                        }`}
                      >
                        #{i + 1}
                        {filled ? ` · ${c.nombre.slice(0, 10)}` : " vacía"}
                      </button>
                    );
                  })}
                </div>

                {activeCard && (
                  <CedulaForm
                    data={activeCard}
                    onChange={patchActive}
                    title={`Jugador #${activeIdx + 1} de ${pack.length}`}
                    subtitle="Opcional: completa aquí antes de bajar el PDF, o déjalas en blanco."
                  />
                )}
              </>
            )}
          </div>

          <section className="grid justify-items-center gap-4">
            {error && <ErrorBanner message={error} />}
            {activeCard ? (
              <>
                <div className="origin-top scale-[0.92] sm:scale-100">
                  <CedulaCard data={activeCard} />
                </div>
                <p className="no-print max-w-md text-center text-xs text-[#8b949e]">
                  {pack.filter((c) => c.nombre.trim()).length} de {pack.length}{" "}
                  con nombre · El PDF incluye las {pack.length} cédulas (2 por
                  hoja).
                </p>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 px-8 py-16 text-center text-sm text-[#8b949e]">
                Genera el pack para ver las cédulas en blanco.
              </div>
            )}
          </section>

          {/* Offscreen render for pack capture */}
          <div
            aria-hidden
            className="pointer-events-none fixed left-[-9999px] top-0"
            style={{ width: 540 }}
          >
            {pack.map((card, i) => (
              <div key={i} className="mb-4">
                <CedulaCard
                  data={card}
                  cardRef={(node) => {
                    packRefs.current[i] = node;
                  }}
                  cardId={`pack-card-${i}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExportBar({
  busy,
  onPng,
  onPdf,
}: {
  busy: Busy;
  onPng: () => void;
  onPdf: () => void;
}) {
  return (
    <div className="no-print flex w-full flex-wrap items-center justify-center gap-2">
      <button type="button" disabled={busy !== null} onClick={onPng} className={btnPrimary}>
        {busy === "png" ? "Generando PNG…" : "Descargar PNG"}
      </button>
      <button type="button" disabled={busy !== null} onClick={onPdf} className={btnGold}>
        {busy === "pdf" ? "Generando PDF…" : "Descargar PDF"}
      </button>
      <button type="button" onClick={() => window.print()} className={btnGhost}>
        Imprimir
      </button>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="no-print w-full rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
      {message}
    </p>
  );
}
