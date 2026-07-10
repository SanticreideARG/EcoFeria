import { hashPassword } from 'better-auth/crypto';
import { accounts, createConnection, eq } from '@ecoferia/db';

/**
 * Asigna (o actualiza) la contraseña de un usuario ya existente en `users`
 * sin pasar por el flujo de signup — útil para cuentas sembradas directo por
 * SQL (ej. el admin del seed) que nunca tuvieron una fila `accounts` de
 * Better Auth. Usa el mismo hash (`better-auth/crypto`) que el signup real.
 *
 * Uso: pnpm --filter @ecoferia/api set-password <email> <password>
 */
const [, , email, password] = process.argv;
if (!email || !password) {
  console.error('Uso: pnpm --filter @ecoferia/api set-password <email> <password>');
  process.exit(1);
}
if (password.length < 8) {
  console.error('La contraseña debe tener al menos 8 caracteres.');
  process.exit(1);
}

const { db, close } = await createConnection();

const user = await db.query.users.findFirst({ where: (t, { eq: eqCol }) => eqCol(t.email, email) });
if (!user) {
  console.error(`No existe un usuario con email ${email}`);
  await close();
  process.exit(1);
}

const hash = await hashPassword(password);

const existing = await db.query.accounts.findFirst({
  where: (t, { and, eq: eqCol }) => and(eqCol(t.userId, user.id), eqCol(t.providerId, 'credential')),
});

if (existing) {
  await db
    .update(accounts)
    .set({ password: hash, updatedAt: new Date() })
    .where(eq(accounts.id, existing.id));
  console.log(`✅ Contraseña actualizada para ${email} (rol: ${user.role})`);
} else {
  await db.insert(accounts).values({
    id: crypto.randomUUID(),
    accountId: user.id,
    providerId: 'credential',
    userId: user.id,
    password: hash,
  });
  console.log(`✅ Contraseña creada para ${email} (rol: ${user.role})`);
}

await close();
