import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { health } from './routes/health.ts';
import { categoriesRoute } from './routes/categories.ts';
import { brandsRoute } from './routes/brands.ts';
import { productsRoute } from './routes/products.ts';
import { contentRoute } from './routes/content.ts';

/**
 * App Hono de La Ecoferia. Las rutas cuelgan de la raíz (`/health`, `/brands`, …).
 * En local, el proxy de Vite reescribe `/api/*` -> `/*`.
 * En Vercel, todo el tráfico se enruta a la función y Hono resuelve por el path original.
 */
export const app = new Hono();

// En producción conviene restringir el origen al dominio de la web (WEB_ORIGIN).
const origin = process.env.WEB_ORIGIN?.trim() || '*';
app.use('*', cors({ origin }));

app.route('/', health);
app.route('/', categoriesRoute);
app.route('/', brandsRoute);
app.route('/', productsRoute);
app.route('/', contentRoute);

app.onError((err, c) => {
  console.error('[api] error:', err);
  return c.json({ error: 'Error interno del servidor' }, 500);
});

app.notFound((c) => c.json({ error: 'No encontrado' }, 404));

export type AppType = typeof app;

export default app;
