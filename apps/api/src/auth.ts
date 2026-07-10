import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { accounts, db, sessions, users, verifications } from '@ecoferia/db';

/**
 * Config de Better Auth. El handler se monta en app.ts (/auth/*).
 * Roles: admin | vendedor | cliente (columna `role` en `users`, default `cliente`).
 *
 * A diferencia del patrón de referencia (HealthManagerV1), acá Better Auth opera
 * directamente sobre la tabla `users` del dominio (no hay una `auth_user` separada):
 * ya es la tabla central referenciada por brands/seller_profiles/orders/etc.
 */

// Vercel pone NODE_ENV=production en las funciones; también vale si la URL es https.
const isProd =
  process.env.NODE_ENV === 'production' ||
  (process.env.BETTER_AUTH_URL ?? '').startsWith('https');

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user: users, session: sessions, account: accounts, verification: verifications },
  }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'cliente',
        input: false, // no se setea desde el body del signup (evita auto-promoción a admin)
      },
    },
  },
  advanced: {
    // users.id es uuid (no el `text` default de Better Auth) — generamos IDs
    // compatibles con el tipo de columna para no cascadear el cambio a las FKs.
    database: { generateId: () => crypto.randomUUID() },
    ...(isProd ? { defaultCookieAttributes: { sameSite: 'none', secure: true } } : {}),
  },
  // Todas las rutas de la API cuelgan de la raíz (ver apps/api/src/app.ts);
  // Better Auth sigue esa misma convención en vez de su default /api/auth.
  basePath: '/auth',
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:8787',
  trustedOrigins: [
    'http://localhost:5173',
    ...(process.env.WEB_ORIGIN && process.env.WEB_ORIGIN !== '*' ? [process.env.WEB_ORIGIN] : []),
  ],
});
