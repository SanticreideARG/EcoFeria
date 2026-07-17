import type { OrderDTO, OrderStatus } from '@ecoferia/shared';
import { Icon } from '../../components/index.ts';
import { cn } from '../../lib/cn.ts';
import { formatARS, formatDateLong } from '../../lib/format.ts';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  pendiente: 'bg-tertiary-fixed text-on-tertiary-fixed',
  confirmado: 'bg-primary-fixed text-on-primary-fixed',
  enviado: 'bg-secondary-fixed text-on-secondary-fixed',
  entregado: 'bg-primary text-on-primary',
  cancelado: 'bg-error-container text-on-error-container',
};

const ALL_STATUSES: OrderStatus[] = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];

type OrderCardProps = {
  order: OrderDTO;
  /** Si se define, muestra un selector de estado en vez de un badge de solo lectura (uso admin). */
  onStatusChange?: (status: OrderStatus) => void;
  statusPending?: boolean;
  /** Muestra el nombre/email del cliente (uso admin; el vendedor ya sabe quién es su cliente por contexto). */
  showCustomer?: boolean;
};

export function OrderCard({ order, onStatusChange, statusPending, showCustomer }: OrderCardProps) {
  const groupedByBrand = new Map<string, { brandName: string; items: OrderDTO['items'] }>();
  for (const item of order.items) {
    const g = groupedByBrand.get(item.brandId) ?? { brandName: item.brandName, items: [] };
    g.items.push(item);
    groupedByBrand.set(item.brandId, g);
  }

  return (
    <article className="rounded-xl bg-surface-container-lowest p-4 paper-border">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-body-sm text-on-surface-variant">{formatDateLong(order.createdAt)}</p>
          {showCustomer && (
            <p className="text-title-lg text-on-surface">
              {order.customerName} <span className="text-body-sm text-on-surface-variant">· {order.customerEmail}</span>
            </p>
          )}
        </div>

        {onStatusChange ? (
          <select
            value={order.status}
            onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
            disabled={statusPending}
            className={cn(
              'rounded-full border-0 px-3 py-1.5 text-label-caps focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50',
              STATUS_BADGE[order.status],
            )}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        ) : (
          <span className={cn('rounded-full px-3 py-1.5 text-label-caps', STATUS_BADGE[order.status])}>
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {[...groupedByBrand.values()].map((g) => (
          <div key={g.brandName} className="border-t border-outline-variant/60 pt-3 first:border-0 first:pt-0">
            <p className="mb-1.5 flex items-center gap-1.5 text-label-caps uppercase text-secondary">
              <Icon name="storefront" className="text-base" /> {g.brandName}
            </p>
            <ul className="space-y-1">
              {g.items.map((i) => (
                <li key={i.id} className="flex items-center justify-between text-body-sm text-on-surface-variant">
                  <span>
                    {i.quantity}× {i.productName}
                  </span>
                  <span>{formatARS(Number(i.unitPrice) * i.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-outline-variant pt-3">
        {order.shippingAddress && (
          <p className="flex items-center gap-1 text-body-sm text-on-surface-variant">
            <Icon name="location_on" className="text-base" />
            {order.shippingAddress.street}, {order.shippingAddress.city}
          </p>
        )}
        <p className="ml-auto text-title-lg text-primary">{formatARS(order.total)}</p>
      </div>
    </article>
  );
}
