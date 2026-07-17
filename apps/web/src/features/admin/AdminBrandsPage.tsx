import type { AdminBrandDTO, BrandStatus } from '@ecoferia/shared';
import { EmptyState, ErrorState, Icon, Loader } from '../../components/index.ts';
import { cn } from '../../lib/cn.ts';
import { useAdminBrands, useUpdateBrandStatus } from '../../lib/queries.ts';

const STATUS: Record<BrandStatus, { label: string; badge: string }> = {
  activa: { label: 'Activa', badge: 'bg-primary-fixed text-on-primary-fixed' },
  pausada: { label: 'Pausada', badge: 'bg-error-container text-on-error-container' },
};

function BrandRow({ brand }: { brand: AdminBrandDTO }) {
  const update = useUpdateBrandStatus();
  const toggle = () => update.mutate({ id: brand.id, status: brand.status === 'activa' ? 'pausada' : 'activa' });
  const s = STATUS[brand.status];

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 paper-border sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-title-lg text-on-surface">{brand.name}</h3>
          <span className={cn('rounded-full px-2 py-0.5 text-label-caps', s.badge)}>{s.label}</span>
        </div>
        <p className="truncate text-body-sm text-on-surface-variant">
          {brand.categoryName ?? 'Sin categoría'} · {brand.productCount} producto
          {brand.productCount === 1 ? '' : 's'}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-body-sm text-on-surface-variant">
          <Icon name={brand.ownerType === 'admin' ? 'shield_person' : 'person'} className="text-base" />{' '}
          {brand.ownerName}
        </p>
      </div>

      <div className="flex flex-shrink-0 gap-2">
        <button
          type="button"
          onClick={toggle}
          disabled={update.isPending}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-4 py-2 text-label-caps transition-transform active:scale-95 disabled:opacity-50',
            brand.status === 'activa'
              ? 'border border-error text-error hover:bg-error-container/40'
              : 'bg-primary text-on-primary',
          )}
        >
          <Icon name={brand.status === 'activa' ? 'pause' : 'play_arrow'} className="text-base" />{' '}
          {brand.status === 'activa' ? 'Pausar' : 'Reactivar'}
        </button>
      </div>
    </article>
  );
}

export function AdminBrandsPage() {
  const { data: brands, isLoading, isError } = useAdminBrands();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Marcas</h1>
        <p className="text-body-md text-on-surface-variant">
          Directorio de todas las marcas de La Ecoferia. Pausar oculta la marca y sus productos de la tienda pública.
        </p>
      </header>

      {isLoading ? (
        <Loader label="Cargando marcas…" />
      ) : isError || !brands ? (
        <ErrorState />
      ) : brands.length === 0 ? (
        <EmptyState icon="storefront" title="Todavía no hay marcas" />
      ) : (
        <div className="space-y-3">
          {brands.map((b) => (
            <BrandRow key={b.id} brand={b} />
          ))}
        </div>
      )}
    </div>
  );
}
