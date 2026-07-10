import { createMiddleware } from 'hono/factory';
import { auth } from '../auth.ts';

type Role = 'admin' | 'vendedor' | 'cliente';

/** Exige sesión y que el rol esté entre los permitidos. */
export function requireRole(...roles: Role[]) {
  return createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      return c.json({ error: 'no_auth', message: 'No autenticado.' }, 401);
    }
    const role = (session.user as { role?: string }).role ?? 'cliente';
    if (!roles.includes(role as Role)) {
      return c.json({ error: 'forbidden', message: 'No tenés permiso para esta acción.' }, 403);
    }
    return next();
  });
}

/** Exige solo sesión válida, sin restricción de rol. */
export const requireAuth = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: 'no_auth', message: 'No autenticado.' }, 401);
  }
  return next();
});

/** Solo administrador. */
export const adminOnly = requireRole('admin');

/** Vendedor (sobre sus propios recursos) o administrador. */
export const vendedorOrAdmin = requireRole('admin', 'vendedor');
