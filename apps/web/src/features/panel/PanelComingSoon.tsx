import { EmptyState } from '../../components/index.ts';

/** Placeholder para secciones de panel aún no implementadas (pedidos, mensajería, etc.). */
export function PanelComingSoon({ title, icon = 'construction' }: { title: string; icon?: string }) {
  return (
    <div>
      <h1 className="mb-6 font-display text-display-lg-mobile text-primary">{title}</h1>
      <EmptyState
        icon={icon}
        title="Próximamente"
        hint="Esta sección del panel está en construcción."
      />
    </div>
  );
}
