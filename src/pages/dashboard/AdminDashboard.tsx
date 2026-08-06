import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import {
  calcBudget,
  countAllPlayers,
  fetchAllPayments,
  fetchLeagues,
  fetchLeaguePricing,
  markPaymentPaid,
} from "@/lib/services/leagues";
import { getDefaultCommissionPct } from "@/lib/supabase";
import type { League, LeaguePricing, PlayerPayment } from "@/lib/types";
import { SPORT_LABELS } from "@/lib/types";

export function AdminDashboard() {
  const { user, role, configured } = useAuth();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [payments, setPayments] = useState<PlayerPayment[]>([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [pricingMap, setPricingMap] = useState<Record<string, LeaguePricing | null>>({});
  const [commission, setCommission] = useState(getDefaultCommissionPct());
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const [l, p, c] = await Promise.all([
        fetchLeagues(),
        fetchAllPayments(),
        countAllPlayers(),
      ]);
      setLeagues(l);
      setPayments(p);
      setPlayerCount(c);
      const map: Record<string, LeaguePricing | null> = {};
      await Promise.all(
        l.map(async (league) => {
          map[league.id] = await fetchLeaguePricing(league.id);
        }),
      );
      setPricingMap(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  };

  useEffect(() => {
    if (configured) void load();
  }, [configured]);

  const paid = payments.filter((p) => p.status === "paid");
  const pending = payments.filter((p) => p.status === "pending");
  const avgFee =
    Object.values(pricingMap).find((p) => p)?.fee_per_player ?? 80;

  const budget = useMemo(
    () =>
      calcBudget({
        players: playerCount,
        feePerPlayer: Number(avgFee),
        commissionPct: commission,
      }),
    [playerCount, avgFee, commission],
  );

  if (!configured) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="warn-banner">Pon tu .env de Supabase para ver el dashboard admin.</p>
        </main>
      </>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (role !== "admin") {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <div className="panel-empty">
            <h2>Solo admin</h2>
            <p>
              Agrega tu email en <code>VITE_ADMIN_EMAILS</code> del .env para acceder.
            </p>
            <Link className="btn btn-outline" to="/dashboard/dueno">
              Ir a dashboard dueño
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="section-pad dashboard admin-dash">
        <div className="section-head row-between">
          <div>
            <p className="eyebrow">Admin ROCA</p>
            <h1>Centro de operaciones</h1>
          </div>
          <label className="commission-control">
            Mi comisión %
            <input
              type="number"
              min={0}
              max={100}
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
            />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="kpi-grid">
          <article className="kpi">
            <span>Ligas inscritas</span>
            <strong>{leagues.length}</strong>
          </article>
          <article className="kpi">
            <span>Jugadores</span>
            <strong>{playerCount}</strong>
          </article>
          <article className="kpi">
            <span>Pagados</span>
            <strong>{paid.length}</strong>
          </article>
          <article className="kpi">
            <span>Pendientes</span>
            <strong>{pending.length}</strong>
          </article>
          <article className="kpi highlight">
            <span>Presupuesto bruto</span>
            <strong>${budget.gross.toLocaleString("es-MX")}</strong>
          </article>
          <article className="kpi highlight">
            <span>ROCA se lleva ({commission}%)</span>
            <strong>${budget.platform.toLocaleString("es-MX")}</strong>
          </article>
          <article className="kpi">
            <span>Dueños reciben</span>
            <strong>${budget.owner.toLocaleString("es-MX")}</strong>
          </article>
          <article className="kpi">
            <span>Cuota promedio</span>
            <strong>${Number(avgFee).toLocaleString("es-MX")}</strong>
          </article>
        </div>

        <div className="dash-split">
          <section className="dash-panel">
            <h3>Ligas registradas</h3>
            <ul className="simple-list">
              {leagues.map((l) => (
                <li key={l.id}>
                  <div>
                    <strong>{l.name}</strong>
                    <small>
                      {SPORT_LABELS[l.sport]} · {l.city}
                    </small>
                  </div>
                  <span>
                    ${Number(pricingMap[l.id]?.fee_per_player ?? 80)} ·{" "}
                    {Number(pricingMap[l.id]?.platform_commission_pct ?? commission)}%
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="dash-panel">
            <h3>Quién ya pagó</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Jugador</th>
                    <th>Liga</th>
                    <th>Monto</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td>{p.players?.full_name ?? p.player_id.slice(0, 8)}</td>
                      <td>{p.leagues?.name ?? "—"}</td>
                      <td>${Number(p.amount).toLocaleString("es-MX")}</td>
                      <td>
                        <span className={`pill status-${p.status}`}>{p.status}</span>
                      </td>
                      <td>
                        {p.status !== "paid" && (
                          <button
                            type="button"
                            className="ghost-btn"
                            onClick={async () => {
                              await markPaymentPaid(p.id);
                              await load();
                            }}
                          >
                            Marcar pagado
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5}>Sin pagos aún. Corre la migración de player_payments.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
