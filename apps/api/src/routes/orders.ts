import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db, eq, inArray, orderItems, orders } from '@ecoferia/db';
import { OrderDTO, UpdateOrderStatusInput } from '@ecoferia/shared';
import { auth } from '../auth.ts';
import { adminOnly, requireAuth, vendedorOrAdmin } from '../middleware/auth.ts';
import { managedBrandIds } from '../lib/managedBrands.ts';

type OrderRow = {
  id: string;
  status: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  subtotal: string;
  shippingCost: string;
  total: string;
  shippingAddress: unknown;
  createdAt: Date;
  user: { name: string; email: string };
  items: {
    id: string;
    productId: string | null;
    quantity: number;
    unitPrice: string;
    brandId: string;
    brand: { name: string };
    product: { name: string } | null;
  }[];
};

function toDTO(o: OrderRow) {
  const addr = o.shippingAddress as { street: string; city: string; province: string } | null;
  return OrderDTO.parse({
    id: o.id,
    status: o.status,
    subtotal: o.subtotal,
    shippingCost: o.shippingCost,
    total: o.total,
    shippingAddress: addr,
    createdAt: o.createdAt.toISOString(),
    customerName: o.user.name,
    customerEmail: o.user.email,
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.product?.name ?? 'Producto eliminado',
      brandId: i.brandId,
      brandName: i.brand.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  });
}

export const ordersRoutes = new Hono()
  .get('/mis-pedidos', requireAuth, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth' }, 401);

    const rows = await db.query.orders.findMany({
      where: (o, { eq: eqCol }) => eqCol(o.userId, session.user.id),
      with: {
        user: { columns: { name: true, email: true } },
        items: {
          with: { brand: { columns: { name: true } }, product: { columns: { name: true } } },
        },
      },
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });

    return c.json(rows.map(toDTO));
  })

  .get('/vendedor/pedidos', vendedorOrAdmin, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth' }, 401);
    const role = (session.user as { role?: string }).role;

    const brandIds = await managedBrandIds(session.user.id, role);
    if (brandIds.length === 0) return c.json([]);

    const relevantIds = await db
      .selectDistinct({ orderId: orderItems.orderId })
      .from(orderItems)
      .where(inArray(orderItems.brandId, brandIds));
    if (relevantIds.length === 0) return c.json([]);

    const rows = await db.query.orders.findMany({
      where: (o, { inArray: inArr }) => inArr(o.id, relevantIds.map((r) => r.orderId)),
      with: {
        user: { columns: { name: true, email: true } },
        items: {
          where: (oi, { inArray: inArr }) => inArr(oi.brandId, brandIds),
          with: { brand: { columns: { name: true } }, product: { columns: { name: true } } },
        },
      },
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });

    return c.json(rows.map(toDTO));
  })

  .get('/admin/pedidos', adminOnly, async (c) => {
    const rows = await db.query.orders.findMany({
      with: {
        user: { columns: { name: true, email: true } },
        items: {
          with: { brand: { columns: { name: true } }, product: { columns: { name: true } } },
        },
      },
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });
    return c.json(rows.map(toDTO));
  })

  .patch('/admin/pedidos/:id', adminOnly, zValidator('json', UpdateOrderStatusInput), async (c) => {
    const id = c.req.param('id');
    const { status } = c.req.valid('json');
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning({ id: orders.id });
    if (!updated) return c.json({ error: 'not_found' }, 404);
    return c.json({ ok: true });
  });
