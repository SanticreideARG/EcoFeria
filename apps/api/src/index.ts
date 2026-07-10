import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { health } from './routes/health.js';

/** App Hono. Todas las rutas cuelgan de `/api`. */
export const app = new Hono();

app.use('/api/*', cors());

app.route('/api', health);

export type AppType = typeof app;
