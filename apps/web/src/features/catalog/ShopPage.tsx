import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  EmptyState,
  ErrorState,
  FilterChip,
  Icon,
  Loader,
  ProductCard,
} from '../../components/index.ts';
import { useCategories, useProducts } from '../../lib/queries.ts';
import { useCart } from '../../stores/cart.ts';

const PRICE_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: 'Todos los precios' },
  { label: 'Hasta $10.000', max: 10000 },
  { label: '$10.000 – $20.000', min: 10000, max: 20000 },
  { label: 'Más de $20.000', min: 20000 },
];

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? undefined;
  const q = params.get('q') ?? '';
  const priceIdx = Math.min(Number(params.get('price') ?? 0) || 0, PRICE_RANGES.length - 1);
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const range = PRICE_RANGES[priceIdx] ?? PRICE_RANGES[0]!;

  const { data: categories } = useCategories();
  const {
    data: products,
    isLoading,
    isError,
  } = useProducts({
    category,
    q: q.trim() || undefined,
    minPrice: range.min,
    maxPrice: range.max,
  });
  const add = useCart((s) => s.add);

  const sortedProducts = useMemo(() => {
    if (!products || sort === 'featured') return products;
    return [...products].sort((a, b) => {
      const difference = Number(a.price) - Number(b.price);
      return sort === 'price-asc' ? difference : -difference;
    });
  }, [products, sort]);

  const patch = (mut: (p: URLSearchParams) => void) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mut(next);
        return next;
      },
      { replace: true },
    );

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-6">
      <header className="mb-5">
        <h1 className="font-display text-display-lg-mobile text-primary">Mercado</h1>
        <p className="text-body-md text-on-surface-variant">
          Todo el catálogo sustentable del Alto Valle.
        </p>
      </header>

      <div className="relative mb-4">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant"
        />
        <input
          value={q}
          onChange={(e) =>
            patch((p) => (e.target.value ? p.set('q', e.target.value) : p.delete('q')))
          }
          placeholder="Buscar productos locales…"
          className="w-full rounded-full border border-outline-variant bg-surface-bright py-2.5 pl-11 pr-4 text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:outline-none"
        />
      </div>

      <section
        aria-label="Filtros del catálogo"
        className="mb-6 rounded-xl bg-surface-container-low p-3 paper-border sm:p-4"
      >
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
          <FilterChip active={!category} onClick={() => patch((p) => p.delete('category'))}>
            Todos
          </FilterChip>
          {categories?.map((c) => (
            <FilterChip
              key={c.id}
              active={category === c.slug}
              onClick={() => patch((p) => p.set('category', c.slug))}
            >
              {c.name}
            </FilterChip>
          ))}
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {PRICE_RANGES.map((r, i) => (
            <FilterChip
              key={r.label}
              active={priceIdx === i}
              onClick={() =>
                patch((p) => (i === 0 ? p.delete('price') : p.set('price', String(i))))
              }
            >
              {r.label}
            </FilterChip>
          ))}
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-sm text-on-surface-variant" aria-live="polite">
          {isLoading ? 'Buscando productos…' : `${products?.length ?? 0} productos`}
        </p>
        <label className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          Ordenar por
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
            className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3 text-body-sm text-on-surface"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <Loader label="Cargando productos…" />
      ) : isError ? (
        <ErrorState />
      ) : sortedProducts && sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              price={p.price}
              imageUrl={p.imageUrl}
              category={p.categoryName}
              seal={p.seals[0] ?? null}
              to={`/producto/${p.slug}`}
              onAdd={() =>
                add({
                  productId: p.id,
                  name: p.name,
                  price: Number(p.price),
                  imageUrl: p.imageUrl,
                  brandId: p.brandId,
                  brandName: p.brandName,
                  brandSlug: p.brandSlug,
                })
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="search_off"
          title="Sin resultados"
          hint="Probá con otros filtros o términos de búsqueda."
        />
      )}
    </div>
  );
}
