import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createConnection } from './connection.ts';
import { seedDatabase } from './seed-data.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.resolve(here, '../drizzle');

const { db, migrate, close } = await createConnection();
await migrate(migrationsFolder); // asegura que el schema exista antes de sembrar
await seedDatabase(db);
await close();

console.log('✅ Seed completo');
