import type { League, LeaguePricing, PlayerPayment } from "@/lib/types";

export function clampPct(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function money(value: number, currency = "MXN") {
  return Number(value || 0).toLocaleString("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}

export function calcBudget(params: {
  players: number;
  feePerPlayer: number;
  commissionPct: number;
}) {
  const players = Number(params.players) || 0;
  const fee = Number(params.feePerPlayer) || 0;
  const commissionPct = clampPct(Number(params.commissionPct) || 0);
  const gross = players * fee;
  const platform = Math.round((gross * commissionPct) / 100);
  const owner = gross - platform;
  return { gross, platform, owner, commissionPct };
}

export function paymentAmount(payment: PlayerPayment) {
  return Number(payment.amount) || 0;
}

export function sumPayments(payments: PlayerPayment[], status?: PlayerPayment["status"]) {
  return payments
    .filter((p) => (status ? p.status === status : true))
    .reduce((acc, p) => acc + paymentAmount(p), 0);
}

export type LeagueFinance = {
  leagueId: string;
  name: string;
  sport: string;
  fee: number;
  commissionPct: number;
  paid: number;
  pending: number;
  income: number;
  platform: number;
  owner: number;
  outflow: number;
};

export function leagueFinance(
  league: Pick<League, "id" | "name" | "sport">,
  payments: PlayerPayment[],
  pricing: LeaguePricing | null | undefined,
  fallbackCommission: number,
  fallbackFee = 80,
): LeagueFinance {
  const leaguePayments = payments.filter((p) => p.league_id === league.id);
  const fee = Number(pricing?.fee_per_player ?? fallbackFee) || fallbackFee;
  const commissionPct = clampPct(
    Number(pricing?.platform_commission_pct ?? fallbackCommission) || 0,
  );
  const paid = sumPayments(leaguePayments, "paid");
  const pending = sumPayments(leaguePayments, "pending");
  const income = paid;
  const platform = Math.round((income * commissionPct) / 100);
  const owner = income - platform;
  return {
    leagueId: league.id,
    name: league.name,
    sport: league.sport,
    fee,
    commissionPct,
    paid,
    pending,
    income,
    platform,
    owner,
    outflow: owner,
  };
}

export function calcPlatformFinance(params: {
  leagues: Array<Pick<League, "id" | "name" | "sport">>;
  payments: PlayerPayment[];
  pricingMap: Record<string, LeaguePricing | null | undefined>;
  commissionPct?: number;
  previewCommission?: number | null;
}) {
  const preview = params.previewCommission;
  const rows = params.leagues.map((league) => {
    const pricing = params.pricingMap[league.id];
    const commission =
      preview == null ? Number(pricing?.platform_commission_pct ?? params.commissionPct ?? 50) : preview;
    return leagueFinance(league, params.payments, {
      ...(pricing ?? {
        id: "",
        league_id: league.id,
        fee_per_player: 80,
        platform_commission_pct: commission,
        currency: "MXN",
        created_at: "",
        updated_at: "",
      }),
      platform_commission_pct: commission,
    }, commission);
  });

  const income = rows.reduce((acc, row) => acc + row.income, 0);
  const pending = rows.reduce((acc, row) => acc + row.pending, 0);
  const platform = rows.reduce((acc, row) => acc + row.platform, 0);
  const ownerOutflow = rows.reduce((acc, row) => acc + row.owner, 0);
  const grossProjected = rows.reduce((acc, row) => acc + row.paid + row.pending, 0);

  return {
    rows,
    income,
    pending,
    platform,
    ownerOutflow,
    outflow: ownerOutflow,
    balance: income - ownerOutflow,
    grossProjected,
  };
}
