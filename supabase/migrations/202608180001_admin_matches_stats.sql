-- Rol de juegos, stats y equipo de la semana: admin y dueño pueden cargar

create table if not exists public.sports_matches (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  home_team_id uuid references public.teams(id) on delete set null,
  away_team_id uuid references public.teams(id) on delete set null,
  sport text,
  title text,
  venue text,
  status text not null default 'scheduled',
  starts_at timestamptz,
  minute int,
  home_score int not null default 0,
  away_score int not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.sports_matches enable row level security;
alter table public.matchdays enable row level security;
alter table public.team_of_week enable row level security;
alter table public.player_stats enable row level security;

drop policy if exists "Public read matches" on public.sports_matches;
create policy "Public read matches" on public.sports_matches for select using (true);

drop policy if exists "Owners manage matches" on public.sports_matches;
create policy "Owners manage matches" on public.sports_matches for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Admins manage matches" on public.sports_matches;
create policy "Admins manage matches" on public.sports_matches for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Admins manage matchdays" on public.matchdays;
create policy "Admins manage matchdays" on public.matchdays for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Admins manage team of week" on public.team_of_week;
create policy "Admins manage team of week" on public.team_of_week for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Admins manage player stats" on public.player_stats;
create policy "Admins manage player stats" on public.player_stats for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Owners manage player stats" on public.player_stats;
create policy "Owners manage player stats" on public.player_stats for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));
