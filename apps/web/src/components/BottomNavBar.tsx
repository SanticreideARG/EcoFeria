import { cn } from '../lib/cn.ts';
import { Icon } from './Icon.tsx';

export type BottomNavId = 'mercado' | 'agenda' | 'blog' | 'perfil';

type NavEntry = { id: BottomNavId; label: string; icon: string; href: string };

const ITEMS: NavEntry[] = [
  { id: 'mercado', label: 'Mercado', icon: 'storefront', href: '#' },
  { id: 'agenda', label: 'Agenda', icon: 'event_note', href: '#' },
  { id: 'blog', label: 'Blog', icon: 'article', href: '#' },
  { id: 'perfil', label: 'Perfil', icon: 'person', href: '#' },
];

/** Navegación inferior fija (mobile). Oculta en md+. Ítem activo como pill. */
export function BottomNavBar({ active = 'mercado' }: { active?: BottomNavId }) {
  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface/90 px-4 py-2 pb-[max(env(safe-area-inset-bottom),8px)] shadow-sm backdrop-blur-md md:hidden"
    >
      {ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <a
            key={item.id}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center justify-center transition-transform active:scale-90',
              isActive
                ? 'rounded-full bg-primary-container px-4 py-1 text-on-primary-container'
                : 'text-on-surface-variant hover:text-primary',
            )}
          >
            <Icon name={item.icon} filled={isActive} />
            <span className="mt-0.5 text-label-caps">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
