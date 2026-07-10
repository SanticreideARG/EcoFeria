import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createConnection } from './connection.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.resolve(here, '../drizzle');

const { migrate, close } = await createConnection();
await migrate(migrationsFolder);
await close();

console.log('✅ Migraciones aplicadas');
