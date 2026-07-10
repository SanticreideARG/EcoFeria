import { build } from 'esbuild';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';

/**
 * Genera la Build Output API de Vercel (.vercel/output/) para la API.
 * - Bundlea la función con esbuild (autocontenida: inlinea @ecoferia/db y @ecoferia/shared).
 * - Declara explícitamente la función y las rutas, sin depender de la autodetección de api/.
 */

const OUT = '.vercel/output';
const FN = `${OUT}/functions/api.func`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(FN, { recursive: true });
mkdirSync(`${OUT}/static`, { recursive: true });

await build({
  entryPoints: ['src/vercel-entry.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  outfile: `${FN}/index.js`,
  external: [
    // Built-ins de Node: se importan como ESM nativos.
    'node:*',
    // PGlite es wasm y solo corre en local; en Vercel siempre se usa Neon (DATABASE_URL).
    '@electric-sql/pglite',
    'drizzle-orm/pglite',
    'drizzle-orm/pglite/migrator',
    // Los migradores corren desde la máquina, nunca dentro de la función.
    'drizzle-orm/neon-http/migrator',
  ],
  // Provee require() via createRequire para dynamic requires residuales de deps CJS.
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
});

// La función es ESM (el bundle usa top-level await en la conexión a la DB).
writeFileSync(`${FN}/package.json`, JSON.stringify({ type: 'module' }) + '\n');

// Config de la función serverless (runtime + handler).
writeFileSync(
  `${FN}/.vc-config.json`,
  JSON.stringify(
    {
      runtime: 'nodejs20.x',
      handler: 'index.js',
      launcherType: 'Nodejs',
      shouldAddHelpers: false,
    },
    null,
    2,
  ) + '\n',
);

// Rutas: todo va a la función /api (Hono enruta por el path original).
writeFileSync(
  `${OUT}/config.json`,
  JSON.stringify({ version: 3, routes: [{ src: '/(.*)', dest: '/api' }] }, null, 2) + '\n',
);

// Landing estático mínimo (no se sirve: todo se enruta a la función).
writeFileSync(
  `${OUT}/static/index.html`,
  '<!doctype html><meta charset=utf-8><title>La Ecoferia API</title><h1>La Ecoferia API</h1>\n',
);

console.log('Build Output generado en .vercel/output');
