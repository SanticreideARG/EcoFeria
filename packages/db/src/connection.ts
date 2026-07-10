import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PgliteDatabase } from 'drizzle-orm/pglite';
import * as schema from './schema/index.ts';

type Schema = typeof schema;

/** Tipo unificado de la conexión: en dev es PGlite; Neon comparte la misma superficie. */
export type DB = PgliteDatabase<Schema>;

const here = path.dirname(fileURLToPath(import.meta.url));

/** Directorio persistente de PGlite (relativo al paquete db, independiente del cwd). */
export const PGLITE_DATA_DIR = path.resolve(here, '../.pglite');

export type Connection = {
  db: DB;
  /** Aplica las migraciones de la carpeta indicada usando el migrador del driver activo. */
  migrate: (migrationsFolder: string) => Promise<void>;
  close: () => Promise<void>;
};

/**
 * Crea una conexión Drizzle explícita (sin singleton).
 * - Con `DATABASE_URL` => Neon Postgres (serverless).
 * - Sin ella => PGlite embebido y persistente (desarrollo sin credenciales).
 *
 * A diferencia de `client.ts`, este módulo no abre ninguna conexión al importarse:
 * los scripts (migrate/seed/reset) lo usan para tener control del ciclo de vida.
 */
export async function createConnection(): Promise<Connection> {
  const url = process.env.DATABASE_URL?.trim();

  if (url) {
    const { drizzle } = await import('drizzle-orm/neon-serverless');
    const { migrate } = await import('drizzle-orm/neon-serverless/migrator');
    const { Pool } = await import('@neondatabase/serverless');
    const pool = new Pool({ connectionString: url });
    const neonDb = drizzle({ client: pool, schema });
    return {
      db: neonDb as unknown as DB,
      migrate: (folder) => migrate(neonDb, { migrationsFolder: folder }),
      close: () => pool.end(),
    };
  }

  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const { PGlite } = await import('@electric-sql/pglite');
  const client = new PGlite(PGLITE_DATA_DIR);
  const db = drizzle({ client, schema });
  return {
    db,
    migrate: (folder) => migrate(db, { migrationsFolder: folder }),
    close: () => client.close(),
  };
}
