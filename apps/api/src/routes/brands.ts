import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { brandContacts, db } from '@ecoferia/db';
import { BrandContactInput, BrandListItemDTO, BrandProfileDTO } from '@ecoferia/shared';
import { auth } from '../auth.ts';
import { toBrandListItem } from '../lib/brandListItem.ts';

const BrandsQuery = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const brandsRoute = new Hono()
  .get('/brands', zValidator('query', BrandsQuery), async (c) => {
    const { category, q } = c.req.valid('query');

    let categoryId: string | undefined;
    if (category) {
      const cat = await db.query.categories.findFirst({
        where: (t, { eq }) => eq(t.slug, category),
        columns: { id: true },
      });
      if (!cat) return c.json([]);
      categoryId = cat.id;
    }

    const rows = await db.query.brands.findMany({
      where: (b, { and, eq, ilike }) =>
        and(
          eq(b.status, 'activa'),
          categoryId ? eq(b.categoryId, categoryId) : undefined,
          q ? ilike(b.name, `%${q}%`) : undefined,
        ),
      with: {
        category: { columns: { name: true } },
        products: { columns: { id: true }, with: { seals: { columns: { seal: true } } } },
      },
      orderBy: (b, { asc }) => [asc(b.name)],
    });

    return c.json(BrandListItemDTO.array().parse(rows.map(toBrandListItem)));
  })

  .get('/brands/:slug', async (c) => {
    const slug = c.req.param('slug');
    const b = await db.query.brands.findFirst({
      where: (t, { eq }) => eq(t.slug, slug),
      with: {
        category: { columns: { name: true } },
        products: {
          with: { seals: { columns: { seal: true } } },
          orderBy: (t, { asc }) => [asc(t.name)],
        },
        posts: { orderBy: (t, { desc }) => [desc(t.publishedAt)] },
      },
    });
    if (!b) return c.json({ error: 'Marca no encontrada' }, 404);

    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const isFavorite = session
      ? Boolean(
          await db.query.favorites.findFirst({
            where: (f, { and, eq }) => and(eq(f.userId, session.user.id), eq(f.brandId, b.id)),
            columns: { userId: true },
          }),
        )
      : false;

    const profile = {
      id: b.id,
      name: b.name,
      slug: b.slug,
      tagline: b.tagline,
      description: b.description,
      logoUrl: b.logoUrl,
      coverUrl: b.coverUrl,
      categoryId: b.categoryId,
      status: b.status,
      categoryName: b.category?.name ?? null,
      products: b.products.map((p) => ({
        id: p.id,
        brandId: p.brandId,
        categoryId: p.categoryId,
        name: p.name,
        slug: p.slug,
        price: p.price,
        imageUrl: p.imageUrl,
        status: p.status,
        seals: p.seals.map((s) => s.seal),
      })),
      posts: b.posts.map((p) => ({
        id: p.id,
        title: p.title,
        body: p.body,
        imageUrl: p.imageUrl,
        publishedAt: p.publishedAt.toISOString(),
      })),
      isFavorite,
    };

    return c.json(BrandProfileDTO.parse(profile));
  })

  .post('/brands/:slug/contact', zValidator('json', BrandContactInput), async (c) => {
    const slug = c.req.param('slug');
    const b = await db.query.brands.findFirst({
      where: (t, { eq }) => eq(t.slug, slug),
      columns: { id: true },
    });
    if (!b) return c.json({ error: 'Marca no encontrada' }, 404);

    const input = c.req.valid('json');
    await db.insert(brandContacts).values({
      brandId: b.id,
      name: input.name,
      email: input.email,
      message: input.message,
    });
    return c.json({ ok: true }, 201);
  });
