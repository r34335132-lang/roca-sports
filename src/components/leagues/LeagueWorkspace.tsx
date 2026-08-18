import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LeagueBrandEditor } from "@/components/leagues/LeagueBrandEditor";
import { LeagueOpsDesk } from "@/components/leagues/LeagueOpsDesk";
import { PlayerStudio } from "@/components/players/PlayerStudio";
import { calcBudget, clampPct, money, sumPayments } from "@/lib/finance";
import {
  fetchPaymentsByLeague,
  fetchPlayersByLeague,
  fetchLeaguePricing,
  fetchTeamsByLeague,
  markPaymentPaid,
  upsertLeaguePricing,
} from "@/lib/services/leagues";
import type { League, Player, PlayerPayment, Team } from "@/lib/types";

export function LeagueWorkspace({
  league,
  onLeagueSaved,
}: {
  league: League;
  onLeagueSaved: (league: League) => Promise<void> | void;
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [payments, setPayments] = useState<PlayerPayment[]>([]);
  const [fee, setFee] = useState(80);
  const [commission, setCommission] = useState(50);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (id: string) => {
    const [t, p, pay, pricing] = await Promise.all([
      fetchTeamsByLeague(id),
      fetchPlayersByLeague(id),
      fetchPaymentsByLeague(id),
      fetchLeaguePricing(id),
    ]);
    setTeams(t);
    setPlayers(p);
    setPayments(pay);
    if (pricing) {
      setFee(Number(pricing.fee_per_player));
      setCommission(Number(pricing.platform_commission_pct));
    }
  };

  useEffect(() => {
    setMsg(null);
    setError(null);
    void load(league.id).catch((e) => setError(String(e.message ?? e)));
  }, [league.id]);

  const paidIn = useMemo(() => sumPayments(payments, "paid"), [payments]);
  const pendingIn = useMemo(() => sumPayments(payments, "pending"), [payments]);
  const liveCommission = clampPct(commission);
  const liveFee = Number(fee) || 0;
  const projected = useMemo(
    () =>
      calcBudget({
        players: players.length,
        feePerPlayer: liveFee,
        commissionPct: liveCommission,
      }),
    [players.length, liveFee, liveCommission],
  );
  const collected = useMemo(
    () =>
      calcBudget({
        players: 1,
        feePerPlayer: paidIn,
        commissionPct: liveCommission,
      }),
    [paidIn, liveCommission],
  );

  return (
    <div className="league-workspace">
      <div className="kpi-grid owner-kpis">
        <article className="kpi">
          <span>Equipos</span>
          <strong>{teams.length}</strong>
        </article>
        <article className="kpi">
          <span>Jugadores</span>
          <strong>{players.length}</strong>
        </article>
      </div>

      <div className="finance-hero owner-finance">
        <article className="finance-stat in">
          <span>Ingresó</span>
          <strong>{money(paidIn)}</strong>
          <small>Pagos cobrados de jugadores</small>
        </article>
        <article className="finance-stat wait">
          <span>Por cobrar</span>
          <strong>{money(pendingIn)}</strong>
          <small>Aún no entra a caja</small>
        </article>
        <article className="finance-stat hold">
          <span>Le toca al dueño</span>
          <strong>{money(collected.owner)}</strong>
          <small>{100 - liveCommission}% de lo cobrado</small>
        </article>
        <article className="finance-stat out">
          <span>Sale a ROCA</span>
          <strong>{money(collected.platform)}</strong>
          <small>{liveCommission}% de comisión</small>
        </article>
      </div>
      <p className="muted finance-note">
        Si cobran todos: entra {money(projected.gross)}, quedan {money(projected.owner)} para el
        dueño y ROCA se lleva {money(projected.platform)}.
      </p>

      {error && <p className="form-error">{error}</p>}
      {msg && <p className="ok-banner">{msg}</p>}

      <div className="dash-split">
        <LeagueBrandEditor league={league} onSaved={onLeagueSaved} />
        <section className="dash-panel">
          <h3>Cuota e inscripción</h3>
          <div className="form-row">
            <label>
              Cobrar por jugador ($)
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
              />
            </label>
            <label>
              Comisión ROCA (%)
              <div className="pct-input">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={liveCommission}
                  onChange={(e) => setCommission(clampPct(Number(e.target.value)))}
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={liveCommission}
                  onChange={(e) => setCommission(clampPct(Number(e.target.value)))}
                />
                <span>%</span>
              </div>
            </label>
          </div>
          <p className="muted">
            Al mover el porcentaje, la ganancia del dueño y la de ROCA se recalculan al instante.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              await upsertLeaguePricing(league.id, liveFee, liveCommission);
              setMsg("Pricing guardado");
            }}
          >
            Guardar pricing
          </button>
        </section>
      </div>

      <PlayerStudio leagues={[league]} defaultLeagueId={league.id} />

      <LeagueOpsDesk
        league={league}
        players={players}
        teams={teams}
        onRefresh={async () => {
          await load(league.id);
        }}
      />

      <section className="dash-panel">
          <h3>Pagos de jugadores</h3>
          <ul className="simple-list">
            {payments.map((p) => (
              <li key={p.id}>
                <div>
                  <strong>{p.players?.full_name ?? "Jugador"}</strong>
                  <small>
                    {money(Number(p.amount))} · {p.status}
                  </small>
                </div>
                {p.status !== "paid" && (
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={async () => {
                      await markPaymentPaid(p.id);
                      await load(league.id);
                    }}
                  >
                    Pagó
                  </button>
                )}
              </li>
            ))}
            {payments.length === 0 && <li>Sin registros de pago (corre la migración SQL).</li>}
          </ul>
          <Link className="text-link" to={`/liga/${league.slug || league.id}`}>
            Ver página pública de la liga →
          </Link>
      </section>
    </div>
  );
}
