"use client";

import type { CedulaData } from "@/lib/types";

type Props = {
  data: CedulaData;
  onChange: (patch: Partial<CedulaData>) => void;
  title?: string;
  subtitle?: string;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa4ae]">
      {label}
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#121820] px-3 py-2.5 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-[#c8ff00]";

export function CedulaForm({
  data,
  onChange,
  title = "Editar cédula",
  subtitle = "Los cambios se ven al instante en la vista previa.",
}: Props) {
  return (
    <form
      className="no-print grid gap-4 rounded-2xl border border-white/10 bg-[#0d131a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c8ff00]">
          Corona Soccer Park · ROCA
        </p>
        <h1 className="mt-1 text-2xl font-black uppercase italic tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[#9aa4ae]">{subtitle}</p>
      </div>

      <Field label="Nombre del jugador">
        <input
          className={inputClass}
          value={data.nombre}
          placeholder="Ej. JUAN PÉREZ"
          onChange={(e) => onChange({ nombre: e.target.value.toUpperCase() })}
        />
      </Field>

      <Field label="Equipo">
        <input
          className={inputClass}
          value={data.equipo}
          placeholder="Nombre del equipo"
          onChange={(e) => onChange({ equipo: e.target.value.toUpperCase() })}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Categoría">
          <input
            className={inputClass}
            value={data.categoria}
            placeholder="LIBRE / VETERANOS…"
            onChange={(e) =>
              onChange({ categoria: e.target.value.toUpperCase() })
            }
          />
        </Field>
        <Field label="Posición">
          <input
            className={inputClass}
            value={data.posicion}
            placeholder="DELANTERO…"
            onChange={(e) =>
              onChange({ posicion: e.target.value.toUpperCase() })
            }
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Número / ID">
          <input
            className={inputClass}
            value={data.numero}
            placeholder="00"
            onChange={(e) => onChange({ numero: e.target.value.toUpperCase() })}
          />
        </Field>
        <Field label="Temporada">
          <input
            className={inputClass}
            value={data.temporada}
            placeholder="2026"
            onChange={(e) => onChange({ temporada: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Fotografía del jugador">
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-[#9aa4ae] file:mr-3 file:rounded-md file:border-0 file:bg-[#c8ff00] file:px-3 file:py-2 file:text-sm file:font-bold file:text-[#0b1c2e] hover:file:bg-[#d6ff4d]"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            onChange({ fotoUrl: url });
          }}
        />
      </Field>

      {data.fotoUrl && (
        <button
          type="button"
          className="justify-self-start text-xs font-bold uppercase tracking-wide text-[#f2b705] underline"
          onClick={() => onChange({ fotoUrl: null })}
        >
          Quitar fotografía
        </button>
      )}
    </form>
  );
}
