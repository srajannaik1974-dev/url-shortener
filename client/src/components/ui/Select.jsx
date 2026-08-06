/**
 * Select.jsx — Design System v2
 *
 * Native <select> styled to match Input.
 * react-hook-form compatible via forwardRef.
 *
 * Props:
 *  id        : string
 *  label     : string
 *  error     : string
 *  helperText: string
 *  size      : 'sm' | 'md' | 'lg'
 *  className : string
 *  options   : Array<{ value: string, label: string }> (optional — can use children instead)
 *  children  : ReactNode (<option> elements)
 *  required  : boolean
 */

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const selectSizes = {
  sm: 'h-8  text-[13px] rounded-[var(--radius-md)] pl-3 pr-8',
  md: 'h-9  text-[13px] rounded-[var(--radius-md)] pl-3 pr-8',
  lg: 'h-10 text-[15px] rounded-[var(--radius-md)] pl-3 pr-8',
};

const Select = forwardRef(function Select(
  { id, label, error, helperText, size = 'md', options, className = '', required, children, ...rest },
  ref
) {
  const hasError = Boolean(error);

  const selectBase = [
    'w-full appearance-none',
    'bg-[var(--color-bg-page)]',
    'text-[var(--color-text-primary)]',
    'border',
    'transition-all focus:outline-none',
    'focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'cursor-pointer',
    selectSizes[size] ?? selectSizes.md,
    hasError
      ? 'border-[var(--color-danger)]'
      : 'border-[var(--color-border-input)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-accent)]',
  ].join(' ');

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

      <div className="relative">
        <select
          ref={ref}
          id={id}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={helperText || error ? `${id}-hint` : undefined}
          className={selectBase}
          style={{ transitionDuration: '120ms' }}
          {...rest}
        >
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))
            : children}
        </select>

        <ChevronDown
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                     text-[var(--color-text-tertiary)] pointer-events-none"
          aria-hidden="true"
        />
      </div>

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

export default Select;
