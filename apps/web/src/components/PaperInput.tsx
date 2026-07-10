import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/cn.ts';

const FIELD_CLASSES =
  'w-full border-0 border-b border-brand-accent bg-surface-variant/30 px-3 py-2 text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none';

const LABEL_CLASSES = 'mb-1 block text-label-caps text-on-surface-variant';

type PaperInputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string };

/** Input "paper": fondo tenue, solo borde inferior en madera, focus en primary. */
export const PaperInput = forwardRef<HTMLInputElement, PaperInputProps>(function PaperInput(
  { label, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className={LABEL_CLASSES}>
          {label}
        </label>
      )}
      <input id={fieldId} ref={ref} className={cn(FIELD_CLASSES, className)} {...props} />
    </div>
  );
});

type PaperTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

export const PaperTextarea = forwardRef<HTMLTextAreaElement, PaperTextareaProps>(
  function PaperTextarea({ label, id, className, ...props }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <div>
        {label && (
          <label htmlFor={fieldId} className={LABEL_CLASSES}>
            {label}
          </label>
        )}
        <textarea
          id={fieldId}
          ref={ref}
          className={cn(FIELD_CLASSES, 'resize-none', className)}
          {...props}
        />
      </div>
    );
  },
);
