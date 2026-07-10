# Deploy en Vercel (web + API serverless)

El monorepo se despliega como **dos proyectos Vercel** desde el mismo repo de
GitHub: uno para la web (Vite) y otro para la API (Hono serverless).

```
Repo ──┬──> Proyecto "eco-feria-web"  (Root Directory: apps/web)
       └──> Proyecto "eco-feria-api"  (Root Directory: apps/api)
```

> Basado en el patrón ya probado en HealthManagerV1 (ADR-1).

---

## 1. Base de datos (Neon)

En Vercel **no corre PGlite** (filesystem de solo lectura). La API exige
`DATABASE_URL`; si falta, falla con un error explícito.

Creá el proyecto en [neon.tech](https://neon.tech). Vas a usar **dos** connection strings:

| String | Para qué |
|---|---|
| **pooled** (`-pooler`) | env var `DATABASE_URL` del proyecto API en Vercel |
| **unpooled** (directa) | migraciones y seed (DDL), desde tu máquina |

En `.env` (gitignoreado) se guardan con nombres `DATABASE_URL_POOLED` /
`DATABASE_URL_UNPOOLED`, **no** como `DATABASE_URL`: así `pnpm dev` sigue usando
PGlite local y ningún `db:reset` accidental puede borrar producción.

```bash
# Aplicar el esquema y los datos demo a Neon (desde tu máquina, no en Vercel)
set -a && . ./.env && set +a
DATABASE_URL="$DATABASE_URL_UNPOOLED" pnpm db:migrate
DATABASE_URL="$DATABASE_URL_UNPOOLED" pnpm db:seed
```

> ⚠️ **Comillas obligatorias en `.env`**: la URL pooled contiene `&`. Sin comillas,
> `source .env` lo interpreta como operador de background y la variable queda vacía.

> Las migraciones nunca corren dentro de la función serverless: el migrador se
> importa de forma diferida y queda excluido del bundle.

---

## 2. Proyecto API (`eco-feria-api`)

Vercel → Add New → Project → importar el repo:

- **Root Directory**: `apps/api`
- **Framework Preset**: `Other` (el `vercel.json` fija `framework: null`)
- **Build Command**: se toma de `vercel.json` (`pnpm build:vercel`)
- **Install Command**: `pnpm install` (default; resuelve los workspaces)
- **Environment Variables**:
  - `DATABASE_URL` → connection string pooled de Neon (**obligatoria**)
  - `WEB_ORIGIN` → dominio de la web, para restringir CORS (opcional; default `*`)
  - Sprint 2: `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### Cómo funciona (Build Output API, **no** `@vercel/node` ni `hono/vercel`)

- `apps/api/vercel.json` es mínimo: `{ "framework": null, "buildCommand": "pnpm build:vercel" }`.
- `pnpm build:vercel` corre `scripts/build-vercel.mjs`, que bundlea
  `src/vercel-entry.ts` con **esbuild** (autocontenido: inlinea `@ecoferia/db` y
  `@ecoferia/shared`) y escribe a mano `.vercel/output/functions/api.func/index.js`
  + `package.json` (`type: module`, el bundle usa top-level await) + `.vc-config.json`
  (runtime `nodejs20.x`) + `.vercel/output/config.json`
  (`routes: [{ src: "/(.*)", dest: "/api" }]` — todo el tráfico va a la función;
  Hono enruta internamente por el path original).
- `src/vercel-entry.ts` exporta `getRequestListener(app.fetch)` de `@hono/node-server`:
  adapta la app Hono (fetch-based) a la firma `(req, res)` que espera la función Node.
- **Por qué no el enfoque estándar** (`@vercel/node` + `hono/vercel`): degrada los
  tipos de Drizzle en el build de Vercel y tira `ERR_MODULE_NOT_FOUND` porque
  Vercel no compila el TS de las deps de workspace. El Build Output API a mano
  evita ambos problemas.
- **Driver de DB**: `@neondatabase/serverless` + `drizzle-orm/neon-http` (fetch
  nativo, **sin WebSocket**). No soporta transacciones interactivas: lo que necesite
  atomicidad se resuelve con una sola sentencia (CTE).
- **PGlite queda fuera del bundle** (`external` en esbuild): es wasm y solo se usa
  en desarrollo local.

Tras desplegar, probá: `https://eco-feria-api.vercel.app/health` → `{"ok":true,"service":"ecoferia-api"}`.

---

## 3. Proyecto Web (`eco-feria-web`)

Otro proyecto Vercel sobre el mismo repo:

- **Root Directory**: `apps/web`
- **Framework Preset**: `Vite`
- **Environment Variables**:
  - `VITE_API_URL` → **origen** del proyecto API (ej. `https://eco-feria-api.vercel.app`),
    sin `/api` al final.
    ⚠️ Vite **inyecta las env en build**: si cambiás esta URL, hay que redeployar la web.

---

## 4. Rutas: local vs producción

La app Hono expone sus rutas en la **raíz** (`/health`, `/brands`, `/products`, …).

| Entorno | Cómo llega el request |
|---|---|
| Local | La web pega a `/api/*`; el proxy de Vite reescribe `/api` → `` y reenvía a `:8787` |
| Vercel | `VITE_API_URL` apunta al origen de la API; la web pega directo a `https://…/brands` |

---

## 5. Notas

- **Monorepo + pnpm**: Vercel detecta `pnpm-workspace.yaml`. Si un build no
  encuentra `@ecoferia/db` / `@ecoferia/shared`, verificá que esté activado
  "Include files outside of the Root Directory".
- **CORS**: por defecto abierto. En producción seteá `WEB_ORIGIN` en el proyecto API.
- **Local vs Vercel**: en local `pnpm dev` corre `src/dev-server.ts` (servidor Node con
  `serve()` de `@hono/node-server`); en Vercel se usa `src/vercel-entry.ts` (serverless,
  bundleado por `build-vercel.mjs`). Misma app Hono (`src/app.ts`) en ambos casos:
  solo cambia el adaptador de entrada.
- **Material Symbols**: la fuente de iconos pesa ~3.4 MB sin subsetear. Pendiente de
  optimizar antes de producción real.
