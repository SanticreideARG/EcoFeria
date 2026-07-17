import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { brandPosts, db, eq } from '@ecoferia/db';
import { CreateBrandPostInput, SellerBrandPostDTO, UpdateBrandPostInput } from '@ecoferia/shared';
import { vendedorOrAdmin } from '../middleware/auth.ts';
import { puedeGestionarMarca } from '../lib/brandOwnership.ts';
import { managedBrandIds } from '../lib/managedBrands.ts';
import { auth } from '../auth.ts';

function toDTO(p: {
  id: string;
  brandId: string;
  brandName: string;
  title: string;
  body: string;
  imageUrl: string | null;
  publishedAt: Date;
}) {
  return SellerBrandPostDTO.parse({ ...p, publishedAt: p.publishedAt.toISOString() });
}

export const sellerBrandPostsRoutes = new Hono()
  .get('/vendedor/diario', vendedorOrAdmin, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth' }, 401);
    const role = (session.user as { role?: string }).role;

    const brandIds = await managedBrandIds(session.user.id, role);
    if (brandIds.length === 0) return c.json([]);

    const rows = await db.query.brandPosts.findMany({
      where: (p, { inArray }) => inArray(p.brandId, brandIds),
      with: { brand: { columns: { name: true } } },
      orderBy: (p, { desc }) => [desc(p.publishedAt)],
    });

    return c.json(
      rows.map((p) => toDTO({ ...p, brandName: p.brand.name })),
    );
  })

  .post('/vendedor/diario', vendedorOrAdmin, zValidator('json', CreateBrandPostInput), async (c) => {
    const input = c.req.valid('json');
    if (!(await puedeGestionarMarca(c, input.brandId))) {
      return c.json({ error: 'forbidden', message: 'No gestionás esa marca.' }, 403);
    }

    const [created] = await db
      .insert(brandPosts)
      .values({
        brandId: input.brandId,
        title: input.title,
        body: input.body,
        imageUrl: input.imageUrl || null,
      })
      .returning();
    if (!created) return c.json({ error: 'insert_failed' }, 500);

    const brand = await db.query.brands.findFirst({
      where: (t, { eq: eqCol }) => eqCol(t.id, created.brandId),
      columns: { name: true },
    });
    return c.json(toDTO({ ...created, brandName: brand?.name ?? '' }), 201);
  })

  .patch('/vendedor/diario/:id', vendedorOrAdmin, zValidator('json', UpdateBrandPostInput), async (c) => {
    const id = c.req.param('id');
    const input = c.req.valid('json');

    const existing = await db.query.brandPosts.findFirst({ where: (t, { eq: eqCol }) => eqCol(t.id, id) });
    if (!existing) return c.json({ error: 'not_found' }, 404);
    if (!(await puedeGestionarMarca(c, existing.brandId))) {
      return c.json({ error: 'forbidden', message: 'No gestionás esa marca.' }, 403);
    }

    const [updated] = await db
      .update(brandPosts)
      .set({ title: input.title, body: input.body, imageUrl: input.imageUrl || null })
      .where(eq(brandPosts.id, id))
      .returning();
    if (!updated) return c.json({ error: 'update_failed' }, 500);

    const brand = await db.query.brands.findFirst({
      where: (t, { eq: eqCol }) => eqCol(t.id, updated.brandId),
      columns: { name: true },
    });
    return c.json(toDTO({ ...updated, brandName: brand?.name ?? '' }));
  })

  .delete('/vendedor/diario/:id', vendedorOrAdmin, async (c) => {
    const id = c.req.param('id');
    const existing = await db.query.brandPosts.findFirst({
      where: (t, { eq: eqCol }) => eqCol(t.id, id),
      columns: { id: true, brandId: true },
    });
    if (!existing) return c.json({ error: 'not_found' }, 404);
    if (!(await puedeGestionarMarca(c, existing.brandId))) {
      return c.json({ error: 'forbidden', message: 'No gestionás esa marca.' }, 403);
    }
    await db.delete(brandPosts).where(eq(brandPosts.id, id));
    return c.json({ ok: true });
  });
