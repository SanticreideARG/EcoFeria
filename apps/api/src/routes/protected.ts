import { Hono } from 'hono';
import { auth } from '../auth.ts';
import { adminOnly, vendedorOrAdmin } from '../middleware/auth.ts';

/**
 * Esqueleto de rutas protegidas (M5): valida que el middleware de roles
 * funciona end-to-end. Los paneles reales (dashboard, inventario, pedidos)
 * son Sprint 2.
 */
export const protectedRoutes = new Hono()
  .get('/admin/ping', adminOnly, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    return c.json({ ok: true, area: 'admin', email: session?.user.email });
  })
  .get('/vendedor/ping', vendedorOrAdmin, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    return c.json({ ok: true, area: 'vendedor', email: session?.user.email });
  });
