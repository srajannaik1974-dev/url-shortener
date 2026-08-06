/**
 * Textarea.jsx — Design System v2
 *
 * Multi-line text area. Matches Input visually.
 * react-hook-form compatible via forwardRef.
 *
 * Props:
 *  id        : string
 *  label     : string
 *  error     : string
 *  helperText: string
 *  rows      : number (default 4)
 *  required  : boolean
 *  className : string
 */

import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { id, label, error, helperText, rows = 4, required, className = '', ...rest },
  ref
) {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-[var(--color-text-primary)] leading-none select-none"
        >
          {label}
          {required && <span className="ml-0.5 text-[var(--color-danger)]" aria-hidden="true">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        required={required}
        aria-invalid={hasError || undefined}
        aria-describedby={helperText || error ? `${id}-hint` : undefined}
        className={[
          'w-full px-3 py-2.5',
          'text-[13px] leading-[20px]',
          'bg-[var(--color-bg-page)] text-[var(--color-text-primary)]',
          'placeholder:text-[var(--color-text-placeholder)]',
          'border rounded-[var(--radius-md)]',
          'resize-y min-h-[80px]',
          'transition-all focus:outline-none',
          'focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError
            ? 'border-[var(--color-danger)]'
            : 'border-[var(--color-border-input)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-accent)]',
        ].join(' ')}
        style={{ transitionDuration: '120ms' }}
        {...rest}
      />

      {(helperText || error) && (
        <p
          id={`${id}-hint`}
          role={hasError ? 'alert' : undefined}
          className={`text-[12px] leading-[16px] ${hasError ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-tertiary)]'}`}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
});

export default Textarea;
