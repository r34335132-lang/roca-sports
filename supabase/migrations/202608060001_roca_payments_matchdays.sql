-- Extensiones ROCA Sports sobre la misma DB de Los Rafas
-- Ejecutar DESPUÉS de las migraciones de league_platform / sports_matches

create table if not exists public.league_pricing (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade unique,
  fee_per_player numeric(10,2) not null default 80,
  platform_commission_pct numeric(5,2) not null default 50,
  currency text not null default 'MXN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_payments (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  league_id uuid not null references public.leagues(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','waived','overdue')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matchdays (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  number int not null,
  title text not null,
  starts_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled','live','finished')),
  created_at timestamptz not null default now(),
  unique(league_id, number)
);

create table if not exists public.team_of_week (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  matchday_id uuid references public.matchdays(id) on delete set null,
  title text not null default 'Equipo de la semana',
  week_label text not null,
  player_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists player_payments_league_id_idx on public.player_payments(league_id);
create index if not exists player_payments_status_idx on public.player_payments(status);
create index if not exists matchdays_league_id_idx on public.matchdays(league_id);
create index if not exists team_of_week_league_id_idx on public.team_of_week(league_id);

drop trigger if exists league_pricing_set_updated_at on public.league_pricing;
create trigger league_pricing_set_updated_at before update on public.league_pricing
for each row execute function public.set_updated_at();

drop trigger if exists player_payments_set_updated_at on public.player_payments;
create trigger player_payments_set_updated_at before update on public.player_payments
for each row execute function public.set_updated_at();

alter table public.league_pricing enable row level security;
alter table public.player_payments enable row level security;
alter table public.matchdays enable row level security;
alter table public.team_of_week enable row level security;

drop policy if exists "Public read pricing" on public.league_pricing;
create policy "Public read pricing" on public.league_pricing for select using (true);

drop policy if exists "Owners manage pricing" on public.league_pricing;
create policy "Owners manage pricing" on public.league_pricing for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Public read payments" on public.player_payments;
create policy "Public read payments" on public.player_payments for select using (true);

drop policy if exists "Owners manage payments" on public.player_payments;
create policy "Owners manage payments" on public.player_payments for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Public read matchdays" on public.matchdays;
create policy "Public read matchdays" on public.matchdays for select using (true);

drop policy if exists "Owners manage matchdays" on public.matchdays;
create policy "Owners manage matchdays" on public.matchdays for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Public read team of week" on public.team_of_week;
create policy "Public read team of week" on public.team_of_week for select using (true);

drop policy if exists "Owners manage team of week" on public.team_of_week;
create policy "Owners manage team of week" on public.team_of_week for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));
