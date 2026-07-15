import { Link } from 'react-router-dom';
import { ErrorState, Icon, Loader } from '../../components/index.ts';
import { cn } from '../../lib/cn.ts';
import { useAdminStats } from '../../lib/queries.ts';

type StatProps = {
  icon: string;
  label: string;
  value: number;
  to?: string;
  highlight?: boolean;
};

function StatCard({ icon, label, value, to, highlight }: StatProps) {
  const body = (
    <div
      className={cn(
        'flex h-full flex-col rounded-xl bg-surface-container-lowest p-5 paper-border shadow-sm transition-transform hover:-translate-y-1',
        highlight && 'ring-2 ring-secondary/40',
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-label-caps uppercase text-on-surface-variant">{label}</span>
        <Icon name={icon} filled className={highlight ? 'text-secondary' : 'text-primary'} />
      </div>
      <div className="mt-2 font-display text-display-lg-mobile text-primary">{value}</div>
      {to && (
        <span className="mt-1 flex items-center gap-1 text-body-sm font-bold text-secondary">
          Gestionar <Icon name="arrow_forward" className="text-base" />
        </span>
      )}
    </div>
  );
  return to ? (
    <Link to={to} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

export function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useAdminStats();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Resumen global</h1>
        <p className="text-body-md text-on-surface-variant">
          Estado general del marketplace de La Ecoferia.
        </p>
      </header>

      {isLoading ? (
        <Loader label="Cargando métricas…" />
      ) : isError || !stats ? (
        <ErrorState />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            icon="hourglass_top"
            label="Solicitudes pendientes"
            value={stats.sellersPending}
            to="/admin/vendedores"
            highlight={stats.sellersPending > 0}
          />
          <StatCard
            icon="group"
            label="Vendedores aprobados"
            value={stats.sellersApproved}
            to="/admin/vendedores"
          />
          <StatCard icon="storefront" label="Marcas" value={stats.brands} to="/admin/marcas" />
          <StatCard icon="inventory_2" label="Productos publicados" value={stats.products} />
          <StatCard icon="category" label="Categorías" value={stats.categories} />
          <StatCard icon="person" label="Clientes" value={stats.clients} />
        </div>
      )}
    </div>
  );
}
