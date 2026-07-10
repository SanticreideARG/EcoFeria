import { cn } from '../lib/cn.ts';

type IconProps = {
  /** Nombre del glifo Material Symbols Outlined (ej. "shopping_bag"). */
  name: string;
  /** Ícono relleno (FILL 1). */
  filled?: boolean;
  className?: string;
};

/** Ícono monolineal (Material Symbols Outlined), set de iconografía del design system. */
export function Icon({ name, filled = false, className }: IconProps) {
  return (
    <span
      aria-hidden
      className={cn('material-symbols-outlined select-none leading-none', className)}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
