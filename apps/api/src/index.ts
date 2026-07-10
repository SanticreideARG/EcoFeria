import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { health } from './routes/health.ts';
import { categoriesRoute } from './routes/categories.ts';
import { brandsRoute } from './routes/brands.ts';
import { productsRoute } from './routes/products.ts';
import { contentRoute } from './routes/content.ts';

/** App Hono. Todas las rutas cuelgan de `/api`. */
export const app = new Hono();

app.use('/api/*', cors());

app.route('/api', health);
app.route('/api', categoriesRoute);
app.route('/api', brandsRoute);
app.route('/api', productsRoute);
app.route('/api', contentRoute);

app.onError((err, c) => {
  console.error('[api] error:', err);
  return c.json({ error: 'Error interno del servidor' }, 500);
});

app.notFound((c) => c.json({ error: 'No encontrado' }, 404));

export type AppType = typeof app;
