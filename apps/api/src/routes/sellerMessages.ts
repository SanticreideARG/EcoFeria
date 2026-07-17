import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db, inArray, messages } from '@ecoferia/db';
import { MessageThreadDTO, SendMessageInput } from '@ecoferia/shared';
import { auth } from '../auth.ts';
import { vendedorOrAdmin } from '../middleware/auth.ts';
import { puedeGestionarMarca } from '../lib/brandOwnership.ts';
import { managedBrandIds } from '../lib/managedBrands.ts';

/**
 * `readAt` es una propiedad global del mensaje (no por-lector): se interpreta
 * como "la marca ya vio este mensaje del cliente". Los mensajes de la marca
 * nunca se marcan (no hay buzón de cliente en Sprint 1). `fromCustomer` se
 * determina por el ROL del remitente, no por su id exacto: en el seed, el
 * lado "marca" a veces lo manda el admin en representación del vendedor.
 */

export const sellerMessagesRoutes = new Hono()
  .get('/vendedor/mensajes', vendedorOrAdmin, async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth' }, 401);
    const role = (session.user as { role?: string }).role;

    const brandIds = await managedBrandIds(session.user.id, role);
    if (brandIds.length === 0) return c.json([]);

    const rows = await db.query.messages.findMany({
      where: (m, { inArray }) => inArray(m.brandId, brandIds),
      with: { brand: { columns: { name: true } }, sender: { columns: { name: true, email: true, role: true } } },
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    });

    const threads = new Map<
      string,
      {
        threadId: string;
        brandId: string;
        brandName: string;
        customerName: string;
        customerEmail: string;
        hasUnread: boolean;
        messages: { id: string; body: string; fromCustomer: boolean; createdAt: string; readAt: string | null }[];
      }
    >();

    for (const m of rows) {
      const fromCustomer = m.sender.role === 'cliente';
      let t = threads.get(m.threadId);
      if (!t) {
        t = {
          threadId: m.threadId,
          brandId: m.brandId,
          brandName: m.brand.name,
          customerName: fromCustomer ? m.sender.name : '',
          customerEmail: fromCustomer ? m.sender.email : '',
          hasUnread: false,
          messages: [],
        };
        threads.set(m.threadId, t);
      }
      if (fromCustomer && !t.customerName) {
        t.customerName = m.sender.name;
        t.customerEmail = m.sender.email;
      }
      if (fromCustomer && !m.readAt) t.hasUnread = true;
      t.messages.push({
        id: m.id,
        body: m.body,
        fromCustomer,
        createdAt: m.createdAt.toISOString(),
        readAt: m.readAt?.toISOString() ?? null,
      });
    }

    const result = [...threads.values()]
      .filter((t) => t.customerName) // hilo sin ningún mensaje de cliente identificado: lo omitimos
      .sort((a, b) => {
        const aLast = a.messages.at(-1)?.createdAt ?? '';
        const bLast = b.messages.at(-1)?.createdAt ?? '';
        return bLast.localeCompare(aLast);
      });

    return c.json(result.map((t) => MessageThreadDTO.parse(t)));
  })

  .post('/vendedor/mensajes/:threadId', vendedorOrAdmin, zValidator('json', SendMessageInput), async (c) => {
    const threadId = c.req.param('threadId');
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth' }, 401);

    const anyInThread = await db.query.messages.findFirst({
      where: (m, { eq: eqCol }) => eqCol(m.threadId, threadId),
      columns: { brandId: true },
    });
    if (!anyInThread) return c.json({ error: 'not_found' }, 404);
    if (!(await puedeGestionarMarca(c, anyInThread.brandId))) {
      return c.json({ error: 'forbidden', message: 'No gestionás esa marca.' }, 403);
    }

    const { body } = c.req.valid('json');
    await db.insert(messages).values({
      threadId,
      brandId: anyInThread.brandId,
      senderUserId: session.user.id,
      body,
    });
    return c.json({ ok: true }, 201);
  })

  .post('/vendedor/mensajes/:threadId/leer', vendedorOrAdmin, async (c) => {
    const threadId = c.req.param('threadId');

    const anyInThread = await db.query.messages.findFirst({
      where: (m, { eq: eqCol }) => eqCol(m.threadId, threadId),
      columns: { brandId: true },
    });
    if (!anyInThread) return c.json({ error: 'not_found' }, 404);
    if (!(await puedeGestionarMarca(c, anyInThread.brandId))) {
      return c.json({ error: 'forbidden' }, 403);
    }

    const unread = await db.query.messages.findMany({
      where: (m, { and, eq: eqCol, isNull }) => and(eqCol(m.threadId, threadId), isNull(m.readAt)),
      with: { sender: { columns: { role: true } } },
      columns: { id: true },
    });
    const clienteIds = unread.filter((m) => m.sender.role === 'cliente').map((m) => m.id);
    if (clienteIds.length > 0) {
      await db.update(messages).set({ readAt: new Date() }).where(inArray(messages.id, clienteIds));
    }
    return c.json({ ok: true, marked: clienteIds.length });
  });
