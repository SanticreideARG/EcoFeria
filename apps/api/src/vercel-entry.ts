import { getRequestListener } from '@hono/node-server';
import app from './app.ts';

/**
 * Handler Node `(req, res)` para la función serverless de Vercel (Build Output API).
 * `scripts/build-vercel.mjs` lo bundlea con esbuild en
 * `.vercel/output/functions/api.func/index.js`, autocontenido.
 *
 * No se usa `hono/vercel` ni `@vercel/node`: Vercel no compila el TS de las deps
 * de workspace y degrada los tipos de Drizzle.
 */
export default getRequestListener(app.fetch);
