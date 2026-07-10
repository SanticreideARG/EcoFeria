import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { ImpactSeal as Seal } from '@ecoferia/shared';
import { cn } from '../lib/cn.ts';
import { Icon } from './Icon.tsx';
import { ImpactSeal } from './ImpactSeal.tsx';

type BrandCardProps = {
  name: string;
  tagline?: string | null;
  logoUrl?: string | null;
  seals?: Seal[];
  productCount?: number;
  /** Ruta al perfil de la marca; si se define, toda la card es un enlace. */
  to?: string;
  className?: string;
};

/** Card de marca (directorio): logo circular, tagline y sellos de impacto. */
export function BrandCard({
  name,
  tagline,
  logoUrl,
  seals = [],
  productCount,
  to,
  className,
}: BrandCardProps) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-outline-variant bg-surface-container-low">
          {logoUrl ? (
            <img src={logoUrl} alt={`Logo de ${name}`} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-outline-variant">
              <Icon name="storefront" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-headline-md text-primary">{name}</h3>
          {tagline && <p className="line-clamp-1 text-body-sm text-on-surface-variant">{tagline}</p>}
        </div>
      </div>

      {seals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {seals.map((seal) => (
            <ImpactSeal key={seal} seal={seal} />
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-1 text-body-sm text-on-surface-variant">
        <span>{productCount != null ? `${productCount} productos` : ''}</span>
        <span className="flex items-center gap-1 font-bold text-primary">
          Ver marca <Icon name="arrow_forward" className="text-base" />
        </span>
      </div>
    </>
  );

  const cardClass = cn(
    'flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 paper-border transition-transform hover:-translate-y-1',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={cardClass}>
        {content}
      </Link>
    );
  }
  return <article className={cardClass}>{content as ReactNode}</article>;
}
