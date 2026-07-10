import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CtaButton, ErrorState, Icon, ImpactSeal, Loader } from '../../components/index.ts';
import { formatARS } from '../../lib/format.ts';
import { useProduct } from '../../lib/queries.ts';
import { useCart } from '../../stores/cart.ts';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);

  if (isLoading) return <Loader label="Cargando producto…" />;
  if (isError || !product) return <ErrorState message="No encontramos este producto." />;

  const agotado = product.status === 'agotado' || product.stock <= 0;

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-6">
      <Link
        to="/tienda"
        className="mb-4 inline-flex items-center gap-1 text-body-sm font-bold text-primary"
      >
        <Icon name="arrow_back" className="text-base" /> Volver al mercado
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-container-low paper-border">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-outline-variant">
              <Icon name="image" className="text-6xl" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <Link
            to={`/marcas/${product.brand.slug}`}
            className="text-label-caps uppercase text-primary/70 hover:text-primary"
          >
            {product.brand.name}
          </Link>
          <h1 className="mt-1 font-display text-headline-md text-on-surface">{product.name}</h1>

          {product.seals.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.seals.map((s) => (
                <ImpactSeal key={s} seal={s} />
              ))}
            </div>
          )}

          <p className="mt-4 font-display text-display-lg-mobile text-secondary">
            {formatARS(product.price)}
          </p>

          {product.description && (
            <p className="mt-3 text-body-md text-on-surface-variant">{product.description}</p>
          )}

          {product.story && (
            <div className="mt-4 rounded-lg bg-surface-container-low p-4 paper-border">
              <p className="mb-1 text-label-caps uppercase text-primary/70">Historia del productor</p>
              <p className="text-body-md text-on-surface-variant">{product.story}</p>
            </div>
          )}

          <div className="mt-auto pt-6">
            <p className="mb-2 text-body-sm text-on-surface-variant">
              {agotado ? 'Sin stock disponible' : `${product.stock} disponibles`}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-outline-variant">
                <button
                  type="button"
                  aria-label="Restar"
                  onClick={() => setQty((n) => Math.max(1, n - 1))}
                  className="grid h-10 w-10 place-items-center text-primary active:scale-95"
                >
                  <Icon name="remove" />
                </button>
                <span className="w-8 text-center text-title-lg">{qty}</span>
                <button
                  type="button"
                  aria-label="Sumar"
                  onClick={() => setQty((n) => Math.min(product.stock, n + 1))}
                  className="grid h-10 w-10 place-items-center text-primary active:scale-95"
                >
                  <Icon name="add" />
                </button>
              </div>
              <CtaButton
                variant="tertiary"
                className="flex-1"
                disabled={agotado}
                onClick={() =>
                  add(
                    {
                      productId: product.id,
                      name: product.name,
                      price: Number(product.price),
                      imageUrl: product.imageUrl,
                      brandId: product.brandId,
                      brandName: product.brand.name,
                      brandSlug: product.brand.slug,
                    },
                    qty,
                  )
                }
              >
                <Icon name="add_shopping_cart" className="text-lg" /> Agregar al carrito
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
