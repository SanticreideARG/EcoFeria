import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/cn.ts';
import { Icon } from './Icon.tsx';

type NavEntry = { label: string; icon: string; to: string; match: string[] };

const ITEMS: NavEntry[] = [
  { label: 'Mercado', icon: 'storefront', to: '/tienda', match: ['/', '/tienda', '/marcas', '/producto'] },
  { label: 'Agenda', icon: 'event_note', to: '/agenda', match: ['/agenda'] },
  { label: 'Blog', icon: 'article', to: '/blog', match: ['/blog'] },
  { label: 'Perfil', icon: 'person', to: '/ingreso', match: ['/ingreso', '/perfil'] },
];

function matches(pathname: string, prefix: string): boolean {
  return prefix === '/' ? pathname === '/' : pathname.startsWith(prefix);
}

/** Navegación inferior fija (mobile). Oculta en md+. Ítem activo como pill. */
export function BottomNavBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface/90 px-4 py-2 pb-[max(env(safe-area-inset-bottom),8px)] shadow-sm backdrop-blur-md md:hidden">
      {ITEMS.map((item) => {
        const active = item.match.some((p) => matches(pathname, p));
        return (
          <Link
            key={item.label}
            to={item.to}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center justify-center transition-transform active:scale-90',
              active
                ? 'rounded-full bg-primary-container px-4 py-1 text-on-primary-container'
                : 'text-on-surface-variant hover:text-primary',
            )}
          >
            <Icon name={item.icon} filled={active} />
            <span className="mt-0.5 text-label-caps">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
