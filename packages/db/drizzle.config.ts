import { defineConfig } from 'drizzle-kit';

/**
 * `drizzle-kit generate` produce SQL desde el schema (no necesita conexión).
 * Las migraciones se aplican con `pnpm db:migrate` (src/migrate.ts), que corre
 * tanto sobre PGlite como sobre Neon.
 */
export default defineConfig({
  schema: './src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
});
