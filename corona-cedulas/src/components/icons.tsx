export function CrownIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 48" fill="currentColor" aria-hidden="true">
      <path d="M8 40h48L52 18l-12 12L32 8 24 30 12 18 8 40z" />
      <rect x="6" y="38" width="52" height="6" rx="1" />
      <circle cx="12" cy="16" r="3.5" />
      <circle cx="32" cy="6" r="3.5" />
      <circle cx="52" cy="16" r="3.5" />
    </svg>
  );
}

export function SoccerBallIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#f4f4f4" stroke="#0b1c2e" strokeWidth="3" />
      <path
        d="M32 18l8 6-3 10h-10l-3-10 8-6z"
        fill="#0b1c2e"
      />
      <path
        d="M18 26l6-4 3 10-8 4-5-6zm28 0l-6-4-3 10 8 4 5-6zM22 46l6-4h8l6 4-4 6H26l-4-6z"
        fill="#0b1c2e"
      />
    </svg>
  );
}

export function UserIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.8-3.2 4-4.8 7-4.8S17.2 15.8 19 19" />
    </svg>
  );
}

export function TeamIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="8" r="2.5" />
      <path d="M3.5 18c.8-2.4 2.2-3.6 4.5-3.6S11.7 15.6 12.5 18" />
      <path d="M11.5 18c.8-2.4 2.2-3.6 4.5-3.6s3.7 1.2 4.5 3.6" />
    </svg>
  );
}

export function TrophyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 4h8v5a4 4 0 01-8 0V4z" />
      <path d="M8 6H5.5A2.5 2.5 0 008 9.5M16 6h2.5A2.5 2.5 0 0116 9.5" />
      <path d="M10 13h4v2h-4zM9 19h6M12 15v4" />
    </svg>
  );
}

export function PlayerRunIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="14" cy="5" r="2.2" />
      <path d="M8 21l2.5-5 3 2 2-4M10.5 16l-2-3 4-2 2.5 1.5" />
    </svg>
  );
}

export function IdCardIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M13 10.5h5M13 13.5h4" />
    </svg>
  );
}

export function CalendarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5V7M16 3.5V7M3.5 10h17" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3z" />
      <path d="M8.5 12.2l2.3 2.3 4.7-4.7" />
    </svg>
  );
}

export function OfficialIdIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7.5 18c1.3-2.2 2.8-3.2 4.5-3.2S15.2 15.8 16.5 18" />
    </svg>
  );
}

export function WarningIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 4l9 16H3L12 4z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </svg>
  );
}

export function PhotoPlaceholder({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 150" fill="none" aria-hidden="true">
      <rect width="120" height="150" fill="#c8c8c8" />
      <circle cx="60" cy="52" r="24" fill="#8f8f8f" />
      <path d="M20 140c6-28 22-42 40-42s34 14 40 42" fill="#8f8f8f" />
    </svg>
  );
}
