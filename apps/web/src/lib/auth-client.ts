import { createAuthClient } from 'better-auth/react';

// Mismo criterio que apiGet/apiPost (lib/api.ts): en dev, relativo (Vite
// reescribe /api -> raíz); en prod, el origen del proyecto API en Vercel.
const RAW_BASE = import.meta.env.VITE_API_URL ?? '/api';

// A diferencia de fetch() (que tolera URLs relativas), Better Auth exige una
// baseURL absoluta y tira una excepción SÍNCRONA al crear el cliente si no lo
// es — eso rompe el bundle entero (pantalla blanca) antes de que React monte,
// incluso con VITE_API_URL mal configurada o ausente. Resolvemos a absoluta
// contra el origen actual como red de seguridad.
const ABSOLUTE_BASE = RAW_BASE.startsWith('/') ? `${window.location.origin}${RAW_BASE}` : RAW_BASE;

// La opción `basePath` del cliente solo se aplica si `baseURL` NO tiene path
// propio (better-auth internamente hace `checkHasPath(baseURL)` y, si ya tiene
// uno, ignora `basePath` en silencio). Como nuestro baseURL siempre trae un
// path (`/api` en dev vía proxy de Vite, el origen de Vercel en prod), había
// que armar la ruta completa a mano — si no, el cliente pega a `/api/get-session`
// en vez de `/api/auth/get-session` y todo el login local devuelve 404.
const BASE = `${ABSOLUTE_BASE.replace(/\/+$/, '')}/auth`;

/** Cliente de Better Auth. La ruta `/auth` coincide con basePath en apps/api/src/auth.ts. */
export const authClient = createAuthClient({
  baseURL: BASE,
  fetchOptions: { credentials: 'include' },
});

export const { useSession, signIn, signOut, signUp } = authClient;

export type Role = 'admin' | 'vendedor' | 'cliente';

/**
 * Extrae el rol custom de la sesión. El cliente de Better Auth no conoce
 * `additionalFields.role` (solo se declara server-side en apps/api/src/auth.ts,
 * y no compartimos tipos entre apps) — cast explícito, mismo patrón usado
 * en HealthManagerV1 en vez de inferencia de tipos cross-package.
 */
export function sessionRole(session: unknown): Role {
  const role = (session as { user?: { role?: unknown } } | null | undefined)?.user?.role;
  return role === 'admin' || role === 'vendedor' ? role : 'cliente';
}
