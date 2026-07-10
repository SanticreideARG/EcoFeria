import type { ImpactSeal as Seal } from '@ecoferia/shared';
import { cn } from '../lib/cn.ts';
import { Icon } from './Icon.tsx';
import { ImpactSeal } from './ImpactSeal.tsx';

type BrandCardProps = {
  name: string;
  tagline?: string | null;
  logoUrl?: string | null;
  seals?: Seal[];
  onFollow?: () => void;
  onMessage?: () => void;
  className?: string;
};

/** Card de marca (directorio): logo circular, sellos como chips, acciones Seguir / Mensaje. */
export function BrandCard({
  name,
  tagline,
  logoUrl,
  seals = [],
  onFollow,
  onMessage,
  className,
}: BrandCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 paper-border',
        className,
      )}
    >
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
          {tagline && (
            <p className="line-clamp-1 text-body-sm text-on-surface-variant">{tagline}</p>
          )}
        </div>
      </div>

      {seals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {seals.map((seal) => (
            <ImpactSeal key={seal} seal={seal} />
          ))}
        </div>
      )}

      <div className="mt-auto flex gap-2 pt-1">
        <button
          type="button"
          onClick={onFollow}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-primary py-1.5 text-title-lg text-primary transition-transform active:scale-95"
        >
          <Icon name="favorite" className="text-lg" />
          Seguir
        </button>
        <button
          type="button"
          onClick={onMessage}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-1.5 text-title-lg text-on-primary transition-transform active:scale-95"
        >
          <Icon name="chat_bubble" className="text-lg" />
          Mensaje
        </button>
      </div>
    </article>
  );
}
