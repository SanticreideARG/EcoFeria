import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from 'drizzle-orm';
import { createConnection } from './connection.ts';
import { seedDatabase } from './seed-data.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.resolve(here, '../drizzle');

const { db, migrate, close } = await createConnection();

// Borra tablas de datos (public) y el registro de migraciones (drizzle) para re-migrar desde cero.
await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
await db.execute(sql`CREATE SCHEMA public`);
await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);

await migrate(migrationsFolder);
await seedDatabase(db);
await close();

console.log('✅ Reset + seed completo');
