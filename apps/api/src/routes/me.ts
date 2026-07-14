import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db, eq, users } from '@ecoferia/db';
import { UpdateProfileInput, UserProfileDTO } from '@ecoferia/shared';
import { auth } from '../auth.ts';

/** Perfil del usuario autenticado. Requiere sesión válida de Better Auth. */
export const meRoute = new Hono()
  .get('/me', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth', message: 'No autenticado.' }, 401);

    const user = await db.query.users.findFirst({
      where: (t, { eq: eqCol }) => eqCol(t.id, session.user.id),
    });
    if (!user) return c.json({ error: 'not_found', message: 'Usuario no encontrado.' }, 404);

    return c.json(
      UserProfileDTO.parse({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        image: user.image,
      }),
    );
  })
  .patch('/me', zValidator('json', UpdateProfileInput), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'no_auth', message: 'No autenticado.' }, 401);

    const input = c.req.valid('json');
    const [updated] = await db
      .update(users)
      .set({
        name: input.name,
        phone: input.phone ? input.phone : null,
        address: input.address ? input.address : null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning();
    if (!updated) return c.json({ error: 'not_found', message: 'Usuario no encontrado.' }, 404);

    return c.json(
      UserProfileDTO.parse({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        phone: updated.phone,
        address: updated.address,
        image: updated.image,
      }),
    );
  });
