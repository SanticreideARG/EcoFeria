import { cn } from '../lib/cn.ts';
import { Icon } from './Icon.tsx';

type NavItem = { label: string; href: string };

const DEFAULT_NAV: NavItem[] = [
  { label: 'Mercado', href: '#' },
  { label: 'Agenda', href: '#' },
  { label: 'Blog', href: '#' },
];

type TopAppBarProps = {
  cartCount?: number;
  onCartClick?: () => void;
  /** Label del ítem de nav activo (desktop). */
  activeNav?: string;
  nav?: NavItem[];
  className?: string;
};

/** Barra superior sticky: logo, nav desktop y carrito con badge. */
export function TopAppBar({
  cartCount = 0,
  onCartClick,
  activeNav = 'Mercado',
  nav = DEFAULT_NAV,
  className,
}: TopAppBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/90 px-5 backdrop-blur-md',
        className,
      )}
    >
      <button
        type="button"
        className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high active:scale-95 md:hidden"
        aria-label="Menú"
      >
        <Icon name="menu" />
      </button>

      <div className="font-display text-display-lg-mobile tracking-tight text-primary">
        La Ecoferia
      </div>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-4 md:flex">
        {nav.map((item) => {
          const active = item.label === activeNav;
          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-2 transition-colors active:scale-95',
                active
                  ? 'font-bold text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high',
              )}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onCartClick}
          aria-label={`Carrito${cartCount > 0 ? ` (${cartCount})` : ''}`}
          className="relative rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high active:scale-95"
        >
          <Icon name="shopping_bag" />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[11px] font-bold text-on-secondary">
              {cartCount}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label="Perfil"
          className="hidden rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high active:scale-95 md:flex"
        >
          <Icon name="person" />
        </button>
      </div>
    </header>
  );
}
