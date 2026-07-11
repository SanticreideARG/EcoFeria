import type { ReactNode } from 'react';
import { Icon } from './Icon.tsx';

/** Spinner de carga centrado. */
export function Loader({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="grid place-items-center py-20 text-on-surface-variant">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-primary" />
      <p className="mt-3 text-body-sm">{label}</p>
    </div>
  );
}

/** Estado de error de carga. */
export function ErrorState({ message = 'No pudimos cargar el contenido.' }: { message?: string }) {
  return (
    <div className="grid place-items-center py-20 text-on-surface-variant">
      <Icon name="cloud_off" className="text-4xl text-error" />
      <p className="mt-3 text-body-md">{message}</p>
    </div>
  );
}

/** Estado vacío (sin resultados). */
export function EmptyState({
  icon = 'inbox',
  title,
  hint,
  action,
}: {
  icon?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center py-20 text-center text-on-surface-variant">
      <Icon name={icon} className="text-5xl text-outline-variant" />
      <p className="mt-3 text-title-lg text-on-surface">{title}</p>
      {hint && <p className="mt-1 max-w-[24rem] text-body-sm">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
