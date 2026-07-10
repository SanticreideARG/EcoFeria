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
const onVercel = Boolean(process.env.VERCEL);

export async function createConnection(): Promise<Connection> {
  const url = process.env.DATABASE_URL?.trim();

  if (url) {
    // Neon HTTP: fetch nativo, sin WebSocket ni pooling. Apto serverless.
    // No soporta transacciones interactivas (usar CTE si hace falta atomicidad).
    const { drizzle } = await import('drizzle-orm/neon-http');
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(url);
    const neonDb = drizzle(sql, { schema });
    return {
      db: neonDb as unknown as DB,
      // Import diferido: el migrador no entra al bundle de la función serverless.
      migrate: async (folder) => {
        const { migrate } = await import('drizzle-orm/neon-http/migrator');
        await migrate(neonDb, { migrationsFolder: folder });
      },
      close: async () => {}, // neon-http es stateless
    };
  }

  if (onVercel) {
    throw new Error(
      '[db] DATABASE_URL es obligatorio en Vercel. PGlite solo corre en local (filesystem de solo lectura en serverless).',
    );
  }

  const { drizzle } = await import('drizzle-orm/pglite');
  const { PGlite } = await import('@electric-sql/pglite');
  const client = new PGlite(PGLITE_DATA_DIR);
  const db = drizzle({ client, schema });
  return {
    db,
    migrate: async (folder) => {
      const { migrate } = await import('drizzle-orm/pglite/migrator');
      await migrate(db, { migrationsFolder: folder });
    },
    close: () => client.close(),
  };
}
