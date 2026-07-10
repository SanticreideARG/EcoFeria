# La Ecoferia — Arquitectura Técnica

**Versión:** 1.0 · **Base:** stack probado en HealthManagerV1 y Suites-Manager-V1

---

## 1. Visión General

Monorepo **pnpm** desplegado en **Vercel**, con frontend SPA/PWA y API serverless.

```
la-ecoferia/
├── apps/
│   ├── web/                  # Vite + React 19 + TypeScript
│   │   ├── src/
│   │   │   ├── app/          # rutas, providers, layout shells
│   │   │   ├── features/     # catalog, brands, cart, checkout, auth, blog, agenda, admin, seller
│   │   │   ├── components/   # UI compartida (design system)
│   │   │   ├── lib/          # api client, better-auth client, utils
│   │   │   └── stores/       # Zustand (cart, ui)
│   │   └── public/           # manifest PWA, iconos
│   └── api/                  # Hono + Zod (serverless Vercel)
│       └── src/
│           ├── routes/       # auth, brands, products, orders, blog, events, messages, admin
│           ├── middleware/   # auth, roles (admin|vendedor|cliente), rate-limit
│           └── index.ts
├── packages/
│   ├── db/                   # Drizzle ORM + Postgres (Neon)
│   │   ├── schema/           # tablas + relaciones
│   │   └── migrations/
│   └── shared/               # esquemas Zod compartidos (DTOs, validación)
├── pnpm-workspace.yaml
└── turbo.json (opcional)
```

## 2. Stack por Capa

| Capa | Tecnología | Notas |
|---|---|---|
| UI | React 19 + TypeScript + Tailwind v4 | Tokens del design system en `@theme` |
| Estado servidor | TanStack Query | Cache de catálogo, marcas, pedidos |
| Estado cliente | Zustand | Carrito (persistido), UI global |
| Routing | React Router (o TanStack Router) | Rutas públicas + protegidas por rol |
| API | Hono + Zod | Serverless functions en Vercel |
| ORM / DB | Drizzle + Postgres (Neon) | Migraciones versionadas en `packages/db` |
| Auth | Better Auth + Google OAuth | Sesiones, roles en tabla `users` |
| Validación | Zod en `packages/shared` | Un solo esquema para front y API |
| PWA | vite-plugin-pwa | Manifest, service worker, offline catálogo |
| Hosting | Vercel | Web estática + API functions + Neon |

## 3. Flujo de Datos

```
React 19 (apps/web)
   │  TanStack Query / fetch tipado
   ▼
Hono API (apps/api)  ──► middleware auth (Better Auth) ──► middleware roles
   │  Zod (packages/shared) valida entrada/salida
   ▼
Drizzle (packages/db) ──► Postgres Neon
```

- Los DTOs viven en `packages/shared` como esquemas Zod; el front infiere tipos con `z.infer`.
- Toda ruta de escritura valida body con Zod y verifica rol vía middleware.
- El carrito vive en Zustand con persistencia local; al checkout se materializa como `orders` agrupadas por marca.

## 4. Autenticación y Autorización

- **Better Auth** con email/password + **Google OAuth**.
- Rol en la tabla `users`: `admin | vendedor | cliente` (default `cliente`).
- Middleware Hono:
  - `requireAuth` — sesión válida.
  - `requireRole('admin')`, `requireRole('vendedor')` — segmentación de paneles.
  - `requireBrandOwnership` — el vendedor solo opera sobre marcas propias (regla XOR: `brands.managed_by` apunta a un admin o a un vendedor, nunca ambos).
- Aprobación de vendedores: un usuario solicita rol vendedor → admin aprueba desde su panel.

## 5. Convenciones

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`).
- **Ramas:** `main` (producción) · `dev` (integración) · `feat/*`.
- **Estilo:** ESLint + Prettier compartidos en la raíz del monorepo.
- **Variables de entorno:** `DATABASE_URL` (Neon), `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `VITE_API_URL`.
- **Idioma:** UI y contenido 100% en español; código e identificadores en inglés.

## 6. Decisiones de Arquitectura (ADR resumidas)

| # | Decisión | Motivo |
|---|---|---|
| ADR-1 | Reutilizar stack de HealthManagerV1 / Suites-Manager-V1 | Velocidad, patrones ya validados |
| ADR-2 | Monorepo pnpm | Tipos compartidos front/back sin publicar paquetes |
| ADR-3 | Hono serverless en Vercel | Costo cero inicial, escala automática |
| ADR-4 | Neon Postgres | Branching de DB para entornos, plan gratuito |
| ADR-5 | Tailwind v4 con @theme | Tokens del design system como CSS variables nativas |
| ADR-6 | PWA en lugar de app nativa | Mobile-first sin costo de stores |
| ADR-7 | Checkout maquetado sin pasarela en Sprint 1 | Validar UX antes de integrar Mercado Pago (u otra) |
