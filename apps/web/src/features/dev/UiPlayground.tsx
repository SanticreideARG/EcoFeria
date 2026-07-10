import { useState, type ReactNode } from 'react';
import { ImpactSeal as ImpactSealSchema } from '@ecoferia/shared';
import {
  BottomNavBar,
  BrandCard,
  CtaButton,
  FilterChip,
  Icon,
  ImpactSeal,
  PaperInput,
  PaperTextarea,
  ProductCard,
  Tabs,
  TopAppBar,
} from '../../components/index.ts';

const SWATCHES: { label: string; className: string; ink?: string }[] = [
  { label: 'primary', className: 'bg-primary', ink: 'text-on-primary' },
  { label: 'primary-container', className: 'bg-primary-container', ink: 'text-on-primary-container' },
  { label: 'secondary', className: 'bg-secondary', ink: 'text-on-secondary' },
  { label: 'secondary-container', className: 'bg-secondary-container', ink: 'text-on-secondary-container' },
  { label: 'tertiary', className: 'bg-tertiary', ink: 'text-on-tertiary' },
  { label: 'tertiary-container', className: 'bg-tertiary-container', ink: 'text-on-tertiary-container' },
  { label: 'brand-accent', className: 'bg-brand-accent', ink: 'text-forest' },
  { label: 'surface', className: 'bg-surface border border-outline-variant', ink: 'text-on-surface' },
  { label: 'surface-container', className: 'bg-surface-container', ink: 'text-on-surface' },
  { label: 'surface-container-high', className: 'bg-surface-container-high', ink: 'text-on-surface' },
  { label: 'error', className: 'bg-error', ink: 'text-on-error' },
  { label: 'error-container', className: 'bg-error-container', ink: 'text-on-error-container' },
];

const SAMPLE_PRODUCTS = [
  { name: 'Miel Cruda de Montaña', price: 12000, category: 'Miel', seal: 'local' as const, imageUrl: null },
  { name: 'Kit de Autocultivo Fungi', price: 15500, category: 'Autocultivo', seal: 'zero_waste' as const, imageUrl: null },
  { name: 'Cuenco de Cerámica Ruke', price: 8500, category: 'Cerámica', seal: 'fair_trade' as const, imageUrl: null },
  { name: 'Serum Facial Rosa Mosqueta', price: 9800, category: 'Cosmética', seal: 'organico' as const, imageUrl: null },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-headline-md text-primary">{title}</h2>
      {children}
    </section>
  );
}

export function UiPlayground() {
  const [tab, setTab] = useState('productos');
  const [chip, setChip] = useState('Todos');
  const [cart, setCart] = useState(0);

  const seals = ImpactSealSchema.options;

  return (
    <div className="min-h-dvh pb-28">
      <TopAppBar cartCount={cart} />

      <main className="mx-auto max-w-[1000px] px-5 py-8">
        <p className="text-label-caps uppercase text-secondary">Design System</p>
        <h1 className="mb-8 font-display text-display-lg-mobile text-primary">
          Patagonian Artisanal Organic
        </h1>

        <Section title="Color">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {SWATCHES.map((s) => (
              <div
                key={s.label}
                className={`flex h-20 flex-col justify-end rounded-lg p-2 ${s.className} ${s.ink ?? ''}`}
              >
                <span className="text-label-caps">{s.label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tipografía">
          <div className="space-y-3 rounded-xl bg-surface-container-low p-5 paper-border">
            <p className="font-display text-display-lg-mobile text-on-surface">
              Raíces de nuestra tierra
            </p>
            <p className="font-display text-headline-md text-on-surface">
              Descubrí lo artesanal (headline-md)
            </p>
            <p className="text-title-lg text-on-surface">Título de componente (title-lg)</p>
            <p className="text-body-md text-on-surface-variant">
              Cuerpo (body-md) — Inter, legible en móvil, tono cálido y comunitario.
            </p>
            <p className="text-body-sm text-on-surface-variant">Cuerpo chico (body-sm)</p>
            <p className="text-label-caps uppercase text-primary">Label caps · metadata</p>
          </div>
        </Section>

        <Section title="Botones (CtaButton)">
          <div className="flex flex-wrap items-center gap-3">
            <CtaButton variant="primary">
              <Icon name="favorite" className="text-lg" /> Seguir
            </CtaButton>
            <CtaButton variant="tertiary">
              <Icon name="shopping_cart" className="text-lg" /> Comprar
            </CtaButton>
            <CtaButton variant="secondary">Contactar</CtaButton>
            <div className="rounded-lg bg-surface-tint p-3">
              <CtaButton variant="surface">Ver Agenda</CtaButton>
            </div>
            <CtaButton variant="primary" disabled>
              Deshabilitado
            </CtaButton>
          </div>
        </Section>

        <Section title="Chips de filtro">
          <div className="flex flex-wrap gap-2">
            {['Todos', 'Alimentos', 'Cosmética', 'Hogar', 'Diseño', 'Textil'].map((c) => (
              <FilterChip key={c} active={chip === c} onClick={() => setChip(c)}>
                {c}
              </FilterChip>
            ))}
          </div>
        </Section>

        <Section title="Sellos de impacto">
          <div className="flex flex-wrap gap-2">
            {seals.map((s) => (
              <ImpactSeal key={s} seal={s} />
            ))}
          </div>
        </Section>

        <Section title="Tabs">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'productos', label: 'Productos' },
              { id: 'nosotros', label: 'Sobre Nosotros' },
              { id: 'contacto', label: 'Contacto' },
            ]}
          />
          <p className="mt-3 text-body-md text-on-surface-variant">
            Tab activo: <strong className="text-primary">{tab}</strong>
          </p>
        </Section>

        <Section title="Inputs paper">
          <form className="max-w-md space-y-4 rounded-xl bg-surface-container-lowest p-5 paper-border">
            <PaperInput label="Nombre" placeholder="Tu nombre" />
            <PaperInput label="Correo electrónico" type="email" placeholder="tu@email.com" />
            <PaperTextarea label="Mensaje" rows={3} placeholder="Escribí un mensaje…" />
            <CtaButton variant="primary" className="w-full">
              Enviar Mensaje
            </CtaButton>
          </form>
        </Section>

        <Section title="Card de producto">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SAMPLE_PRODUCTS.map((p) => (
              <ProductCard
                key={p.name}
                name={p.name}
                price={p.price}
                category={p.category}
                seal={p.seal}
                imageUrl={p.imageUrl}
                onAdd={() => setCart((n) => n + 1)}
              />
            ))}
          </div>
        </Section>

        <Section title="Card de marca">
          <div className="grid gap-4 md:grid-cols-2">
            <BrandCard
              name="EcoFungi Patagonia"
              tagline="Fungi-cultura circular"
              seals={['zero_waste', 'local', 'organico']}
            />
            <BrandCard
              name="Cerámica Ruke"
              tagline="Alfarería del bosque patagónico"
              seals={['local', 'fair_trade']}
            />
          </div>
        </Section>
      </main>

      <BottomNavBar />
    </div>
  );
}
