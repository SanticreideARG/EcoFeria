import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, Icon } from '../../components/index.ts';
import { formatARS } from '../../lib/format.ts';
import { groupByBrand, selectCartTotal, useCart } from '../../stores/cart.ts';

function CheckoutStepper() {
  const steps = ['Envío', 'Pago', 'Confirmación'];
  return (
    <div className="flex items-center">
      {steps.map((label, i) => (
        <Fragment key={label}>
          <div className="flex flex-col items-center gap-1">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-brand-accent bg-surface-container text-body-sm text-on-surface-variant">
              {i + 1}
            </span>
            <span className="text-label-caps text-on-surface-variant">{label}</span>
          </div>
          {i < steps.length - 1 && <div className="mx-2 h-px flex-1 bg-brand-accent" />}
        </Fragment>
      ))}
    </div>
  );
}

export function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const total = useCart(selectCartTotal);
  const groups = groupByBrand(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-6">
        <EmptyState
          icon="shopping_cart"
          title="Tu carrito está vacío"
          hint="Descubrí productos sustentables de la Patagonia."
          action={
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-title-lg text-on-primary active:scale-95"
            >
              <Icon name="storefront" className="text-lg" /> Ir al mercado
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 py-6">
      <h1 className="mb-5 font-display text-display-lg-mobile text-primary">Tu carrito</h1>

      <div className="space-y-5">
        {groups.map((group) => (
          <section
            key={group.brandId}
            className="rounded-xl bg-surface-container-lowest p-4 paper-border"
          >
            <Link
              to={`/marcas/${group.brandSlug}`}
              className="mb-3 flex items-center gap-2 text-title-lg text-primary"
            >
              <Icon name="storefront" className="text-lg" /> {group.brandName}
            </Link>

            <ul className="divide-y divide-outline-variant/50">
              {group.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3 py-3">
                  <div className="grid h-16 w-16 flex-shrink-0 place-items-center overflow-hidden rounded-md bg-surface-container-low text-outline-variant">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon name="image" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-body-md text-on-surface">{item.name}</p>
                    <p className="text-body-sm text-secondary">{formatARS(item.price)}</p>
                  </div>
                  <div className="flex items-center rounded-full border border-outline-variant">
                    <button
                      type="button"
                      aria-label="Restar"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="grid h-8 w-8 place-items-center text-primary active:scale-95"
                    >
                      <Icon name="remove" className="text-base" />
                    </button>
                    <span className="w-7 text-center text-body-md">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Sumar"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center text-primary active:scale-95"
                    >
                      <Icon name="add" className="text-base" />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={`Quitar ${item.name}`}
                    onClick={() => remove(item.productId)}
                    className="grid h-8 w-8 place-items-center text-outline hover:text-error active:scale-95"
                  >
                    <Icon name="delete" className="text-lg" />
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-2 text-right text-body-sm text-on-surface-variant">
              Subtotal marca: <span className="text-on-surface">{formatARS(group.subtotal)}</span>
            </p>
          </section>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-surface-container-low p-5 paper-border">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-title-lg text-on-surface">Total</span>
          <span className="font-display text-headline-md text-secondary">{formatARS(total)}</span>
        </div>

        <p className="mb-3 text-label-caps uppercase text-on-surface-variant">Checkout</p>
        <CheckoutStepper />

        <button
          type="button"
          disabled
          title="El checkout con pago llega en el próximo sprint"
          className="mt-5 w-full cursor-not-allowed rounded-lg bg-tertiary-container/60 py-3 text-title-lg text-on-tertiary-container opacity-70"
        >
          Finalizar compra · Próximamente
        </button>
      </div>
    </div>
  );
}
