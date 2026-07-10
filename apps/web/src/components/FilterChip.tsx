import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

type FilterChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
};

/** Chip de filtro pill: activo en primary, inactivo con borde de contorno. */
export function FilterChip({ active = false, className, children, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'whitespace-nowrap rounded-full px-4 py-2 text-label-caps transition-colors active:scale-95',
        active
          ? 'bg-primary text-on-primary'
          : 'border border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
