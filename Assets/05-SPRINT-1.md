# La Ecoferia — Sprint 1: Fundaciones

**Duración sugerida:** 2 semanas · **Objetivo:** monorepo funcionando end-to-end con auth, catálogo público navegable y base del design system.

---

## 1. Objetivo del Sprint (Sprint Goal)

> Al finalizar el Sprint 1, un visitante puede ingresar/registrarse (email o Google), navegar la home, el directorio de marcas y el catálogo con datos reales sembrados en Neon, en una PWA mobile-first fiel al design system "Patagonian Artisanal Organic".

## 2. Alcance

### Incluye
- Setup del monorepo, DB, auth y CI de despliegue en Vercel.
- Design system base (tokens Tailwind v4 + componentes core).
- Pantallas públicas: Home, Directorio de Marcas, Perfil de Marca, Eshop (listado) y Detalle de Producto.
- Ingreso / Registro.
- Carrito en Zustand (sin checkout real).

### No incluye (Sprint 2+)
- Checkout con pasarela de pago.
- Paneles de vendedor y admin (solo esqueleto de rutas protegidas).
- Mensajería, favoritos, blog y agenda (solo modelo de datos y seeds).

## 3. Historias de Usuario y Tareas

### EPIC A — Infraestructura (8 pts)

**A1. Setup monorepo** (3 pts)
- [ ] `pnpm-workspace.yaml` con apps/web, apps/api, packages/db, packages/shared
- [ ] Vite + React 19 + TS + Tailwind v4 en apps/web
- [ ] Hono + Zod en apps/api con ruta `/health`
- [ ] ESLint + Prettier compartidos
- **DoD:** `pnpm dev` levanta web y api; deploy preview en Vercel funciona.

**A2. Base de datos** (3 pts)
- [ ] Proyecto Neon + `DATABASE_URL`
- [ ] Esquema Drizzle completo según `04-MODELO-DATOS.md` (incluye constraint XOR de brands)
- [ ] Migración inicial + script de seed con marcas/productos demo
- **DoD:** `pnpm db:migrate && pnpm db:seed` deja la DB navegable desde Drizzle Studio.

**A3. Autenticación** (2 pts)
- [ ] Better Auth con email/password + Google OAuth
- [ ] Middleware `requireAuth` y `requireRole` en Hono
- [ ] Rutas protegidas placeholder `/admin` y `/vendedor`
- **DoD:** login/registro funcionan; un cliente no puede acceder a `/admin`.

### EPIC B — Design System (5 pts)

**B1. Tokens y tipografía** (2 pts)
- [ ] Bloque `@theme` con todos los tokens de `02-DESIGN-SYSTEM.md`
- [ ] Playfair Display + Inter (self-hosted o Google Fonts)
- [ ] Overlay de textura kraft y utilidad `paper-border`

**B2. Componentes core** (3 pts)
- [ ] TopAppBar, BottomNavBar (mobile), Chips de filtro, Tabs
- [ ] ProductCard, BrandCard, sellos de impacto, botón CTA tertiary
- [ ] Inputs "paper" (borde inferior kraft)
- **DoD:** página `/dev/ui` (playground) muestra todos los componentes; revisión visual contra `styles.png` y maquetas.

### EPIC C — Experiencia Pública (10 pts)

**C1. Home** (3 pts) — hero "Del Valle a tu Mesa", categorías, marcas destacadas, teaser de blog y agenda (datos de seed). Ref: `screen_4.png`.

**C2. Directorio de Marcas** (2 pts) — listado con chips de filtro por rubro, búsqueda por nombre. Ref: `screen_8.png`, `code__21`.

**C3. Perfil de Marca (mini-landing)** (3 pts) — tabs Productos / Sobre Nosotros / Contacto; grilla de productos; formulario de contacto persiste en `brand_contacts`. Ref: `screen_16.png`, DESIGN.md.

**C4. Eshop + Detalle de Producto** (2 pts) — listado con filtros (categoría, precio, marca) vía TanStack Query; detalle con historia del productor y sellos.

### EPIC D — Carrito y Auth UI (4 pts)

**D1. Ingreso/Registro UI** (2 pts) — tabs Ingresar / Crear cuenta según maqueta `code__3` (ref: `screen_22.png`), botón Google.

**D2. Carrito Zustand** (2 pts) — agregar/quitar/cantidades, agrupado por marca, persistencia local, badge en TopAppBar. Checkout: pantalla "próximamente" con stepper visual.

**Total estimado: 27 pts**

## 4. Definición de Hecho (DoD global)

- Código en TypeScript estricto, sin `any` injustificados.
- Validación Zod en toda entrada de API.
- Responsive verificado en 390px y 1280px.
- Textos 100% en español.
- Deploy automático a Vercel desde `main` en verde.

## 5. Riesgos

| Riesgo | Mitigación |
|---|---|
| Migración de tokens Tailwind v3 (maquetas) → v4 | B1 se hace primero; playground `/dev/ui` como control visual |
| Better Auth + Vercel serverless (cold starts, cookies) | Reusar configuración probada de HealthManagerV1 |
| Alcance del perfil de marca (miniblog) | Miniblog solo lectura desde seeds en Sprint 1 |
| Fotografía real de productos | Usar placeholders curados; carga real cuando se sumen marcas |

## 6. Ceremonias

- Planning día 1 · Daily asincrónica · Review con demo navegable en preview de Vercel · Retro al cierre.

## 7. Vista previa Sprint 2 (para contexto)

Checkout 3 pasos con pasarela, panel de vendedor (inventario + pedidos), favoritos y buzón de mensajes, blog y agenda cultural con ABM de admin.
