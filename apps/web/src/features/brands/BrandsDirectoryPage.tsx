import { useState } from 'react';
import {
  BrandCard,
  EmptyState,
  ErrorState,
  FilterChip,
  Icon,
  Loader,
} from '../../components/index.ts';
import { useBrands, useCategories } from '../../lib/queries.ts';

export function BrandsDirectoryPage() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [q, setQ] = useState('');

  const { data: categories } = useCategories();
  const { data: brands, isLoading, isError } = useBrands({ category, q: q.trim() || undefined });

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-6">
      <header className="mb-5">
        <h1 className="font-display text-display-lg-mobile text-primary">Directorio de Marcas</h1>
        <p className="text-body-md text-on-surface-variant">
          Conocé a los productores y artesanos de la Patagonia.
        </p>
      </header>

      <div className="relative mb-4">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar marca…"
          className="w-full rounded-full border border-outline-variant bg-surface-bright py-2.5 pl-11 pr-4 text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:outline-none"
        />
      </div>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={!category} onClick={() => setCategory(undefined)}>
          Todas
        </FilterChip>
        {categories?.map((c) => (
          <FilterChip
            key={c.id}
            active={category === c.slug}
            onClick={() => setCategory(c.slug)}
          >
            {c.name}
          </FilterChip>
        ))}
      </div>

      {isLoading ? (
        <Loader label="Cargando marcas…" />
      ) : isError ? (
        <ErrorState />
      ) : brands && brands.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <BrandCard
              key={b.id}
              name={b.name}
              tagline={b.tagline}
              logoUrl={b.logoUrl}
              seals={b.seals}
              productCount={b.productCount}
              to={`/marcas/${b.slug}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="storefront"
          title="No encontramos marcas"
          hint="Probá con otra categoría o término de búsqueda."
        />
      )}
    </div>
  );
}
