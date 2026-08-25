import type { ReactNode, Ref } from "react";
import {
  CalendarIcon,
  IdCardIcon,
  OfficialIdIcon,
  PhotoPlaceholder,
  PlayerRunIcon,
  ShieldCheckIcon,
  TeamIcon,
  TrophyIcon,
  UserIcon,
  WarningIcon,
} from "@/components/icons";
import type { CedulaData } from "@/lib/types";

function FieldRow({
  icon,
  label,
  value,
  blankHint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  blankHint?: string;
}) {
  const empty = !value.trim();
  return (
    <div
      className="grid items-center gap-2 border-b py-[5px] last:border-b-0"
      style={{
        gridTemplateColumns: "20px 1fr",
        borderColor: "rgba(11,28,46,0.12)",
      }}
    >
      <div style={{ color: "#1a6b3a" }}>{icon}</div>
      <div className="min-w-0">
        <div
          className="font-bold uppercase"
          style={{ fontSize: 8, letterSpacing: "0.16em", color: "#7a848e" }}
        >
          {label}
        </div>
        {empty ? (
          <div
            className="mt-0.5 font-semibold uppercase"
            style={{
              fontSize: 12,
              color: "#b0b6bd",
              borderBottom: "1.5px dashed #c5cad0",
              minHeight: 16,
              letterSpacing: "0.04em",
            }}
          >
            {blankHint || "\u00A0"}
          </div>
        ) : (
          <div
            className="truncate font-extrabold uppercase leading-tight"
            style={{ fontSize: 13, color: "#0b1c2e" }}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

export function CedulaCard({
  data,
  cardRef,
  cardId,
}: {
  data: CedulaData;
  cardRef?: Ref<HTMLDivElement | null>;
  cardId?: string;
}) {
  return (
    <div
      ref={cardRef}
      id={cardId ?? "cedula-card"}
      className="relative overflow-hidden"
      style={{
        width: 540,
        height: 340,
        borderRadius: 18,
        border: "1px solid #1a2430",
        boxShadow: "0 16px 42px rgba(0,0,0,0.4)",
        background:
          "linear-gradient(145deg, #f8f7f4 0%, #efecea 48%, #f5f3ef 100%)",
      }}
    >
      {/* Left navy panel */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: "37%",
          background: "linear-gradient(180deg, #071421 0%, #0b1c2e 55%, #0a1726 100%)",
          clipPath: "polygon(0 0, 100% 0, 84% 100%, 0 100%)",
        }}
      />

      {/* Gold edge on diagonal */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{
          left: "31%",
          width: 4,
          background: "linear-gradient(180deg, #ffcc33, #f2b705 40%, #c99200)",
          clipPath: "polygon(0 0, 100% 0, 40% 100%, 0 100%)",
          opacity: 0.95,
        }}
      />

      {/* ROCA watermark */}
      <img
        src="/brand/roca-logo.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute select-none"
        style={{
          right: -8,
          top: 42,
          width: 168,
          height: "auto",
          opacity: 0.1,
          mixBlendMode: "multiply",
        }}
        crossOrigin="anonymous"
      />

      {/* Left column: logos + photo */}
      <div
        className="absolute left-0 top-0 z-10 flex h-full flex-col items-center px-3 pt-3 pb-5"
        style={{ width: "34%" }}
      >
        <div
          className="flex items-center justify-center overflow-hidden rounded-xl"
          style={{
            width: 118,
            height: 86,
            background: "#000",
            border: "2px solid #f2b705",
            boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
          }}
        >
          <img
            src="/brand/corona-logo.jpg"
            alt="Corona Soccer Park"
            className="h-full w-full object-contain"
            crossOrigin="anonymous"
          />
        </div>

        <div
          className="mt-3 overflow-hidden"
          style={{
            width: 112,
            height: 148,
            borderRadius: 10,
            border: "3px solid #f2b705",
            background: "#d4d4d4",
            boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
          }}
        >
          {data.fotoUrl ? (
            <img
              src={data.fotoUrl}
              alt={data.nombre || "Foto del jugador"}
              className="h-full w-full object-cover object-top"
              crossOrigin="anonymous"
            />
          ) : (
            <PhotoPlaceholder />
          )}
        </div>

        <div
          className="mt-auto flex items-center gap-1.5 rounded-md px-1.5 py-1"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          <img
            src="/brand/roca-logo.jpg"
            alt="ROCA Sport"
            style={{ height: 22, width: "auto" }}
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* Season badge */}
      <div className="absolute right-4 top-3 z-10 text-right">
        <div
          className="font-bold uppercase"
          style={{ fontSize: 8, letterSpacing: "0.2em", color: "#5c6770" }}
        >
          Temporada
        </div>
        <div
          className="font-black leading-none"
          style={{
            fontSize: 26,
            color: data.temporada ? "#0b1c2e" : "#c5cad0",
          }}
        >
          {data.temporada || "····"}
        </div>
        <div
          className="ml-auto mt-1"
          style={{ height: 3, width: 36, background: "#1a6b3a" }}
        />
      </div>

      {/* Right content */}
      <div className="absolute top-3 z-10" style={{ left: "36%", right: 14 }}>
        <div className="pr-20">
          <h2
            className="font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 17, color: "#0b1c2e" }}
          >
            Liga de Fútbol 7
          </h2>
          <p
            className="mt-1 font-extrabold uppercase tracking-[0.06em]"
            style={{ fontSize: 12, color: "#1a6b3a" }}
          >
            Corona Soccer Park
          </p>
          <div
            className="mt-2 flex overflow-hidden rounded-sm"
            style={{ height: 3, width: 200 }}
          >
            <span style={{ width: "45%", background: "#0b1c2e" }} />
            <span style={{ width: "28%", background: "#1a6b3a" }} />
            <span style={{ width: "27%", background: "#f2b705" }} />
          </div>
        </div>

        <div className="mt-2.5" style={{ maxWidth: 290 }}>
          <FieldRow icon={<UserIcon />} label="Nombre" value={data.nombre} />
          <FieldRow icon={<TeamIcon />} label="Equipo" value={data.equipo} />
          <FieldRow
            icon={<TrophyIcon />}
            label="Categoría"
            value={data.categoria}
          />
          <FieldRow
            icon={<PlayerRunIcon />}
            label="Posición"
            value={data.posicion}
          />
          <FieldRow
            icon={<IdCardIcon />}
            label="ID / Número"
            value={data.numero}
          />
          <FieldRow
            icon={<CalendarIcon />}
            label="Temporada"
            value={data.temporada}
          />
        </div>
      </div>

      {/* Footer badges */}
      <div
        className="absolute z-10 flex items-end justify-between gap-2 border-t pt-1.5"
        style={{
          bottom: 26,
          left: "36%",
          right: 14,
          borderColor: "rgba(11,28,46,0.12)",
        }}
      >
        <div className="flex flex-1 items-start justify-between gap-1">
          <FooterBadge
            icon={<ShieldCheckIcon className="h-3 w-3" />}
            text="No transferible"
          />
          <div style={{ height: 28, width: 1, background: "#d5d8dc" }} />
          <FooterBadge
            icon={<OfficialIdIcon className="h-3 w-3" />}
            text="ID oficial"
          />
          <div style={{ height: 28, width: 1, background: "#d5d8dc" }} />
          <FooterBadge
            icon={<WarningIcon className="h-3 w-3" />}
            text="Reporta pérdida"
          />
        </div>
        <span
          className="shrink-0 pb-0.5 font-semibold italic"
          style={{ fontSize: 9, color: "#1a6b3a" }}
        >
          Pasión que nos une
        </span>
      </div>

      {/* Bottom tricolor */}
      <div className="absolute inset-x-0 bottom-0 flex" style={{ height: 12 }}>
        <div
          style={{
            width: "40%",
            background: "#0b1c2e",
            clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
          }}
        />
        <div
          className="-ml-3"
          style={{
            width: "32%",
            background: "#1a6b3a",
            clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
          }}
        />
        <div
          className="-ml-3 flex-1"
          style={{
            background: "#f2b705",
            clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>
    </div>
  );
}

function FooterBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex max-w-[88px] flex-col items-center text-center">
      <div
        className="mb-0.5 flex items-center justify-center rounded-full"
        style={{
          width: 20,
          height: 20,
          border: "1px solid #1a6b3a",
          color: "#1a6b3a",
        }}
      >
        {icon}
      </div>
      <span
        className="font-bold uppercase leading-tight tracking-wide"
        style={{ fontSize: 6.5, color: "#0b1c2e" }}
      >
        {text}
      </span>
    </div>
  );
}
