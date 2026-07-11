import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon, Loader } from '../../components/index.ts';
import { useBlog, useBrands, useCategories, useEvents } from '../../lib/queries.ts';

function HeroSearch() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/tienda?q=${encodeURIComponent(q.trim())}` : '/tienda');
  };
  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-bright p-1.5 shadow-lg sm:gap-2 sm:p-2"
    >
      <Icon name="search" className="ml-2 text-outline" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar miel, cerámicas, hongos…"
        aria-label="Buscar productos"
        className="min-w-0 flex-1 border-none bg-transparent px-1 text-body-md text-on-surface placeholder:text-outline focus:outline-none"
      />
      <button
        type="submit"
        className="min-h-10 rounded-full bg-primary px-4 py-2 text-label-caps uppercase text-on-primary transition-colors hover:bg-primary-container active:scale-95 sm:px-5"
      >
        Buscar
      </button>
    </form>
  );
}

const HERO_SLIDES = [
  {
    id: 'territorio',
    image: '/hero/del-bosque-a-tu-mesa.webp',
    eyebrow: 'San Martín de los Andes · Neuquén',
    title: 'Raíces de nuestra tierra',
    description:
      'Productos locales, orgánicos y sustentables, directo de artesanos patagónicos a tu hogar.',
    primaryLabel: 'Explorar el mercado',
    primaryTo: '/tienda',
    secondaryLabel: 'Conocer productores',
    secondaryTo: '/marcas',
  },
  {
    id: 'oficios',
    image: '/hero/manos-que-crean.webp',
    eyebrow: 'Oficios con identidad patagónica',
    title: 'Manos que crean',
    description:
      'Conocé a las personas, los saberes y las historias detrás de cada pieza de la feria.',
    primaryLabel: 'Descubrir productores',
    primaryTo: '/marcas',
    secondaryLabel: 'Leer sus historias',
    secondaryTo: '/blog',
  },
  {
    id: 'impacto',
    image: '/hero/vivir-consciente.webp',
    eyebrow: 'Elegí local · Elegí circular',
    title: 'Viví de manera consciente',
    description:
      'Objetos cotidianos con propósito, hechos para durar y cuidar el territorio que habitamos.',
    primaryLabel: 'Comprar con impacto',
    primaryTo: '/tienda',
    secondaryLabel: 'Ver la comunidad',
    secondaryTo: '/marcas',
  },
] as const;

function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = HERO_SLIDES[current]!;

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(
      () => setCurrent((index) => (index + 1) % HERO_SLIDES.length),
      30_000,
    );
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Historias destacadas de La Ecoferia"
      className="relative isolate min-h-[500px] rounded-b-xl border-b border-outline-variant bg-primary md:mx-5 md:mt-5 md:min-h-0 md:rounded-xl md:border"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <div className="absolute inset-0 -z-20 overflow-hidden rounded-[inherit]">
        {HERO_SLIDES.map((item, index) => (
          <img
            key={item.id}
            src={item.image}
            alt=""
            aria-hidden="true"
            fetchPriority={index === 0 ? 'high' : 'auto'}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-[opacity,transform] duration-1000 ease-out ${
              index === current ? 'scale-100 opacity-100' : 'scale-[1.025] opacity-0'
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-r from-inverse-surface/95 via-inverse-surface/65 to-inverse-surface/5" />

      <div className="relative z-10 flex min-h-[500px] items-center px-5 pb-24 pt-10 text-on-primary md:min-h-[480px] md:px-10 md:pb-24 md:pt-14 lg:px-14">
        <div key={slide.id} className="max-w-[42rem] animate-[hero-copy-in_700ms_ease-out]">
          <p className="mb-3 text-label-caps uppercase opacity-90">{slide.eyebrow}</p>
          <h1 className="mb-4 max-w-[760px] font-display text-display-lg-mobile md:text-display-lg lg:text-[56px] lg:leading-[1.05]">
            {slide.title}
          </h1>
          <p className="max-w-[34rem] text-body-md opacity-90 md:text-title-lg">
            {slide.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to={slide.primaryTo}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-bright px-5 py-2 font-bold text-primary transition-transform hover:-translate-y-0.5"
            >
              {slide.primaryLabel} <Icon name="arrow_forward" className="text-lg" />
            </Link>
            <Link
              to={slide.secondaryTo}
              className="inline-flex min-h-11 items-center rounded-full border border-on-primary/50 px-5 py-2 font-bold text-on-primary hover:bg-on-primary/10"
            >
              {slide.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-14 right-5 z-20 flex items-center gap-2 md:bottom-16 md:right-10 lg:right-14">
        <div className="flex items-center gap-1 rounded-full border border-on-primary/20 bg-inverse-surface/35 p-1.5 backdrop-blur-sm">
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Mostrar diapositiva ${index + 1}: ${item.title}`}
              aria-current={index === current ? 'true' : undefined}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                index === current
                  ? 'w-8 bg-on-primary'
                  : 'w-2.5 bg-on-primary/45 hover:bg-on-primary/70'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label={isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'}
          aria-pressed={isPaused}
          onClick={() => setIsPaused((paused) => !paused)}
          className="grid h-10 w-10 place-items-center rounded-full border border-on-primary/20 bg-inverse-surface/35 text-on-primary backdrop-blur-sm hover:bg-inverse-surface/55"
        >
          <Icon name={isPaused ? 'play_arrow' : 'pause'} className="text-lg" />
        </button>
      </div>

      <div className="absolute bottom-0 left-5 right-5 z-20 translate-y-1/2 md:left-10 md:right-10 lg:left-14 lg:right-14">
        <HeroSearch />
      </div>
    </section>
  );
}

function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();
  return (
    <section className="px-5 pt-16 md:pt-10">
      <h2 className="mb-5 font-display text-headline-md text-on-surface">Descubrí lo artesanal</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories?.map((c) => (
            <Link
              key={c.id}
              to={`/tienda?category=${c.slug}`}
              className="group flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl bg-surface-container-low p-4 text-center paper-border transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-md"
            >
              <Icon
                name={c.icon ?? 'category'}
                className="text-4xl text-secondary transition-transform group-hover:scale-110"
              />
              <span className="text-title-lg text-on-surface">{c.name}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedBrands() {
  const { data: brands, isLoading } = useBrands();
  const featured = brands?.slice(0, 4);
  return (
    <section className="px-5 py-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-display text-headline-md text-on-surface">Marcas destacadas</h2>
        <Link to="/marcas" className="flex items-center gap-1 text-body-sm font-bold text-primary">
          Ver todas <Icon name="arrow_forward" className="text-base" />
        </Link>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured?.map((b) => (
            <Link
              key={b.id}
              to={`/marcas/${b.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-lowest p-4 text-center paper-border transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-md"
            >
              <div className="grid h-16 w-16 place-items-center rounded-full border border-outline-variant bg-surface-container-low text-outline-variant">
                <Icon name="storefront" />
              </div>
              <span className="font-display text-title-lg text-primary">{b.name}</span>
              {b.tagline && (
                <span className="line-clamp-2 text-body-sm text-on-surface-variant">
                  {b.tagline}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function CommunityTeaser() {
  const { data: posts } = useBlog();
  const { data: events } = useEvents();
  const nextEvent = events?.[0];

  return (
    <section className="mx-0 my-10 rounded-xl border border-outline-variant bg-surface-container-low px-5 py-8 md:mx-5">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-headline-md text-on-surface">
              <Icon name="eco" filled className="text-primary" />
              Novedades del blog
            </h2>
            <Link
              to="/blog"
              className="flex items-center gap-1 text-body-sm font-bold text-primary"
            >
              Ver todas <Icon name="arrow_forward" className="text-base" />
            </Link>
          </div>
          <div className="space-y-4">
            {posts?.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="flex items-center gap-4 rounded-lg border border-outline-variant bg-surface p-4 transition-shadow hover:shadow-md"
              >
                <div className="grid h-16 w-16 flex-shrink-0 place-items-center overflow-hidden rounded-md bg-surface-container-low text-outline-variant">
                  {p.coverUrl ? (
                    <img src={p.coverUrl} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <Icon name="article" />
                  )}
                </div>
                <h3 className="text-title-lg leading-tight text-on-surface">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-5 flex items-center gap-2 font-display text-headline-md text-on-surface">
            <Icon name="calendar_month" filled className="text-secondary" />
            Próximos eventos
          </h2>
          <div className="flex h-[calc(100%-3.25rem)] flex-col justify-between rounded-xl bg-primary p-6 text-on-primary shadow-md">
            {nextEvent ? (
              <>
                <div>
                  <p className="mb-2 text-label-caps uppercase text-primary-fixed">Próximamente</p>
                  <h3 className="mb-2 font-display text-headline-md">{nextEvent.title}</h3>
                  <p className="text-body-md opacity-90">{nextEvent.location}</p>
                </div>
                <Link
                  to="/agenda"
                  className="mt-6 rounded-lg bg-surface-bright py-2 text-center text-title-lg text-primary transition-colors hover:bg-surface"
                >
                  Ver agenda completa
                </Link>
              </>
            ) : (
              <p className="text-body-md opacity-90">Sin eventos por ahora.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <Hero />
      <CategoriesSection />
      <FeaturedBrands />
      <CommunityTeaser />
    </div>
  );
}
