import { Hono } from 'hono';
import { db } from '@ecoferia/db';
import { SellerOverviewDTO } from '@ecoferia/shared';
import { auth } from '../auth.ts';
import { vendedorOrAdmin } from '../middleware/auth.ts';

export const sellerRoutes = new Hono().get('/vendedor/overview', vendedorOrAdmin, async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: 'no_auth' }, 401);
  const userId = session.user.id;
  const role = (session.user as { role?: string }).role;

  const profile = await db.query.sellerProfiles.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
    columns: { id: true, status: true },
  });

  // Vendedor: sus marcas por perfil. Admin (sin perfil): las que gestiona directo.
  const brandRows = await db.query.brands.findMany({
    where: (b, { eq }) =>
      profile
        ? eq(b.managedBySellerId, profile.id)
        : role === 'admin'
          ? eq(b.managedByAdminId, userId)
          : eq(b.id, '00000000-0000-0000-0000-000000000000'), // ninguna
    with: { products: { columns: { id: true } } },
    orderBy: (b, { asc }) => [asc(b.name)],
  });

  return c.json(
    SellerOverviewDTO.parse({
      sellerStatus: profile?.status ?? null,
      brands: brandRows.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        status: b.status,
        productCount: b.products.length,
      })),
    }),
  );
});
