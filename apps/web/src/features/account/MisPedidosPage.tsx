import { Navigate } from 'react-router-dom';
import { EmptyState, ErrorState, Loader } from '../../components/index.ts';
import { useSession } from '../../lib/auth-client.ts';
import { useMyOrders } from '../../lib/queries.ts';
import { OrderCard } from '../panel/OrderCard.tsx';
import { AccountTabs } from './AccountTabs.tsx';

export function MisPedidosPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const { data: orders, isLoading, isError } = useMyOrders(Boolean(session));

  if (!sessionPending && !session) return <Navigate to="/ingreso" replace />;

  return (
    <div className="mx-auto max-w-[640px] px-5 py-6">
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Mis pedidos</h1>
        <p className="text-body-md text-on-surface-variant">Historial de tus compras en La Ecoferia.</p>
      </header>

      <AccountTabs />

      {sessionPending || isLoading ? (
        <Loader label="Cargando pedidos…" />
      ) : isError ? (
        <ErrorState />
      ) : !orders || orders.length === 0 ? (
        <EmptyState icon="local_shipping" title="Todavía no hiciste ningún pedido" />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
