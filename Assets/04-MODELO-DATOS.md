# La Ecoferia — Modelo de Datos

**Versión:** 1.0 · **ORM:** Drizzle · **DB:** Postgres (Neon)

---

## 1. Diagrama Entidad-Relación (conceptual)

```
users ──< seller_profiles                    users ──< favorites >── brands
users ──< orders ──< order_items >── products
brands ──< products ──< product_impact_seals
brands ──< brand_posts (miniblog)
brands ──< brand_contacts
users ──< messages >── brands
events (agenda cultural)          blog_posts (blog general, autor admin)
categories ──< products
```

## 2. Tablas

### `users`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | Better Auth |
| name, email | text | email único |
| role | enum: `admin` \| `vendedor` \| `cliente` | default `cliente` |
| avatar_url | text | opcional |
| created_at | timestamptz | |

> Better Auth agrega sus propias tablas (`sessions`, `accounts`, `verifications`).

### `seller_profiles`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | único |
| status | enum: `pendiente` \| `aprobado` \| `rechazado` | flujo de aprobación por admin |
| bio, phone | text | |

### `brands`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| name, slug | text | slug único |
| tagline | text | ej. "Fungi-cultura circular" |
| description | text | "Sobre Nosotros" |
| logo_url, cover_url | text | |
| category_id | FK → categories | rubro principal |
| **managed_by_seller_id** | uuid FK → seller_profiles, **nullable** | |
| **managed_by_admin_id** | uuid FK → users, **nullable** | |
| status | enum: `activa` \| `pausada` | |
| created_at | timestamptz | |

**Regla XOR (constraint):**
```sql
CHECK (
  (managed_by_seller_id IS NOT NULL AND managed_by_admin_id IS NULL) OR
  (managed_by_seller_id IS NULL AND managed_by_admin_id IS NOT NULL)
)
```
Un vendedor puede tener N marcas; cada marca tiene exactamente un gestor.

### `categories`
`id, name, slug, icon` — semillas iniciales: Alimentos, Cosmética, Hogar, Diseño (+ Dulces, Textil, Bienestar según directorio).

### `products`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| brand_id | FK → brands | |
| category_id | FK → categories | |
| name, slug, description | text | |
| story | text | "historia del productor" |
| price | numeric(10,2) | ARS |
| stock | integer | |
| image_url | text | Sprint 1: una imagen; luego galería |
| status | enum: `publicado` \| `borrador` \| `agotado` | |
| created_at | timestamptz | |

### `product_impact_seals`
`product_id FK, seal enum: organico | local | fair_trade | zero_waste` — PK compuesta.

### `orders`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| user_id | FK → users | comprador |
| status | enum: `pendiente` \| `confirmado` \| `enviado` \| `entregado` \| `cancelado` | |
| shipping_address | jsonb | |
| subtotal, shipping_cost, total | numeric | |
| created_at | timestamptz | |

### `order_items`
`id, order_id FK, product_id FK, brand_id FK (desnormalizado para agrupar por marca), quantity, unit_price` — snapshot de precio al comprar.

### `favorites`
`user_id FK + brand_id FK` — PK compuesta, `created_at`.

### `messages`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| thread_id | uuid | agrupa conversación cliente↔marca |
| brand_id | FK → brands | |
| sender_user_id | FK → users | |
| body | text | |
| read_at | timestamptz nullable | |
| created_at | timestamptz | |

### `brand_posts` (miniblog de marca)
`id, brand_id FK, title, body, image_url, published_at`

### `blog_posts` (blog general de La Ecoferia)
`id, author_user_id FK (admin), title, slug, body, cover_url, published_at`

### `events` (agenda cultural)
`id, title, description, location, starts_at, ends_at, cover_url, created_by FK (admin), status: publicado | borrador`

### `brand_contacts`
`id, brand_id FK, name, email, message, created_at` — formulario de contacto de la mini-landing.

## 3. Índices sugeridos

- `products(brand_id)`, `products(category_id)`, `products(status)`
- `order_items(order_id)`, `orders(user_id, created_at desc)`
- `messages(thread_id, created_at)`, `favorites(user_id)`
- `brands(slug)` único, `products(slug)` único por marca

## 4. Semillas (seed) para Sprint 1

Marcas demo inspiradas en el ecosistema real de la Ecoferia (cosmética natural, fungi, miel, cerámica, upcycling), 4–6 productos por marca con sellos de impacto variados, 2 posts de blog, 2 eventos de agenda, 1 admin, 2 vendedores aprobados, 1 pendiente y 2 clientes.
