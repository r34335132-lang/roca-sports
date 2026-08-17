# ROCA Sports — plataforma web

Web app React (Vite) con el look visual de ROCA Sports y las mismas tablas Supabase que **Los Rafas**.

## Setup

1. Copia `.env.example` → `.env` y pon las mismas credenciales de Los Rafas:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
VITE_DEFAULT_COMMISSION_PCT=50
```

2. En Supabase, asegúrate de tener las migraciones de Los Rafas (`leagues`, `teams`, `players`, `player_stats`, `card_templates`, `player_cards`, `sports_matches`, etc.).

3. Corre las migraciones extra de ROCA:

- `supabase/migrations/202608060001_roca_payments_matchdays.sql`
- `supabase/migrations/202608170002_admin_profiles_collaborators.sql`

Eso agrega pagos, jornadas, `profiles.role` y colaboradores. Para hacer admin a alguien:

```sql
update public.profiles set role = 'admin' where lower(email) = lower('tu@email.com');
```

4. Instala y corre:

```bash
npm install
npm run dev
```

## Roles

| Rol | Cómo |
|---|---|
| **Admin** | `profiles.role = 'admin'` en la DB → `/dashboard/admin` |
| **Dueño** | Crea liga (`owner_id`) → `/dashboard/dueno` |
| **Jugador** | `players.auth_user_id` vinculado → `/dashboard/jugador` + credencial |

## Rutas

- `/` landing visual ROCA
- `/deportes` y `/deportes/:sport` (jornadas, goleadores, equipo de la semana)
- `/ligas`, `/liga/:idOrSlug`, `/crear-liga`
- `/box` animación Upper Deck chocando
- `/jugador/:id` credencial flip
- `/dashboard/admin|dueno|jugador`
- `/auth` login + registro (Supabase Auth)

## Presupuesto

Ejemplo: cuota $80 / jugador, comisión admin 50% → dashboard admin muestra bruto, lo que se lleva ROCA y lo que reciben dueños. El dueño ve “vas a ganar” en su dashboard.
