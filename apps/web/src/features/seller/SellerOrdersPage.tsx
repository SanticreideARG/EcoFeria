import { EmptyState, ErrorState, Loader } from '../../components/index.ts';
import { useSellerOrders } from '../../lib/queries.ts';
import { OrderCard } from '../panel/OrderCard.tsx';

export function SellerOrdersPage() {
  const { data: orders, isLoading, isError } = useSellerOrders();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Pedidos recibidos</h1>
        <p className="text-body-md text-on-surface-variant">
          Pedidos de clientes que incluyen productos tuyos.
        </p>
      </header>

      {isLoading ? (
        <Loader label="Cargando pedidos…" />
      ) : isError ? (
        <ErrorState />
      ) : !orders || orders.length === 0 ? (
        <EmptyState icon="local_shipping" title="Todavía no recibiste pedidos" />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} showCustomer />
          ))}
        </div>
      )}
    </div>
  );
}
