import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/cn.ts';
import { Icon } from './Icon.tsx';

const NAV = [
  { label: 'Mercado', to: '/tienda', icon: 'storefront' },
  { label: 'Agenda', to: '/agenda', icon: 'event_note' },
  { label: 'Blog', to: '/blog', icon: 'article' },
];

function isActive(pathname: string, to: string): boolean {
  return to === '/' ? pathname === '/' : pathname.startsWith(to);
}

/** Barra superior sticky con navegación responsive, carrito y menú móvil. */
export function TopAppBar({ cartCount = 0 }: { cartCount?: number }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  const mobileNav = [{ label: 'Inicio', to: '/', icon: 'home' }, ...NAV];

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/92 px-4 backdrop-blur-md md:px-5">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full text-primary transition-colors hover:bg-surface-container-high active:scale-95 md:hidden"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>

        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
          <img
            src="/logo.png"
            alt=""
            className="h-9 w-9 flex-shrink-0 rounded-full object-cover md:h-10 md:w-10"
          />
          <span className="truncate font-display text-[27px] font-bold leading-none tracking-tight text-primary sm:text-display-lg-mobile">
            La Ecoferia
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="absolute left-1/2 hidden -translate-x-1/2 gap-4 md:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              aria-current={isActive(pathname, item.to) ? 'page' : undefined}
              className={cn(
                'rounded-full px-4 py-2 transition-colors active:scale-95',
                isActive(pathname, item.to)
                  ? 'bg-primary-fixed font-bold text-on-primary-fixed'
                  : 'text-on-surface-variant hover:bg-surface-container-high',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/carrito"
            aria-label={`Carrito${cartCount > 0 ? ` (${cartCount})` : ''}`}
            className="relative grid h-11 w-11 place-items-center rounded-full text-primary transition-colors hover:bg-surface-container-high active:scale-95"
          >
            <Icon name="shopping_bag" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[11px] font-bold text-on-secondary">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/ingreso"
            aria-label="Ingresar"
            className="hidden h-11 w-11 place-items-center rounded-full text-primary transition-colors hover:bg-surface-container-high active:scale-95 md:grid"
          >
            <Icon name="person" />
          </Link>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-inverse-surface/30 backdrop-blur-sm"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            id="menu-mobile"
            aria-label="Menú móvil"
            className="absolute left-4 right-4 top-20 rounded-xl border border-outline-variant bg-surface p-3 shadow-xl"
          >
            {mobileNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive(pathname, item.to) ? 'page' : undefined}
                className={cn(
                  'flex min-h-12 items-center gap-3 rounded-lg px-4 py-3 text-title-lg',
                  isActive(pathname, item.to)
                    ? 'bg-primary-fixed text-on-primary-fixed'
                    : 'text-on-surface hover:bg-surface-container',
                )}
              >
                <Icon name={item.icon} filled={isActive(pathname, item.to)} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
