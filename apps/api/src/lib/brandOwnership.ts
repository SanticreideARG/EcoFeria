import type { Context } from 'hono';
import { brands, db, eq, sellerProfiles } from '@ecoferia/db';
import { auth } from '../auth.ts';

/**
 * Un vendedor gestiona solo sus propias marcas (`brands.managedBySellerId` ->
 * `seller_profiles.userId`); un admin gestiona cualquiera. Base para proteger
 * mutaciones de marca/producto en Sprint 2 (paneles de vendedor/admin).
 */
export async function puedeGestionarMarca(c: Context, brandId: string): Promise<boolean> {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role === 'admin') return true;
  if (role === 'vendedor' && session) {
    const [row] = await db
      .select({ sellerUserId: sellerProfiles.userId })
      .from(brands)
      .innerJoin(sellerProfiles, eq(brands.managedBySellerId, sellerProfiles.id))
      .where(eq(brands.id, brandId));
    return row?.sellerUserId === session.user.id;
  }
  return false;
}
