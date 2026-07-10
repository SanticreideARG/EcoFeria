import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '@ecoferia/db';
import { ProductDetailDTO, ProductListItemDTO } from '@ecoferia/shared';

const ProductsQuery = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  q: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
});

export const productsRoute = new Hono()
  .get('/products', zValidator('query', ProductsQuery), async (c) => {
    const { category, brand, q, minPrice, maxPrice } = c.req.valid('query');

    const [cat, br] = await Promise.all([
      category
        ? db.query.categories.findFirst({
            where: (t, { eq }) => eq(t.slug, category),
            columns: { id: true },
          })
        : undefined,
      brand
        ? db.query.brands.findFirst({
            where: (t, { eq }) => eq(t.slug, brand),
            columns: { id: true },
          })
        : undefined,
    ]);
    if (category && !cat) return c.json([]);
    if (brand && !br) return c.json([]);

    const rows = await db.query.products.findMany({
      where: (p, { and, eq, ilike, gte, lte }) =>
        and(
          eq(p.status, 'publicado'),
          cat ? eq(p.categoryId, cat.id) : undefined,
          br ? eq(p.brandId, br.id) : undefined,
          q ? ilike(p.name, `%${q}%`) : undefined,
          minPrice != null ? gte(p.price, String(minPrice)) : undefined,
          maxPrice != null ? lte(p.price, String(maxPrice)) : undefined,
        ),
      with: {
        brand: { columns: { name: true, slug: true } },
        category: { columns: { name: true } },
        seals: { columns: { seal: true } },
      },
      orderBy: (p, { asc }) => [asc(p.name)],
    });

    const result = rows.map((p) => ({
      id: p.id,
      brandId: p.brandId,
      categoryId: p.categoryId,
      name: p.name,
      slug: p.slug,
      price: p.price,
      imageUrl: p.imageUrl,
      status: p.status,
      seals: p.seals.map((s) => s.seal),
      brandName: p.brand.name,
      brandSlug: p.brand.slug,
      categoryName: p.category?.name ?? null,
    }));

    return c.json(ProductListItemDTO.array().parse(result));
  })

  .get('/products/:slug', async (c) => {
    const slug = c.req.param('slug');
    const p = await db.query.products.findFirst({
      where: (t, { eq }) => eq(t.slug, slug),
      with: {
        brand: { columns: { name: true, slug: true } },
        category: { columns: { name: true } },
        seals: { columns: { seal: true } },
      },
    });
    if (!p) return c.json({ error: 'Producto no encontrado' }, 404);

    const detail = {
      id: p.id,
      brandId: p.brandId,
      categoryId: p.categoryId,
      name: p.name,
      slug: p.slug,
      price: p.price,
      imageUrl: p.imageUrl,
      status: p.status,
      seals: p.seals.map((s) => s.seal),
      description: p.description,
      story: p.story,
      stock: p.stock,
      categoryName: p.category?.name ?? null,
      brand: { name: p.brand.name, slug: p.brand.slug },
    };

    return c.json(ProductDetailDTO.parse(detail));
  });
