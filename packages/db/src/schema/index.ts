/**
 * Schema Drizzle de La Ecoferia (según Assets/04-MODELO-DATOS.md).
 * Punto único de exportación que consumen `connection.ts` y `drizzle.config.ts`.
 */
export * from './enums.ts';
export * from './tables.ts';
export * from './auth.ts';
export * from './relations.ts';
