export { db } from './client.ts';
export { createConnection, PGLITE_DATA_DIR } from './connection.ts';
export type { DB, Connection } from './connection.ts';
export * from './schema/index.ts';

// Reexporta los operadores de Drizzle: evita que apps/api tenga su propia copia
// de drizzle-orm en node_modules (rompería `instanceof`/tipos entre paquetes).
export { and, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
