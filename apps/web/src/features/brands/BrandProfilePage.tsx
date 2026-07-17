import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BrandContactInput, type BrandProfileDTO } from '@ecoferia/shared';
import {
  CtaButton,
  ErrorState,
  Icon,
  ImpactSeal,
  Loader,
  PaperInput,
  PaperTextarea,
  ProductCard,
  Tabs,
} from '../../components/index.ts';
import { cn } from '../../lib/cn.ts';
import { useSession } from '../../lib/auth-client.ts';
import { useAddFavorite, useBrand, useBrandContact, useRemoveFavorite } from '../../lib/queries.ts';
import { useCart } from '../../stores/cart.ts';

function BrandHeader({ brand }: { brand: BrandProfileDTO }) {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const favoritePending = addFavorite.isPending || removeFavorite.isPending;

  const toggleFavorite = () => {
    if (!session) return navigate('/ingreso');
    if (brand.isFavorite) removeFavorite.mutate(brand.id);
    else addFavorite.mutate(brand.id);
  };

  return (
    <header className="relative">
      <div className="relative h-48 bg-gradient-to-br from-primary via-surface-tint to-secondary md:h-60">
        <Link
          to="/marcas"
          className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-surface/80 text-primary backdrop-blur-sm active:scale-95"
          aria-label="Volver al directorio"
        >
          <Icon name="arrow_back" />
        </Link>
      </div>
      <div className="mx-auto -mt-12 max-w-[1280px] rounded-t-3xl bg-surface px-5 pt-6">
        <div className="flex items-center gap-4">
          <div className="grid h-24 w-24 flex-shrink-0 place-items-center overflow-hidden rounded-full border-4 border-surface bg-surface-container-low shadow-md">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="h-full w-full object-cover" />
            ) : (
              <Icon name="storefront" className="text-3xl text-outline-variant" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-label-caps uppercase text-primary/60">La Ecoferia</p>
            <h1 className="font-display text-display-lg-mobile text-primary">{brand.name}</h1>
            {brand.tagline && (
              <span className="mt-1 inline-block rounded-full bg-brand-accent/20 px-3 py-1 text-label-caps text-primary">
                {brand.tagline}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={favoritePending}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-full border py-2 text-title-lg transition-colors active:scale-95 disabled:opacity-50',
              brand.isFavorite
                ? 'border-primary bg-primary text-on-primary'
                : 'border-primary text-primary hover:bg-primary-container/30',
            )}
          >
            <Icon name="favorite" filled={brand.isFavorite} className="text-lg" />{' '}
            {brand.isFavorite ? 'Siguiendo' : 'Seguir'}
          </button>
          <button
            type="button"
            title="Disponible próximamente"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-2 text-title-lg text-on-primary opacity-90"
          >
            <Icon name="chat_bubble" className="text-lg" /> Mensaje
          </button>
        </div>
      </div>
    </header>
  );
}

function ContactForm({ slug }: { slug: string }) {
  const mutation = useBrandContact(slug);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const parsed = BrandContactInput.safeParse({
      name: form.get('name'),
      email: form.get('email'),
      message: form.get('message'),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisá los datos del formulario.');
      return;
    }
    mutation.mutate(parsed.data);
  };

  if (mutation.isSuccess) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-6 text-center paper-border">
        <Icon name="mark_email_read" filled className="text-4xl text-primary" />
        <p className="mt-3 text-title-lg text-on-surface">¡Mensaje enviado!</p>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          La marca se pondrá en contacto con vos pronto.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-6 paper-border">
      <h2 className="mb-4 font-display text-headline-md text-primary">Escribinos</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <PaperInput name="name" label="Nombre" required />
        <PaperInput name="email" type="email" label="Correo electrónico" required />
        <PaperTextarea name="message" label="Mensaje" rows={4} required />
        {error && <p className="text-body-sm text-error">{error}</p>}
        <CtaButton type="submit" variant="primary" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enviando…' : 'Enviar mensaje'}
        </CtaButton>
        {mutation.isError && (
          <p className="text-body-sm text-error">No pudimos enviar el mensaje. Reintentá.</p>
        )}
      </form>

      <div className="mt-8 border-t border-outline-variant pt-5">
        <h3 className="mb-3 text-title-lg text-primary">Puntos de entrega</h3>
        <ul className="space-y-2 text-body-md text-on-surface-variant">
          <li className="flex items-start gap-2">
            <Icon name="location_on" className="mt-0.5 text-primary" /> Taller central (San Martín
            de los Andes)
          </li>
          <li className="flex items-start gap-2">
            <Icon name="storefront" className="mt-0.5 text-primary" /> Feria Artesanal (sábados por
            la mañana)
          </li>
        </ul>
      </div>
    </div>
  );
}

export function BrandProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: brand, isLoading, isError } = useBrand(slug);
  const [tab, setTab] = useState('productos');
  const add = useCart((s) => s.add);

  if (isLoading) return <Loader label="Cargando marca…" />;
  if (isError || !brand) return <ErrorState message="No encontramos esta marca." />;

  return (
    <div>
      <BrandHeader brand={brand} />

      <div className="mx-auto max-w-[1280px] px-5">
        <p className="py-4 text-body-md text-on-surface-variant">{brand.description}</p>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'productos', label: 'Productos' },
            { id: 'nosotros', label: 'Sobre Nosotros' },
            { id: 'contacto', label: 'Contacto' },
          ]}
        />
      </div>

      <div className="mx-auto max-w-[1280px] px-5 py-6">
        {tab === 'productos' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {brand.products.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                price={p.price}
                imageUrl={p.imageUrl}
                seal={p.seals[0] ?? null}
                to={`/producto/${p.slug}`}
                onAdd={() =>
                  add({
                    productId: p.id,
                    name: p.name,
                    price: Number(p.price),
                    imageUrl: p.imageUrl,
                    brandId: brand.id,
                    brandName: brand.name,
                    brandSlug: brand.slug,
                  })
                }
              />
            ))}
          </div>
        )}

        {tab === 'nosotros' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-surface-container-lowest p-6 paper-border">
              <h2 className="mb-3 font-display text-headline-md text-primary">Nuestra raíz</h2>
              <p className="text-body-md text-on-surface-variant">{brand.description}</p>
              {brand.categoryName && (
                <span className="mt-4 inline-flex items-center gap-1 text-body-sm text-on-surface-variant">
                  <Icon name="category" className="text-base text-secondary" /> {brand.categoryName}
                </span>
              )}
            </div>

            {brand.products.some((p) => p.seals.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {[...new Set(brand.products.flatMap((p) => p.seals))].map((s) => (
                  <ImpactSeal key={s} seal={s} />
                ))}
              </div>
            )}

            <div>
              <h3 className="mb-4 font-display text-headline-md text-primary">Diario de la marca</h3>
              {brand.posts.length > 0 ? (
                <div className="space-y-4">
                  {brand.posts.map((post) => (
                    <article key={post.id} className="flex gap-4">
                      <div className="grid h-20 w-20 flex-shrink-0 place-items-center rounded-lg bg-surface-container-low text-outline-variant paper-border">
                        <Icon name="photo_camera" />
                      </div>
                      <div>
                        <h4 className="text-title-lg text-on-surface">{post.title}</h4>
                        <p className="line-clamp-2 text-body-sm text-on-surface-variant">
                          {post.body}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-body-sm text-on-surface-variant">
                  Esta marca todavía no publicó novedades.
                </p>
              )}
            </div>
          </div>
        )}

        {tab === 'contacto' && <ContactForm slug={brand.slug} />}
      </div>
    </div>
  );
}
