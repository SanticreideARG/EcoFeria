import { db } from '@ecoferia/db';

/**
 * IDs de las marcas que gestiona un usuario: por perfil de vendedor
 * (`seller_profiles.userId`), o directo si es admin (`brands.managedByAdminId`).
 * Sin perfil y sin ser admin -> ninguna.
 */
export async function managedBrandIds(userId: string, role: string | undefined): Promise<string[]> {
  const profile = await db.query.sellerProfiles.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
    columns: { id: true },
  });
  if (profile) {
    const rows = await db.query.brands.findMany({
      where: (b, { eq }) => eq(b.managedBySellerId, profile.id),
      columns: { id: true },
    });
    return rows.map((b) => b.id);
  }
  if (role === 'admin') {
    const rows = await db.query.brands.findMany({
      where: (b, { eq }) => eq(b.managedByAdminId, userId),
      columns: { id: true },
    });
    return rows.map((b) => b.id);
  }
  return [];
}
