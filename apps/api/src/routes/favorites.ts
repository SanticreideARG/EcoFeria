import { Hono } from 'hono';
import { and, db, eq, favorites } from '@ecoferia/db';
import { BrandListItemDTO } from '@ecoferia/shared';
import { auth } from '../auth.ts';
import { requireAuth } from '../middleware/auth.ts';
import { toBrandListItem } from '../lib/brandListItem.ts';

export const favoritesRoutes = new Hono()
  .get('/favoritos', requireAuth, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth' }, 401);

    const favBrandIds = await db.query.favorites.findMany({
      where: (f, { eq }) => eq(f.userId, session.user.id),
      columns: { brandId: true },
    });
    if (favBrandIds.length === 0) return c.json([]);

    const rows = await db.query.brands.findMany({
      where: (b, { inArray }) => inArray(b.id, favBrandIds.map((f) => f.brandId)),
      with: {
        category: { columns: { name: true } },
        products: { columns: { id: true }, with: { seals: { columns: { seal: true } } } },
      },
      orderBy: (b, { asc }) => [asc(b.name)],
    });

    return c.json(BrandListItemDTO.array().parse(rows.map(toBrandListItem)));
  })

  .post('/favoritos/:brandId', requireAuth, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth' }, 401);

    const brandId = c.req.param('brandId');
    const brand = await db.query.brands.findFirst({
      where: (b, { eq }) => eq(b.id, brandId),
      columns: { id: true },
    });
    if (!brand) return c.json({ error: 'not_found', message: 'Marca no encontrada.' }, 404);

    await db.insert(favorites).values({ userId: session.user.id, brandId }).onConflictDoNothing();
    return c.json({ ok: true }, 201);
  })

  .delete('/favoritos/:brandId', requireAuth, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth' }, 401);

    const brandId = c.req.param('brandId');
    await db.delete(favorites).where(and(eq(favorites.userId, session.user.id), eq(favorites.brandId, brandId)));
    return c.json({ ok: true });
  });
