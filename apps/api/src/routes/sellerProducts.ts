import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db, eq, productImpactSeals, products } from '@ecoferia/db';
import { CreateProductInput, SellerProductDTO, UpdateProductInput } from '@ecoferia/shared';
import { auth } from '../auth.ts';
import { vendedorOrAdmin } from '../middleware/auth.ts';
import { puedeGestionarMarca } from '../lib/brandOwnership.ts';
import { managedBrandIds } from '../lib/managedBrands.ts';
import { slugify } from '../lib/slug.ts';

/** Genera un slug único para la marca, agregando -2, -3… ante colisión. */
async function uniqueSlug(brandId: string, name: string, excludeProductId?: string): Promise<string> {
  const base = slugify(name) || 'producto';
  for (let n = 0; ; n++) {
    const candidate = n === 0 ? base : `${base}-${n + 1}`;
    const existing = await db.query.products.findFirst({
      where: (t, { and, eq: eqCol }) => and(eqCol(t.brandId, brandId), eqCol(t.slug, candidate)),
      columns: { id: true },
    });
    if (!existing || existing.id === excludeProductId) return candidate;
  }
}

async function setSeals(productId: string, seals: string[]) {
  await db.delete(productImpactSeals).where(eq(productImpactSeals.productId, productId));
  if (seals.length > 0) {
    await db
      .insert(productImpactSeals)
      .values(seals.map((seal) => ({ productId, seal: seal as (typeof productImpactSeals.seal.enumValues)[number] })));
  }
}

function toDTO(p: {
  id: string;
  brandId: string;
  brandName: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string | null;
  story: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  status: 'publicado' | 'borrador' | 'agotado';
  seals: string[];
}) {
  return SellerProductDTO.parse(p);
}

export const sellerProductsRoutes = new Hono()
  .get('/vendedor/productos', vendedorOrAdmin, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth' }, 401);
    const role = (session.user as { role?: string }).role;

    const brandIds = await managedBrandIds(session.user.id, role);

    const rows =
      brandIds.length === 0
        ? []
        : await db.query.products.findMany({
            where: (p, { inArray }) => inArray(p.brandId, brandIds),
            with: { brand: { columns: { name: true } }, seals: { columns: { seal: true } } },
            orderBy: (p, { asc }) => [asc(p.name)],
          });

    return c.json(
      rows.map((p) =>
        toDTO({
          id: p.id,
          brandId: p.brandId,
          brandName: p.brand.name,
          categoryId: p.categoryId,
          name: p.name,
          slug: p.slug,
          description: p.description,
          story: p.story,
          price: p.price,
          stock: p.stock,
          imageUrl: p.imageUrl,
          status: p.status,
          seals: p.seals.map((s) => s.seal),
        }),
      ),
    );
  })

  .post('/vendedor/productos', vendedorOrAdmin, zValidator('json', CreateProductInput), async (c) => {
    const input = c.req.valid('json');
    if (!(await puedeGestionarMarca(c, input.brandId))) {
      return c.json({ error: 'forbidden', message: 'No gestionás esa marca.' }, 403);
    }

    const slug = await uniqueSlug(input.brandId, input.name);
    const [created] = await db
      .insert(products)
      .values({
        brandId: input.brandId,
        categoryId: input.categoryId ?? null,
        name: input.name,
        slug,
        description: input.description || null,
        story: input.story || null,
        price: String(input.price),
        stock: input.stock,
        imageUrl: input.imageUrl || null,
        status: input.status,
      })
      .returning();
    if (!created) return c.json({ error: 'insert_failed' }, 500);

    await setSeals(created.id, input.seals);

    const brand = await db.query.brands.findFirst({
      where: (t, { eq: eqCol }) => eqCol(t.id, created.brandId),
      columns: { name: true },
    });

    return c.json(
      toDTO({ ...created, brandName: brand?.name ?? '', seals: input.seals }),
      201,
    );
  })

  .patch('/vendedor/productos/:id', vendedorOrAdmin, zValidator('json', UpdateProductInput), async (c) => {
    const id = c.req.param('id');
    const input = c.req.valid('json');

    const existing = await db.query.products.findFirst({ where: (t, { eq: eqCol }) => eqCol(t.id, id) });
    if (!existing) return c.json({ error: 'not_found' }, 404);
    if (!(await puedeGestionarMarca(c, existing.brandId))) {
      return c.json({ error: 'forbidden', message: 'No gestionás esa marca.' }, 403);
    }

    const slug =
      input.name === existing.name ? existing.slug : await uniqueSlug(existing.brandId, input.name, id);

    const [updated] = await db
      .update(products)
      .set({
        categoryId: input.categoryId ?? null,
        name: input.name,
        slug,
        description: input.description || null,
        story: input.story || null,
        price: String(input.price),
        stock: input.stock,
        imageUrl: input.imageUrl || null,
        status: input.status,
      })
      .where(eq(products.id, id))
      .returning();
    if (!updated) return c.json({ error: 'update_failed' }, 500);

    await setSeals(id, input.seals);

    const brand = await db.query.brands.findFirst({
      where: (t, { eq: eqCol }) => eqCol(t.id, updated.brandId),
      columns: { name: true },
    });

    return c.json(toDTO({ ...updated, brandName: brand?.name ?? '', seals: input.seals }));
  })

  .delete('/vendedor/productos/:id', vendedorOrAdmin, async (c) => {
    const id = c.req.param('id');
    const existing = await db.query.products.findFirst({
      where: (t, { eq: eqCol }) => eqCol(t.id, id),
      columns: { id: true, brandId: true },
    });
    if (!existing) return c.json({ error: 'not_found' }, 404);
    if (!(await puedeGestionarMarca(c, existing.brandId))) {
      return c.json({ error: 'forbidden', message: 'No gestionás esa marca.' }, 403);
    }
    await db.delete(products).where(eq(products.id, id));
    return c.json({ ok: true });
  });
