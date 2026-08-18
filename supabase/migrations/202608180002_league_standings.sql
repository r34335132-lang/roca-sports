-- Tabla de posiciones por liga (fútbol: JJ JG JE JP GF GC DIF PGP PUNTOS)

create table if not exists public.league_standings (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  played int not null default 0,
  won int not null default 0,
  drawn int not null default 0,
  lost int not null default 0,
  goals_for int not null default 0,
  goals_against int not null default 0,
  goal_diff int not null default 0,
  penalty_wins int not null default 0,
  points int not null default 0,
  updated_at timestamptz not null default now(),
  unique (league_id, team_id)
);

alter table public.league_standings enable row level security;

drop policy if exists "Public read standings" on public.league_standings;
create policy "Public read standings" on public.league_standings for select using (true);

drop policy if exists "Owners manage standings" on public.league_standings;
create policy "Owners manage standings" on public.league_standings for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Admins manage standings" on public.league_standings;
create policy "Admins manage standings" on public.league_standings for all
using (public.is_platform_admin())
with check (public.is_platform_admin());
