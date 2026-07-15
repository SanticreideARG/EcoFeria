import type { AdminSellerDTO, SellerStatus } from '@ecoferia/shared';
import { EmptyState, ErrorState, Icon, Loader } from '../../components/index.ts';
import { cn } from '../../lib/cn.ts';
import { useAdminSellers, useUpdateSellerStatus } from '../../lib/queries.ts';

const STATUS: Record<SellerStatus, { label: string; badge: string }> = {
  pendiente: { label: 'Pendiente', badge: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  aprobado: { label: 'Aprobado', badge: 'bg-primary-fixed text-on-primary-fixed' },
  rechazado: { label: 'Rechazado', badge: 'bg-error-container text-on-error-container' },
};

function SellerRow({ seller }: { seller: AdminSellerDTO }) {
  const update = useUpdateSellerStatus();
  const setStatus = (status: SellerStatus) => update.mutate({ id: seller.id, status });
  const s = STATUS[seller.status];

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 paper-border sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-title-lg text-on-surface">{seller.name}</h3>
          <span className={cn('rounded-full px-2 py-0.5 text-label-caps', s.badge)}>{s.label}</span>
        </div>
        <p className="truncate text-body-sm text-on-surface-variant">{seller.email}</p>
        <p className="mt-0.5 flex items-center gap-1 text-body-sm text-on-surface-variant">
          <Icon name="storefront" className="text-base" /> {seller.brandCount} marca
          {seller.brandCount === 1 ? '' : 's'}
        </p>
      </div>

      <div className="flex flex-shrink-0 gap-2">
        {seller.status !== 'aprobado' && (
          <button
            type="button"
            onClick={() => setStatus('aprobado')}
            disabled={update.isPending}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-label-caps text-on-primary transition-transform active:scale-95 disabled:opacity-50"
          >
            <Icon name="check_circle" className="text-base" /> Aprobar
          </button>
        )}
        {seller.status !== 'rechazado' && (
          <button
            type="button"
            onClick={() => setStatus('rechazado')}
            disabled={update.isPending}
            className="flex items-center gap-1.5 rounded-full border border-error px-4 py-2 text-label-caps text-error transition-colors hover:bg-error-container/40 active:scale-95 disabled:opacity-50"
          >
            <Icon name="cancel" className="text-base" /> Rechazar
          </button>
        )}
      </div>
    </article>
  );
}

export function AdminSellersPage() {
  const { data: sellers, isLoading, isError } = useAdminSellers();
  const pending = sellers?.filter((s) => s.status === 'pendiente') ?? [];
  const rest = sellers?.filter((s) => s.status !== 'pendiente') ?? [];

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Vendedores</h1>
        <p className="text-body-md text-on-surface-variant">
          Aprobá o rechazá las solicitudes para vender en La Ecoferia.
        </p>
      </header>

      {isLoading ? (
        <Loader label="Cargando vendedores…" />
      ) : isError || !sellers ? (
        <ErrorState />
      ) : sellers.length === 0 ? (
        <EmptyState icon="group" title="Todavía no hay vendedores" />
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-label-caps uppercase text-secondary">
                <Icon name="hourglass_top" className="text-base" /> Pendientes de aprobación (
                {pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((s) => (
                  <SellerRow key={s.id} seller={s} />
                ))}
              </div>
            </section>
          )}
          <section>
            {pending.length > 0 && (
              <h2 className="mb-3 text-label-caps uppercase text-on-surface-variant">
                Todos los vendedores
              </h2>
            )}
            <div className="space-y-3">
              {rest.map((s) => (
                <SellerRow key={s.id} seller={s} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
