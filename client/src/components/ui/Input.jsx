/**
 * Input.jsx — Design System v2
 *
 * Designed for react-hook-form via forwardRef.
 * Consistent with system tokens — no hardcoded colors.
 *
 * Props:
 *  id          : string (required for label association)
 *  label       : string
 *  helperText  : string — shown below the field (grey, small)
 *  error       : string — replaces helperText when present
 *  size        : 'sm' | 'md' | 'lg'
 *  leftIcon    : ReactNode
 *  rightElement: ReactNode — interactive element (password toggle, clear)
 *  className   : string — applied to the wrapper div
 *  required    : boolean — shows asterisk in label
 */

import { forwardRef } from 'react';

const inputSizes = {
  sm: {
    input: 'h-8  text-[13px] rounded-[var(--radius-md)]',
    icon:  'w-3.5 h-3.5',
    lPad:  'pl-8',
    rPad:  'pr-8',
  },
  md: {
    input: 'h-9  text-[13px] rounded-[var(--radius-md)]',
    icon:  'w-4 h-4',
    lPad:  'pl-9',
    rPad:  'pr-9',
  },
  lg: {
    input: 'h-10 text-[15px] rounded-[var(--radius-md)]',
    icon:  'w-4 h-4',
    lPad:  'pl-10',
    rPad:  'pr-10',
  },
};

const Input = forwardRef(function Input(
  {
    id,
    label,
    helperText,
    error,
    size = 'md',
    leftIcon,
    rightElement,
    className = '',
    required,
    ...rest
  },
  ref
) {
  const sz = inputSizes[size] ?? inputSizes.md;
  const hasError = Boolean(error);

  const inputBase = [
    'w-full px-3',
    'bg-[var(--color-bg-page)]',
    'text-[var(--color-text-primary)]',
    'placeholder:text-[var(--color-text-placeholder)]',
    'border',
    'transition-all',
    'focus:outline-none',
    'focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sz.input,
    hasError
      ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)] focus:ring-opacity-40'
      : 'border-[var(--color-border-input)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-accent)]',
    leftIcon    ? sz.lPad : '',
    rightElement ? sz.rPad : '',
  ].join(' ');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>

      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-[var(--color-text-primary)] leading-none select-none"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-[var(--color-danger)]" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative flex items-center">
        {leftIcon && (
          <span
            className={`absolute left-2.5 flex items-center justify-center ${sz.icon} text-[var(--color-text-tertiary)] pointer-events-none`}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          aria-describedby={helperText || error ? `${id}-hint` : undefined}
          aria-invalid={hasError || undefined}
          required={required}
          className={inputBase}
          style={{ transitionDuration: '120ms' }}
          {...rest}
        />

        {rightElement && (
          <span className="absolute right-2.5 flex items-center justify-center">
            {rightElement}
          </span>
        )}
      </div>

      {/* Helper / Error text */}
      {(helperText || error) && (
        <p
          id={`${id}-hint`}
          role={hasError ? 'alert' : undefined}
          className={`text-[12px] leading-[16px] ${
            hasError
              ? 'text-[var(--color-danger)]'
              : 'text-[var(--color-text-tertiary)]'
          }`}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
