import { Icon } from '../../components/index.ts';
import { sessionRole, signOut, useSession } from '../../lib/auth-client.ts';

/** Esqueleto del panel de administrador (M5). El panel real es Sprint 2. */
export function AdminPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-[720px] px-5 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Icon name="shield_person" className="text-3xl text-primary" />
        <h1 className="font-display text-display-lg-mobile text-primary">Panel de Administrador</h1>
      </div>
      <p className="text-body-md text-on-surface-variant">
        Sesión: <strong className="text-on-surface">{session?.user.email}</strong> · Rol:{' '}
        <strong className="text-on-surface">{sessionRole(session)}</strong>
      </p>
      <p className="mt-4 text-body-sm text-on-surface-variant">
        Métricas globales, aprobación de vendedores, moderación de contenido y agenda cultural
        llegan en Sprint 2.
      </p>
      <button
        type="button"
        onClick={() => signOut()}
        className="mt-6 rounded-lg border border-outline-variant px-4 py-2 text-title-lg text-on-surface transition-colors hover:bg-surface-container"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
