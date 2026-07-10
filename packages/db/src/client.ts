import { createConnection } from './connection.ts';

/**
 * Conexión Drizzle singleton para el runtime de la app/API (resuelta al importar).
 * Los scripts one-shot (migrate/seed/reset) usan `createConnection` directamente.
 */
export const { db } = await createConnection();
