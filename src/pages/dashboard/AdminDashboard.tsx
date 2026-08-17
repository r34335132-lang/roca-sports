import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import {
  loadCollaborators,
  saveCollaborators,
  DEFAULT_COLLABORATORS,
  emptyCollaborator,
  collaboratorCuts,
  type Collaborator,
} from "@/lib/collaborators";
import {
  calcPlatformFinance,
  clampPct,
  money,
  sumPayments,
} from "@/lib/finance";
import {
  countAllPlayers,
  countAllTeams,
  fetchAllPayments,
  fetchLeagues,
  fetchLeaguePricing,
  markPaymentPaid,
  upsertLeaguePricing,
} from "@/lib/services/leagues";
import {
  fetchPlatformCollaborators,
  savePlatformCollaborators,
} from "@/lib/services/platform";
import { LeagueWorkspace } from "@/components/leagues/LeagueWorkspace";
import { getDefaultCommissionPct } from "@/lib/supabase";
import type { League, LeaguePricing, PlayerPayment } from "@/lib/types";
import { SPORT_IMAGES, SPORT_LABELS } from "@/lib/types";

export function AdminDashboard() {
  const { user, role, configured, loading, rolesReady } = useAuth();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [payments, setPayments] = useState<PlayerPayment[]>([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [pricingMap, setPricingMap] = useState<Record<string, LeaguePricing | null>>({});
  const [commission, setCommission] = useState(getDefaultCommissionPct());
  const [collaborators, setCollaborators] = useState<Collaborator[]>(DEFAULT_COLLABORATORS);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [savingPct, setSavingPct] = useState(false);
  const [collabDb, setCollabDb] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState("");

  const load = async () => {
    try {
      const [l, p, c, teams, collabs] = await Promise.all([
        fetchLeagues(),
        fetchAllPayments(),
        countAllPlayers(),
        countAllTeams(),
        fetchPlatformCollaborators(),
      ]);
      setLeagues(l);
      setPayments(p);
      setPlayerCount(c);
      setTeamCount(teams);
      setSelectedLeagueId((current) => current || l[0]?.id || "");
      if (collabs) {
        setCollaborators(collabs);
        setCollabDb(true);
      } else {
        setCollaborators(loadCollaborators());
        setCollabDb(false);
      }
      const map: Record<string, LeaguePricing | null> = {};
      await Promise.all(
        l.map(async (league) => {
          map[league.id] = await fetchLeaguePricing(league.id);
        }),
      );
      setPricingMap(map);
      const firstPct = Object.values(map).find((row) => row)?.platform_commission_pct;
      if (firstPct != null) setCommission(Number(firstPct));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  };

  useEffect(() => {
    if (configured && rolesReady && role === "admin") void load();
  }, [configured, rolesReady, role]);

  const persistCollaborators = (next: Collaborator[]) => {
    setCollaborators(next);
    saveCollaborators(next);
    if (collabDb) {
      void savePlatformCollaborators(next).catch(() => {
        setCollabDb(false);
      });
    }
  };

  const finance = useMemo(
    () =>
      calcPlatformFinance({
        leagues,
        payments,
        pricingMap,
        commissionPct: commission,
        previewCommission: commission,
      }),
    [leagues, payments, pricingMap, commission],
  );

  const paidCount = payments.filter((p) => p.status === "paid").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const paidAmount = sumPayments(payments, "paid");
  const pendingAmount = sumPayments(payments, "pending");
  const splits = useMemo(
    () => collaboratorCuts(collaborators, finance.platform),
    [collaborators, finance.platform],
  );
  const pctOk = Math.abs(splits.totalPct - 100) < 0.5;
  const selectedLeague = leagues.find((l) => l.id === selectedLeagueId) ?? leagues[0] ?? null;

  const updateCollaborator = (id: string, patch: Partial<Collaborator>) => {
    persistCollaborators(
      collaborators.map((c) =>
        c.id === id
          ? {
              ...c,
              ...patch,
              pct: patch.pct == null ? c.pct : clampPct(Number(patch.pct)),
            }
          : c,
      ),
    );
  };

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

  if (loading || !rolesReady) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="muted">Cargando centro de operaciones…</p>
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
              El acceso se toma de la base de datos. En <code>profiles</code> tu fila debe tener{" "}
              <code>role = admin</code>.
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
      <main className="section-pad dashboard admin-dash finance-dash">
        <div className="section-head row-between">
          <div>
            <p className="eyebrow">Admin ROCA</p>
            <h1>Centro de operaciones</h1>
            <p className="muted">
              Todas las ligas, ingresos, salidas y el corte de cada colaborador — desde la misma
              base de datos.
            </p>
          </div>
          <label className="commission-control live-pct">
            Comisión ROCA
            <div className="pct-input">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={commission}
                onChange={(e) => setCommission(clampPct(Number(e.target.value)))}
              />
              <input
                type="number"
                min={0}
                max={100}
                value={commission}
                onChange={(e) => setCommission(clampPct(Number(e.target.value)))}
              />
              <span>%</span>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              disabled={savingPct}
              onClick={async () => {
                setSavingPct(true);
                setError(null);
                try {
                  await Promise.all(
                    leagues.map(async (league) => {
                      const fee = Number(pricingMap[league.id]?.fee_per_player ?? 80);
                      await upsertLeaguePricing(league.id, fee, commission);
                    }),
                  );
                  await load();
                  setMsg(`Comisión del ${commission}% aplicada a todas las ligas`);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "No se pudo guardar");
                } finally {
                  setSavingPct(false);
                }
              }}
            >
              {savingPct ? "Guardando..." : "Aplicar a ligas"}
            </button>
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}
        {msg && <p className="ok-banner">{msg}</p>}

        <div className="kpi-grid owner-kpis admin-overview">
          <article className="kpi">
            <span>Ligas</span>
            <strong>{leagues.length}</strong>
          </article>
          <article className="kpi">
            <span>Equipos</span>
            <strong>{teamCount}</strong>
          </article>
          <article className="kpi">
            <span>Jugadores</span>
            <strong>{playerCount}</strong>
          </article>
          <article className="kpi highlight">
            <span>Pagos cobrados</span>
            <strong>{paidCount}</strong>
          </article>
        </div>

        <div className="finance-hero">
          <article className="finance-stat in">
            <span>Ingresó</span>
            <strong>{money(finance.income)}</strong>
            <small>{paidCount} pagos cobrados · {playerCount} jugadores</small>
          </article>
          <article className="finance-stat out">
            <span>Salió a dueños</span>
            <strong>{money(finance.outflow)}</strong>
            <small>Parte de las ligas después de comisión</small>
          </article>
          <article className="finance-stat hold">
            <span>Caja ROCA</span>
            <strong>{money(finance.platform)}</strong>
            <small>Se reparte entre colaboradores</small>
          </article>
          <article className="finance-stat wait">
            <span>Por cobrar</span>
            <strong>{money(pendingAmount)}</strong>
            <small>{pendingCount} pagos pendientes</small>
          </article>
        </div>

        <section className="flow-panel">
          <div className="flow-head">
            <h3>Flujo de dinero</h3>
            <p>
              De {money(paidAmount)} cobrados, {money(finance.outflow)} salen a dueños y{" "}
              {money(finance.platform)} se quedan en ROCA ({commission}%).
            </p>
          </div>
          <div className="flow-bar" aria-hidden="true">
            <i style={{ width: `${paidAmount ? (finance.outflow / paidAmount) * 100 : 0}%` }} />
            <b style={{ width: `${paidAmount ? (finance.platform / paidAmount) * 100 : 0}%` }} />
          </div>
          <div className="flow-legend">
            <span>Dueños {100 - commission}%</span>
            <span>ROCA {commission}%</span>
          </div>
        </section>

        <section className="dash-panel collab-panel">
          <div className="row-between">
            <div>
              <h3>Colaboradores ROCA</h3>
              <p className="muted">
                Cambia el porcentaje y el pago se actualiza al momento sobre la caja de{" "}
                {money(finance.platform)}.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => persistCollaborators([...collaborators, emptyCollaborator()])}
            >
              Agregar colaborador
            </button>
          </div>

          <div className={`pct-total ${pctOk ? "ok" : "warn"}`}>
            Reparto {splits.totalPct.toFixed(0)}% · Reserva {money(splits.remainder)}
          </div>

          <div className="collab-grid">
            {splits.cuts.map((c) => (
              <article key={c.id} className="collab-card">
                <div className="collab-avatar">{(c.name || "C").slice(0, 1).toUpperCase()}</div>
                <div className="collab-fields">
                  <input
                    value={c.name}
                    placeholder="Nombre"
                    onChange={(e) => updateCollaborator(c.id, { name: e.target.value })}
                  />
                  <input
                    value={c.role}
                    placeholder="Rol"
                    onChange={(e) => updateCollaborator(c.id, { role: e.target.value })}
                  />
                </div>
                <label className="collab-pct">
                  <span>{c.pct}%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={c.pct}
                    onChange={(e) => updateCollaborator(c.id, { pct: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={c.pct}
                    onChange={(e) => updateCollaborator(c.id, { pct: Number(e.target.value) })}
                  />
                </label>
                <strong className="collab-pay">{money(c.amount)}</strong>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => persistCollaborators(collaborators.filter((x) => x.id !== c.id))}
                >
                  Quitar
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="dash-panel hq-leagues">
          <div className="row-between">
            <div>
              <h3>Editar cualquier liga</h3>
              <p className="muted">
                Elige un torneo para cambiar logo, colores, jugadores, jornadas y cuotas.
              </p>
            </div>
            <div className="row-between">
              <select
                value={selectedLeagueId}
                onChange={(e) => setSelectedLeagueId(e.target.value)}
              >
                {leagues.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              <Link className="btn btn-outline" to="/crear-liga">
                Crear liga
              </Link>
            </div>
          </div>
          <div className="league-cards">
            {leagues.map((league) => {
              const row = finance.rows.find((r) => r.leagueId === league.id);
              const active = league.id === selectedLeagueId;
              return (
                <button
                  key={league.id}
                  type="button"
                  className={`league-card ${active ? "is-selected" : ""}`}
                  style={{
                    backgroundImage: `linear-gradient(160deg, rgba(5,7,8,.9), rgba(5,7,8,.55)), url(${
                      league.banner_url || SPORT_IMAGES[league.sport]
                    })`,
                    borderColor: active ? league.accent_color : `${league.accent_color}55`,
                  }}
                  onClick={() => setSelectedLeagueId(league.id)}
                >
                  <p className="eyebrow">{SPORT_LABELS[league.sport] ?? league.sport}</p>
                  <h3>{league.name}</h3>
                  <p>
                    {league.city} · {league.season}
                  </p>
                  <small>
                    Ingresó {money(row?.income ?? 0)} · ROCA {money(row?.platform ?? 0)}
                  </small>
                </button>
              );
            })}
            {leagues.length === 0 && <p className="muted">Aún no hay ligas en la base de datos.</p>}
          </div>
        </section>

        {selectedLeague && (
          <LeagueWorkspace
            league={selectedLeague}
            onLeagueSaved={async (updated) => {
              setLeagues((list) => list.map((row) => (row.id === updated.id ? updated : row)));
            }}
          />
        )}

        <div className="dash-split">
          <section className="dash-panel">
            <h3>Corte por liga</h3>
            <ul className="simple-list">
              {finance.rows.map((row) => (
                <li key={row.leagueId}>
                  <div>
                    <strong>{row.name}</strong>
                    <small>
                      {SPORT_LABELS[row.sport] ?? row.sport} · cuota {money(row.fee)} · ROCA{" "}
                      {row.commissionPct}%
                    </small>
                  </div>
                  <span>
                    {money(row.income)} in · {money(row.platform)} ROCA
                  </span>
                </li>
              ))}
              {finance.rows.length === 0 && <li>Aún no hay ligas.</li>}
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
                      <td>{money(Number(p.amount))}</td>
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
