import { IMPACT_SEAL_LABELS, type ImpactSeal as Seal } from '@ecoferia/shared';
import { cn } from '../lib/cn.ts';

/** Sello de impacto como chip: fondo madera clara, texto bosque (DESIGN.md §Chips). */
export function ImpactSeal({ seal, className }: { seal: Seal; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full bg-brand-accent px-2 py-0.5 text-label-caps text-forest',
        className,
      )}
    >
      {IMPACT_SEAL_LABELS[seal]}
    </span>
  );
}
