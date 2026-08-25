/**
 * Smoke checks for the Corona cédulas generator.
 * Run with: node scripts/smoke-check.mjs  (dev server must be on :3000)
 */
const res = await fetch("http://localhost:3000");
if (!res.ok) {
  console.error("FAIL status", res.status);
  process.exit(1);
}
const html = await res.text();
const checks = [
  ["page loads", true],
  ["form title", /Generador de c[eé]dulas/i.test(html)],
  ["nombre field", /Nombre del jugador/i.test(html)],
  ["equipo field", /Equipo/i.test(html)],
  ["download png", /Descargar PNG/i.test(html)],
  ["download pdf", /Descargar PDF/i.test(html)],
  ["print", /Imprimir/i.test(html)],
  ["cedula root", /cedula-card|cedula-print-root/i.test(html)],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "OK" : "FAIL"}  ${name}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
console.log("\nSmoke checks passed. Open http://localhost:3000 to verify photo/PDF/PNG interactively.");
