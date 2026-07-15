import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Icon, Loader } from '../../components/index.ts';
import { useSellerOverview } from '../../lib/queries.ts';

export function SellerDashboardPage() {
  const { data: overview, isLoading, isError } = useSellerOverview();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Tu panel</h1>
        <p className="text-body-md text-on-surface-variant">
          Gestioná tus marcas, productos y pedidos.
        </p>
      </header>

      {isLoading ? (
        <Loader label="Cargando tu panel…" />
      ) : isError || !overview ? (
        <ErrorState />
      ) : (
        <>
          {overview.sellerStatus === 'pendiente' && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-tertiary-fixed/50 p-4">
              <Icon name="hourglass_top" filled className="text-on-tertiary-fixed" />
              <div>
                <p className="text-title-lg text-on-tertiary-fixed">Solicitud en revisión</p>
                <p className="text-body-sm text-on-tertiary-fixed">
                  Un administrador va a revisar tu cuenta de vendedor pronto.
                </p>
              </div>
            </div>
          )}
          {overview.sellerStatus === 'rechazado' && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-container/60 p-4">
              <Icon name="cancel" filled className="text-on-error-container" />
              <p className="text-body-md text-on-error-container">
                Tu solicitud de vendedor fue rechazada. Escribinos si creés que es un error.
              </p>
            </div>
          )}

          <h2 className="mb-3 text-label-caps uppercase text-on-surface-variant">Mis marcas</h2>
          {overview.brands.length === 0 ? (
            <EmptyState
              icon="storefront"
              title="Todavía no gestionás marcas"
              hint="Cuando tengas una marca asignada, vas a verla acá."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {overview.brands.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 paper-border"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-display text-headline-md text-primary">{b.name}</h3>
                    <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-label-caps text-on-surface-variant">
                      {b.status}
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-body-md text-on-surface-variant">
                    <Icon name="inventory_2" className="text-lg text-primary" /> {b.productCount}{' '}
                    producto{b.productCount === 1 ? '' : 's'}
                  </p>
                  <div className="mt-auto flex gap-2 pt-1">
                    <Link
                      to="/vendedor/productos"
                      className="flex items-center gap-1 text-body-sm font-bold text-primary"
                    >
                      Gestionar productos <Icon name="arrow_forward" className="text-base" />
                    </Link>
                    <Link
                      to={`/marcas/${b.slug}`}
                      className="ml-auto text-body-sm text-on-surface-variant hover:text-primary"
                    >
                      Ver público
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
