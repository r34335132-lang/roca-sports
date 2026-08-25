import { CrownIcon, SoccerBallIcon } from "@/components/icons";

export function CoronaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-[18px] border-[3px] border-[#f2b705] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] ${
        compact ? "px-3 py-2" : "px-4 py-3"
      }`}
    >
      <div className="absolute -top-3 text-[#f2b705] drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]">
        <CrownIcon className={compact ? "h-5 w-7" : "h-6 w-8"} />
      </div>
      <div className={`mt-1 flex items-center gap-1 font-black tracking-tight text-[#0b1c2e] ${compact ? "text-[18px]" : "text-[22px]"}`}>
        <span>C</span>
        <SoccerBallIcon className={compact ? "h-4 w-4" : "h-5 w-5"} />
        <span>RONA</span>
      </div>
      <div
        className={`-mt-0.5 font-semibold italic leading-none text-[#0b1c2e] ${
          compact ? "text-[11px]" : "text-[13px]"
        }`}
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        Soccer
      </div>
      <div className={`font-black tracking-[0.18em] text-[#5c7a14] ${compact ? "text-[12px]" : "text-[14px]"}`}>
        PARK
      </div>
    </div>
  );
}
