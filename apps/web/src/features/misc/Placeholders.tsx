import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/index.ts';

/** Página "próximamente" para secciones de Sprint 2 (Agenda, Blog). */
export function ComingSoon({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-6">
      <h1 className="mb-4 font-display text-display-lg-mobile text-primary">{title}</h1>
      <EmptyState
        icon={icon}
        title="Próximamente"
        hint="Esta sección estará disponible en el próximo sprint."
      />
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-6">
      <EmptyState
        icon="explore_off"
        title="Página no encontrada"
        hint="El enlace que seguiste no existe o cambió de lugar."
        action={
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-title-lg text-on-primary active:scale-95"
          >
            Volver al inicio
          </Link>
        }
      />
    </div>
  );
}
