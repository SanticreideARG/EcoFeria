import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth.ts';
import { health } from './routes/health.ts';
import { categoriesRoute } from './routes/categories.ts';
import { brandsRoute } from './routes/brands.ts';
import { productsRoute } from './routes/products.ts';
import { contentRoute } from './routes/content.ts';
import { meRoute } from './routes/me.ts';
import { adminRoutes } from './routes/admin.ts';
import { sellerRoutes } from './routes/seller.ts';

/**
 * App Hono de La Ecoferia. Las rutas cuelgan de la raíz (`/health`, `/brands`, …).
 * En local, el proxy de Vite reescribe `/api/*` -> `/*`.
 * En Vercel, todo el tráfico se enruta a la función y Hono resuelve por el path original.
 */
export const app = new Hono();

// Better Auth usa cookies de sesión: hace falta reflejar el origin exacto (no
// "*") y `credentials: true`, si no el browser descarta la cookie cross-site.
// La seguridad real de /auth/* la da `trustedOrigins` en auth.ts.
app.use(
  '*',
  cors({
    origin: (origin) => origin ?? '*',
    credentials: true,
  }),
);

app.on(['GET', 'POST'], '/auth/*', (c) => auth.handler(c.req.raw));

app.route('/', health);
app.route('/', categoriesRoute);
app.route('/', brandsRoute);
app.route('/', productsRoute);
app.route('/', contentRoute);
app.route('/', meRoute);
app.route('/', adminRoutes);
app.route('/', sellerRoutes);

app.onError((err, c) => {
  console.error('[api] error:', err);
  return c.json({ error: 'Error interno del servidor' }, 500);
});

app.notFound((c) => c.json({ error: 'No encontrado' }, 404));

export type AppType = typeof app;

export default app;
