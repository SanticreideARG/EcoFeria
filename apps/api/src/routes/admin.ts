import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { brands, categories, db, eq, products, sellerProfiles, sql, users } from '@ecoferia/db';
import { AdminSellerDTO, AdminStatsDTO, UpdateSellerStatusInput } from '@ecoferia/shared';
import { adminOnly } from '../middleware/auth.ts';

export const adminRoutes = new Hono()
  .get('/admin/stats', adminOnly, async (c) => {
    const [brandsC, productsC, categoriesC, approvedC, pendingC, clientsC] = await Promise.all([
      db.$count(brands),
      db.$count(products, eq(products.status, 'publicado')),
      db.$count(categories),
      db.$count(sellerProfiles, eq(sellerProfiles.status, 'aprobado')),
      db.$count(sellerProfiles, eq(sellerProfiles.status, 'pendiente')),
      db.$count(users, eq(users.role, 'cliente')),
    ]);
    return c.json(
      AdminStatsDTO.parse({
        brands: brandsC,
        products: productsC,
        categories: categoriesC,
        sellersApproved: approvedC,
        sellersPending: pendingC,
        clients: clientsC,
      }),
    );
  })

  .get('/admin/sellers', adminOnly, async (c) => {
    const rows = await db
      .select({
        id: sellerProfiles.id,
        userId: sellerProfiles.userId,
        name: users.name,
        email: users.email,
        status: sellerProfiles.status,
        phone: sellerProfiles.phone,
        bio: sellerProfiles.bio,
      })
      .from(sellerProfiles)
      .innerJoin(users, eq(sellerProfiles.userId, users.id))
      .orderBy(users.name);

    // Conteo de marcas por vendedor (una sola query agrupada).
    const counts = await db
      .select({ sid: brands.managedBySellerId, n: sql<number>`count(*)::int` })
      .from(brands)
      .groupBy(brands.managedBySellerId);
    const countMap = new Map(counts.map((r) => [r.sid, Number(r.n)]));

    return c.json(
      AdminSellerDTO.array().parse(
        rows.map((r) => ({ ...r, brandCount: countMap.get(r.id) ?? 0 })),
      ),
    );
  })

  .patch('/admin/sellers/:id', adminOnly, zValidator('json', UpdateSellerStatusInput), async (c) => {
    const id = c.req.param('id');
    const { status } = c.req.valid('json');
    const [updated] = await db
      .update(sellerProfiles)
      .set({ status })
      .where(eq(sellerProfiles.id, id))
      .returning({ id: sellerProfiles.id });
    if (!updated) return c.json({ error: 'not_found', message: 'Vendedor no encontrado.' }, 404);
    return c.json({ ok: true });
  });
