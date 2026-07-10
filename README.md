# La Ecoferia

Marketplace multimarca de productos sustentables del Alto Valle (Neuquén y Río Negro),
Patagonia Argentina. Mobile-first, PWA. Design system **"Patagonian Artisanal Organic"**.

La documentación de producto, diseño y arquitectura vive en [`Assets/`](./Assets).

## Stack

Monorepo pnpm:

| Paquete | Contenido |
|---|---|
| `apps/web` | Vite + React 19 + TS + Tailwind v4 + React Router v7 + TanStack Query + Zustand |
| `apps/api` | Hono + Zod (dev: `@hono/node-server`; prod: `hono/vercel`) |
| `packages/db` | Drizzle ORM. Dev: PGlite embebido · Prod: Neon Postgres (vía `DATABASE_URL`) |
| `packages/shared` | Esquemas Zod compartidos (DTOs) |

## Requisitos

- Node >= 22
- pnpm >= 10

## Puesta en marcha

```bash
pnpm install
cp .env.example .env        # dev funciona con los valores por defecto (PGlite)

# (una vez que exista el schema/seed — M3)
pnpm db:migrate
pnpm db:seed

pnpm dev                    # web en :5173, api en :8787
```

- Web: http://localhost:5173
- API health: http://localhost:8787/api/health

> **DB en dev:** con `DATABASE_URL` vacío se usa PGlite (Postgres embebido, persistido en
> `packages/db/.pglite`). Corré `db:migrate`/`db:seed` con el server detenido; luego `pnpm dev`.

## Scripts

| Comando | Efecto |
|---|---|
| `pnpm dev` | Levanta web + api en paralelo |
| `pnpm build` | Build de producción del web |
| `pnpm lint` / `pnpm format` | ESLint / Prettier |
| `pnpm typecheck` | `tsc --noEmit` en todos los paquetes |
| `pnpm db:migrate` / `pnpm db:seed` | Migraciones y datos demo |

## Convenciones

- Conventional Commits · ramas `main` (prod) · `dev` (integración) · `feat/*`.
- UI y contenido en español; código e identificadores en inglés. TypeScript estricto.
