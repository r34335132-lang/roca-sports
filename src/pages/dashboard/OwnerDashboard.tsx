import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { PlayerStudio } from "@/components/players/PlayerStudio";
import { calcBudget, clampPct, money, sumPayments } from "@/lib/finance";
import {
  createMatchday,
  fetchMatchdays,
  fetchPaymentsByLeague,
  fetchPlayersByLeague,
  fetchLeaguePricing,
  fetchTeamsByLeague,
  markPaymentPaid,
  updateLeague,
  upsertLeaguePricing,
  upsertTeamOfWeek,
} from "@/lib/services/leagues";
import type { Matchday, Player, PlayerPayment, Team } from "@/lib/types";

export function OwnerDashboard() {
  const { user, role, ownedLeagues, configured, refreshRoles, loading, rolesReady } = useAuth();
  const [params] = useSearchParams();
  const initial = params.get("liga") ?? ownedLeagues[0]?.id ?? "";
  const [leagueId, setLeagueId] = useState(initial);
  const league = ownedLeagues.find((l) => l.id === leagueId) ?? ownedLeagues[0] ?? null;

  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [payments, setPayments] = useState<PlayerPayment[]>([]);
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);
  const [fee, setFee] = useState(80);
  const [commission, setCommission] = useState(50);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [matchdayForm, setMatchdayForm] = useState({ number: 1, title: "Jornada 1" });
  const [totwIds, setTotwIds] = useState<string[]>([]);
  const [brand, setBrand] = useState({
    primary_color: "#b9ff00",
    secondary_color: "#0a0d0f",
    accent_color: "#ddff3e",
  });

  useEffect(() => {
    if (league) {
      setLeagueId(league.id);
      setBrand({
        primary_color: league.primary_color,
        secondary_color: league.secondary_color,
        accent_color: league.accent_color,
      });
    }
  }, [league?.id]);

  const load = async (id: string) => {
    const [t, p, pay, m, pricing] = await Promise.all([
      fetchTeamsByLeague(id),
      fetchPlayersByLeague(id),
      fetchPaymentsByLeague(id),
      fetchMatchdays(id),
      fetchLeaguePricing(id),
    ]);
    setTeams(t);
    setPlayers(p);
    setPayments(pay);
    setMatchdays(m);
    if (pricing) {
      setFee(Number(pricing.fee_per_player));
      setCommission(Number(pricing.platform_commission_pct));
    }
  };

  useEffect(() => {
    if (leagueId) void load(leagueId).catch((e) => setError(String(e.message ?? e)));
  }, [leagueId]);

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

  if (!configured) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="warn-banner">Configura el .env para operar tu liga.</p>
        </main>
      </>
    );
  }
  if (loading || !rolesReady) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="muted">Cargando tu liga…</p>
        </main>
      </>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (role === "admin") return <Navigate to="/dashboard/admin" replace />;

  if (!league) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad panel-empty">
          <h1>Aún no tienes ligas</h1>
          <p>Crea tu liga, sube equipos y jugadores, y personaliza tu branding.</p>
          <Link className="btn btn-primary" to="/crear-liga">
            Crear liga
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="section-pad dashboard owner-dash">
        <div className="section-head row-between">
          <div>
            <p className="eyebrow">Dueño de liga</p>
            <h1>{league.name}</h1>
          </div>
          <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)}>
            {ownedLeagues.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

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
            <span>Te toca ahora</span>
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
          Si cobran todos: entra {money(projected.gross)}, te quedan {money(projected.owner)} y
          ROCA se lleva {money(projected.platform)}.
        </p>

        {error && <p className="form-error">{error}</p>}
        {msg && <p className="ok-banner">{msg}</p>}

        <div className="dash-split">
          <section className="dash-panel">
            <h3>Personalizar liga</h3>
            <div className="form-row">
              <label>
                Primario
                <input
                  type="color"
                  value={brand.primary_color}
                  onChange={(e) => setBrand({ ...brand, primary_color: e.target.value })}
                />
              </label>
              <label>
                Secundario
                <input
                  type="color"
                  value={brand.secondary_color}
                  onChange={(e) => setBrand({ ...brand, secondary_color: e.target.value })}
                />
              </label>
              <label>
                Acento
                <input
                  type="color"
                  value={brand.accent_color}
                  onChange={(e) => setBrand({ ...brand, accent_color: e.target.value })}
                />
              </label>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={async () => {
                await updateLeague(league.id, brand);
                await refreshRoles();
                setMsg("Colores actualizados");
              }}
            >
              Guardar colores
            </button>

            <h4>Cuota e inscripción</h4>
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
              Al mover el porcentaje, tu ganancia y la de ROCA se recalculan al instante.
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

        <div className="dash-split">
          <section className="dash-panel">
            <h3>Jornadas</h3>
            <form
              className="inline-form"
              onSubmit={async (e: FormEvent) => {
                e.preventDefault();
                await createMatchday({
                  league_id: league.id,
                  number: matchdayForm.number,
                  title: matchdayForm.title,
                });
                await load(league.id);
                setMsg("Jornada publicada");
              }}
            >
              <input
                type="number"
                value={matchdayForm.number}
                onChange={(e) =>
                  setMatchdayForm({ ...matchdayForm, number: Number(e.target.value) })
                }
              />
              <input
                value={matchdayForm.title}
                onChange={(e) =>
                  setMatchdayForm({ ...matchdayForm, title: e.target.value })
                }
              />
              <button className="btn btn-outline" type="submit">
                Agregar
              </button>
            </form>
            <ul className="simple-list">
              {matchdays.map((m) => (
                <li key={m.id}>
                  <strong>
                    J{m.number} · {m.title}
                  </strong>
                  <span>{m.status}</span>
                </li>
              ))}
            </ul>

            <h4>Equipo de la semana</h4>
            <div className="chip-row wrap">
              {players.map((p) => {
                const on = totwIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`chip ${on ? "active" : ""}`}
                    onClick={() =>
                      setTotwIds((ids) =>
                        on ? ids.filter((x) => x !== p.id) : [...ids, p.id].slice(0, 11),
                      )
                    }
                  >
                    {p.full_name}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                await upsertTeamOfWeek({
                  league_id: league.id,
                  title: "Equipo de la semana",
                  week_label: `Jornada ${matchdays.at(-1)?.number ?? 1}`,
                  player_ids: totwIds,
                });
                setMsg("Equipo de la semana publicado");
              }}
            >
              Publicar equipo de la semana
            </button>
          </section>

          <section className="dash-panel">
            <h3>Pagos de jugadores</h3>
            <ul className="simple-list">
              {payments.map((p) => (
                <li key={p.id}>
                  <div>
                    <strong>{p.players?.full_name ?? "Jugador"}</strong>
                    <small>{money(Number(p.amount))} · {p.status}</small>
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
      </main>
      <SiteFooter />
    </>
  );
}
