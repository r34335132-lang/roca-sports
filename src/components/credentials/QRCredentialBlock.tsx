function hashCode(code: string) {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function QRCredentialBlock({
  code,
  accent = "#b9ff00",
  size = 72,
}: {
  code: string;
  accent?: string;
  size?: number;
}) {
  const seed = hashCode(code || "ROCA");
  const cells = 9;
  const dots: boolean[] = [];
  for (let i = 0; i < cells * cells; i++) {
    dots.push(((seed >> (i % 28)) ^ (i * 17)) % 3 !== 0);
  }

  return (
    <div
      className="qr-block"
      style={{ width: size, height: size, borderColor: `${accent}88` }}
      aria-label={`Código ${code}`}
    >
      <div
        className="qr-grid"
        style={{ gridTemplateColumns: `repeat(${cells}, 1fr)` }}
      >
        {dots.map((on, i) => (
          <span
            key={i}
            style={{ background: on ? accent : "transparent", opacity: on ? 0.95 : 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
