import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

type Variant = 'primary' | 'tertiary' | 'secondary' | 'surface';

const VARIANTS: Record<Variant, string> = {
  // Acción principal (verde bosque).
  primary: 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container',
  // CTA de compra/pago (dorado).
  tertiary: 'bg-tertiary-container text-on-tertiary-container hover:opacity-90',
  // Secundaria (contorno terracota).
  secondary: 'border border-secondary bg-transparent text-secondary hover:bg-secondary-container/20',
  // Sobre superficies oscuras/imágenes.
  surface: 'bg-surface-bright text-primary hover:bg-surface',
};

type CtaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

/** Botón de acción del design system (pill/rounded, microinteracción táctil). */
export function CtaButton({ variant = 'primary', className, children, ...props }: CtaButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-title-lg transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
