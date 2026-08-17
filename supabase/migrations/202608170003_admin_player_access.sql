-- Admin puede registrar y editar jugadores/equipos en cualquier liga
drop policy if exists "Admins manage players" on public.players;
create policy "Admins manage players" on public.players for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Admins manage teams" on public.teams;
create policy "Admins manage teams" on public.teams for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Admins manage player stats" on public.player_stats;
create policy "Admins manage player stats" on public.player_stats for all
using (public.is_platform_admin())
with check (public.is_platform_admin());
