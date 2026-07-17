import { Navigate } from 'react-router-dom';
import type { BrandListItemDTO } from '@ecoferia/shared';
import { BrandCard, EmptyState, ErrorState, Icon, Loader } from '../../components/index.ts';
import { useSession } from '../../lib/auth-client.ts';
import { useFavorites, useRemoveFavorite } from '../../lib/queries.ts';
import { AccountTabs } from './AccountTabs.tsx';

function FavoriteBrandCard({ brand }: { brand: BrandListItemDTO }) {
  const removeFavorite = useRemoveFavorite();

  return (
    <div className="relative">
      <BrandCard
        name={brand.name}
        tagline={brand.tagline}
        logoUrl={brand.logoUrl}
        seals={brand.seals}
        productCount={brand.productCount}
        to={`/marcas/${brand.slug}`}
      />
      <button
        type="button"
        aria-label={`Quitar ${brand.name} de favoritos`}
        title="Quitar de favoritos"
        disabled={removeFavorite.isPending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeFavorite.mutate(brand.id);
        }}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-error backdrop-blur-sm transition-transform active:scale-95 disabled:opacity-50"
      >
        <Icon name="favorite" filled className="text-lg" />
      </button>
    </div>
  );
}

export function FavoritosPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const { data: brands, isLoading, isError } = useFavorites(Boolean(session));

  if (!sessionPending && !session) return <Navigate to="/ingreso" replace />;

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-6">
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Favoritos</h1>
        <p className="text-body-md text-on-surface-variant">Las marcas que seguís.</p>
      </header>

      <AccountTabs />

      {sessionPending || isLoading ? (
        <Loader label="Cargando favoritos…" />
      ) : isError ? (
        <ErrorState />
      ) : !brands || brands.length === 0 ? (
        <EmptyState
          icon="favorite"
          title="Todavía no seguís ninguna marca"
          hint="Andá al perfil de una marca y tocá “Seguir” para sumarla acá."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <FavoriteBrandCard key={b.id} brand={b} />
          ))}
        </div>
      )}
    </div>
  );
}
