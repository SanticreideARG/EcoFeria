import { useEffect, type ReactNode } from 'react';
import { Icon } from './Icon.tsx';

type DialogProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/** Modal centrado (backdrop + panel), cierra con Escape o click afuera. */
export function Dialog({ title, onClose, children }: DialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <h2 className="text-title-lg text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
