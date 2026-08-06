# ROCA Sports — plataforma web

Web app React (Vite) con el look visual de ROCA Sports y las mismas tablas Supabase que **Los Rafas**.

## Setup

1. Copia `.env.example` → `.env` y pon las mismas credenciales de Los Rafas:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
VITE_ADMIN_EMAILS=tu-admin@email.com
VITE_DEFAULT_COMMISSION_PCT=50
```

2. En Supabase, asegúrate de tener las migraciones de Los Rafas (`leagues`, `teams`, `players`, `player_stats`, `card_templates`, `player_cards`, `sports_matches`, etc.).

3. Corre la migración extra de ROCA:

`supabase/migrations/202608060001_roca_payments_matchdays.sql`

Eso agrega `league_pricing`, `player_payments`, `matchdays`, `team_of_week`.

4. Instala y corre:

```bash
npm install
npm run dev
```

## Deploy en Vercel

Vite + React Router funciona en Vercel. El repo incluye `vercel.json` con rewrite SPA.

1. Importa el repo en [vercel.com](https://vercel.com)
2. Framework Preset: **Vite** (Build: `npm run build`, Output: `dist`)
3. En Environment Variables agrega las mismas del `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAILS`
   - `VITE_DEFAULT_COMMISSION_PCT`
4. Deploy

Sin el rewrite, rutas como `/auth` o `/dashboard/admin` fallan al refrescar.
## Roles

| Rol | Cómo |
|---|---|
| **Admin** | Email en `VITE_ADMIN_EMAILS` → `/dashboard/admin` |
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
