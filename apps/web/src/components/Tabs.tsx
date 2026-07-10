import { cn } from '../lib/cn.ts';

export type TabItem = { id: string; label: string };

type TabsProps = {
  tabs: ReadonlyArray<TabItem>;
  value: string;
  onChange: (id: string) => void;
  className?: string;
};

/** Tabs con borde inferior de 2px en primary sobre el activo (Productos / Nosotros / Contacto). */
export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn('no-scrollbar flex overflow-x-auto border-b border-outline-variant', className)}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex-1 whitespace-nowrap px-4 py-3 text-title-lg transition-colors',
              active
                ? 'border-b-2 border-primary text-primary'
                : 'text-on-surface-variant hover:text-primary',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
