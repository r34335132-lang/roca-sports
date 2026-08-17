-- Admin puede editar ligas, jornadas y assets de cualquier torneo
drop policy if exists "Admins manage leagues" on public.leagues;
create policy "Admins manage leagues" on public.leagues for all
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

drop policy if exists "Admins manage player cards" on public.player_cards;
create policy "Admins manage player cards" on public.player_cards for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Admins manage card templates" on public.card_templates;
create policy "Admins manage card templates" on public.card_templates for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Admins upload league assets" on storage.objects;
create policy "Admins upload league assets" on storage.objects for all
to authenticated
using (bucket_id = 'league-assets' and public.is_platform_admin())
with check (bucket_id = 'league-assets' and public.is_platform_admin());
