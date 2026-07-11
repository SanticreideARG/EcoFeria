import { Link } from 'react-router-dom';
import type { ImpactSeal as Seal } from '@ecoferia/shared';
import { cn } from '../lib/cn.ts';
import { formatARS } from '../lib/format.ts';
import { Icon } from './Icon.tsx';
import { ImpactSeal } from './ImpactSeal.tsx';

type ProductCardProps = {
  name: string;
  /** Precio numérico o string numérico (ARS). Se formatea internamente. */
  price: number | string;
  imageUrl?: string | null;
  seal?: Seal | null;
  category?: string | null;
  onAdd?: () => void;
  /** Ruta al detalle; si se define, la imagen y el título enlazan ahí. */
  to?: string;
  className?: string;
};

/** Card de producto: borde de papel, imagen 1:1, precio en terracota, botón circular de carrito. */
export function ProductCard({
  name,
  price,
  imageUrl,
  seal,
  category,
  onAdd,
  to,
  className,
}: ProductCardProps) {
  const media = (
    <>
      <div className="relative aspect-square w-full overflow-hidden bg-surface-container-low">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-outline-variant">
            <Icon name="image" className="text-4xl" />
          </div>
        )}
        {seal && <ImpactSeal seal={seal} className="absolute left-2 top-2 shadow-sm" />}
      </div>
      <div className="flex flex-1 flex-col p-3 pb-1">
        {category && <span className="mb-1 text-label-caps text-primary/70">{category}</span>}
        <h3 className="line-clamp-2 text-title-lg leading-tight text-on-surface">{name}</h3>
      </div>
    </>
  );

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg bg-surface-container-lowest paper-border shadow-[0_8px_24px_-4px_rgba(62,74,57,0.04)] transition-transform hover:-translate-y-1',
        className,
      )}
    >
      {to ? (
        <Link to={to} className="flex flex-1 flex-col">
          {media}
        </Link>
      ) : (
        <div className="flex flex-1 flex-col">{media}</div>
      )}

      <div className="flex items-center justify-between p-3 pt-2">
        <span className="font-display text-headline-md text-secondary">{formatARS(price)}</span>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Agregar ${name} al carrito`}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary text-on-primary shadow-sm transition-transform hover:opacity-90 active:scale-95"
          >
            <Icon name="add_shopping_cart" className="text-lg" />
          </button>
        )}
      </div>
    </article>
  );
}
