export function SportMark({
  sport,
  className = "",
}: {
  sport?: string | null;
  className?: string;
}) {
  const kind = sport || "other";
  return (
    <svg className={`sport-mark ${className}`} viewBox="0 0 32 32" aria-hidden="true">
      {kind === "basketball" && (
        <>
          <circle cx="16" cy="16" r="13" />
          <path d="M16 3v26M3 16h26M7 7c6 5 12 5 18 0M7 25c6-5 12-5 18 0" />
        </>
      )}
      {kind === "soccer" && (
        <>
          <circle cx="16" cy="16" r="13" />
          <path d="M16 9l4 3-1.5 5h-5L12 12l4-3zM7 14l5-2M25 14l-5-2M10 24l2-7M22 24l-2-7" />
        </>
      )}
      {kind === "boxing" && (
        <>
          <path d="M7 14c0-4 3-7 7-7h1c4 0 7 3 7 7v6c0 2-2 4-4 4H11c-2 0-4-2-4-4v-6z" />
          <path d="M22 15c3 0 5 2 5 5v2c0 2-2 3-4 3h-3" />
          <path d="M9 11h8" />
        </>
      )}
      {kind === "flag" && (
        <>
          <path d="M6 6v20M6 7h14l-3 5 3 5H6" />
        </>
      )}
      {kind === "baseball" && (
        <>
          <circle cx="16" cy="16" r="13" />
          <path d="M8 8c5 5 5 11 0 16M24 8c-5 5-5 11 0 16" />
        </>
      )}
      {kind === "volleyball" && (
        <>
          <circle cx="16" cy="16" r="13" />
          <path d="M6 14c8-6 12-6 20 0M6 20c8 4 12 4 20 0M16 4c-3 8-3 16 0 24" />
        </>
      )}
      {kind === "cycling" && (
        <>
          <circle cx="9" cy="21" r="5" />
          <circle cx="23" cy="21" r="5" />
          <path d="M9 21l6-9h6l2 9M15 12l4 9M18 8h4" />
        </>
      )}
      {(kind === "other" ||
        ![
          "basketball",
          "soccer",
          "boxing",
          "flag",
          "baseball",
          "volleyball",
          "cycling",
        ].includes(kind)) && (
        <>
          <path d="M16 4l3 8h8l-6.5 5 2.5 8L16 20l-7 5 2.5-8L5 12h8z" />
        </>
      )}
    </svg>
  );
}
