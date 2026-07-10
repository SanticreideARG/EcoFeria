import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PgliteDatabase } from 'drizzle-orm/pglite';
import * as schema from './schema/index.js';

type Schema = typeof schema;

/** Tipo unificado de la conexión: en dev es PGlite; Neon comparte la misma superficie. */
export type DB = PgliteDatabase<Schema>;

const here = path.dirname(fileURLToPath(import.meta.url));

/** Directorio persistente de PGlite (relativo al paquete db, independiente del cwd). */
export const PGLITE_DATA_DIR = path.resolve(here, '../.pglite');

/**
 * Crea la conexión Drizzle.
 * - Con `DATABASE_URL` seteada => Neon Postgres (serverless).
 * - Sin ella => PGlite embebido y persistente (desarrollo sin credenciales).
 */
async function createDb(): Promise<DB> {
  const url = process.env.DATABASE_URL?.trim();

  if (url) {
    const { drizzle } = await import('drizzle-orm/neon-serverless');
    const { Pool } = await import('@neondatabase/serverless');
    const pool = new Pool({ connectionString: url });
    return drizzle({ client: pool, schema }) as unknown as DB;
  }

  const { drizzle } = await import('drizzle-orm/pglite');
  const { PGlite } = await import('@electric-sql/pglite');
  const client = new PGlite(PGLITE_DATA_DIR);
  return drizzle({ client, schema });
}

/** Conexión Drizzle lista para usar (resuelta al importar). */
export const db = await createDb();

export { schema };
