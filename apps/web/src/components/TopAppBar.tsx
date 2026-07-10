import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/cn.ts';
import { Icon } from './Icon.tsx';

const NAV = [
  { label: 'Mercado', to: '/tienda' },
  { label: 'Agenda', to: '/agenda' },
  { label: 'Blog', to: '/blog' },
];

function isActive(pathname: string, to: string): boolean {
  return to === '/' ? pathname === '/' : pathname.startsWith(to);
}

/** Barra superior sticky: logo, nav desktop y carrito con badge. */
export function TopAppBar({ cartCount = 0 }: { cartCount?: number }) {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/90 px-5 backdrop-blur-md">
      <button
        type="button"
        className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high active:scale-95 md:hidden"
        aria-label="Menú"
      >
        <Icon name="menu" />
      </button>

      <Link to="/" className="flex items-center gap-[15px]">
        <img
          src="/logo.png"
          alt=""
          className="h-9 w-9 flex-shrink-0 rounded-full object-cover md:h-10 md:w-10"
        />
        <span className="font-display text-display-lg-mobile tracking-tight text-primary">
          La Ecoferia
        </span>
      </Link>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-4 md:flex">
        {NAV.map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                'rounded-full px-4 py-2 transition-colors active:scale-95',
                active
                  ? 'font-bold text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-1">
        <Link
          to="/carrito"
          aria-label={`Carrito${cartCount > 0 ? ` (${cartCount})` : ''}`}
          className="relative rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high active:scale-95"
        >
          <Icon name="shopping_bag" />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[11px] font-bold text-on-secondary">
              {cartCount}
            </span>
          )}
        </Link>
        <Link
          to="/ingreso"
          aria-label="Ingresar"
          className="hidden rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high active:scale-95 md:flex"
        >
          <Icon name="person" />
        </Link>
      </div>
    </header>
  );
}
