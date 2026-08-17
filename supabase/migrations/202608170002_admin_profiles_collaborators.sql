-- Roles de plataforma y colaboradores ROCA (misma DB)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text;

create table if not exists public.platform_collaborators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_label text not null default 'Staff',
  pct numeric(5,2) not null default 0,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and lower(coalesce(p.role, '')) in ('admin', 'administrador', 'superadmin', 'super_admin')
  );
$$;

create or replace function public.my_platform_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select lower(p.role)
      from public.profiles p
      where p.id = auth.uid()
      limit 1
    ),
    'owner'
  );
$$;

grant execute on function public.is_platform_admin() to authenticated, anon;
grant execute on function public.my_platform_role() to authenticated, anon;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.role is distinct from old.role and not public.is_platform_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    'owner'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.platform_collaborators enable row level security;

drop policy if exists "Read own or admin profiles" on public.profiles;
create policy "Read own or admin profiles" on public.profiles
for select using (id = auth.uid() or public.is_platform_admin());

drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile" on public.profiles
for update using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Insert own profile" on public.profiles;
create policy "Insert own profile" on public.profiles
for insert with check (id = auth.uid());

drop policy if exists "Admins read collaborators" on public.platform_collaborators;
create policy "Admins read collaborators" on public.platform_collaborators
for select using (public.is_platform_admin() or auth.uid() is not null);

drop policy if exists "Admins manage collaborators" on public.platform_collaborators;
create policy "Admins manage collaborators" on public.platform_collaborators
for all using (public.is_platform_admin())
with check (public.is_platform_admin());

drop policy if exists "Admins manage pricing" on public.league_pricing;
create policy "Admins manage pricing" on public.league_pricing for all
using (public.is_platform_admin() or public.is_league_owner(league_id))
with check (public.is_platform_admin() or public.is_league_owner(league_id));

drop policy if exists "Admins manage payments" on public.player_payments;
create policy "Admins manage payments" on public.player_payments for all
using (public.is_platform_admin() or public.is_league_owner(league_id))
with check (public.is_platform_admin() or public.is_league_owner(league_id));

insert into public.platform_collaborators (name, role_label, pct)
select * from (
  values
    ('Dirección', 'Fundador', 40::numeric),
    ('Operaciones', 'Ligas y cobros', 35::numeric),
    ('Comunidad', 'Eventos y redes', 25::numeric)
) as seed(name, role_label, pct)
where not exists (select 1 from public.platform_collaborators limit 1);

-- Marca admin desde la DB (cambia el email):
-- update public.profiles set role = 'admin' where lower(email) = lower('tu@email.com');
