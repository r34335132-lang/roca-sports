/** Decorative rock / crystal “R” watermark inspired by the reference card. */
export function RockWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 280"
      fill="none"
      aria-hidden="true"
      style={{ position: "absolute", right: -24, top: 32, width: 200, height: 250 }}
    >
      <defs>
        <linearGradient id="rockFill" x1="40" y1="20" x2="190" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d7d9dc" />
          <stop offset="0.45" stopColor="#b7bcc2" />
          <stop offset="1" stopColor="#9aa1a8" />
        </linearGradient>
        <linearGradient id="rockGlow" x1="70" y1="60" x2="140" y2="210" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f2b705" stopOpacity="0.95" />
          <stop offset="1" stopColor="#8fbf1a" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path
        d="M118 18c28 8 62 34 74 72 10 32 4 74-18 108-16 24-42 44-74 52-30 8-62-4-82-28-18-22-24-54-14-82 12-34 42-62 74-78 12-6 26-10 40-44z"
        fill="url(#rockFill)"
        opacity="0.55"
      />
      <path
        d="M96 52c18-8 40-4 54 12 12 14 16 34 8 52-6 14-18 24-32 28l24 58c4 10-2 18-12 16l-46-12c-8-2-12-10-8-18l20-46c-14-2-26-12-30-26-6-18 4-38 22-64z"
        fill="#8d949c"
        opacity="0.45"
      />
      <path
        d="M104 78c10-6 24-4 32 6 8 10 8 24 0 34-8 10-22 14-32 6-10-6-12-22-0-46z"
        fill="url(#rockGlow)"
        opacity="0.9"
      />
      <path
        d="M98 118l18 42 28 8-10-28-20-8-16-14z"
        fill="url(#rockGlow)"
        opacity="0.75"
      />
      <path
        d="M70 96c18-22 46-34 74-30 8 1 12 10 8 16-20 28-46 42-78 48-8 1-12-8-4-34z"
        stroke="#f2b705"
        strokeWidth="3"
        opacity="0.55"
      />
    </svg>
  );
}
