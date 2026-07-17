import type { OrderStatus } from '@ecoferia/shared';
import { EmptyState, ErrorState, Loader } from '../../components/index.ts';
import { useAdminOrders, useUpdateOrderStatus } from '../../lib/queries.ts';
import { OrderCard } from '../panel/OrderCard.tsx';

export function AdminOrdersPage() {
  const { data: orders, isLoading, isError } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Pedidos globales</h1>
        <p className="text-body-md text-on-surface-variant">
          Todos los pedidos de la plataforma, de todas las marcas.
        </p>
      </header>

      {isLoading ? (
        <Loader label="Cargando pedidos…" />
      ) : isError ? (
        <ErrorState />
      ) : !orders || orders.length === 0 ? (
        <EmptyState icon="local_shipping" title="Todavía no hay pedidos" />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              showCustomer
              statusPending={updateStatus.isPending}
              onStatusChange={(status: OrderStatus) => updateStatus.mutate({ id: o.id, status })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
