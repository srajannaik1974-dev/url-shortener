/**
 * Button.jsx — Design System v2
 *
 * A handcrafted button component following Linear/Vercel design principles.
 * Restraint over decoration: subtle borders, precise sizing, no gimmicks.
 *
 * Props:
 *  variant   : 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link'
 *  size      : 'xs' | 'sm' | 'md' | 'lg'
 *  isLoading : boolean
 *  leftIcon  : ReactNode
 *  rightIcon : ReactNode
 *  as        : element type (polymorphic, default 'button')
 *  iconOnly  : boolean — square, icon-only variant
 *  className : string
 */

import { forwardRef } from 'react';

// ── Variant styles ────────────────────────────────────────────────────────────
const variants = {
  primary: [
    'bg-[var(--color-accent)] text-white',
    'hover:bg-[var(--color-accent-hover)]',
    'active:bg-[var(--color-accent-active)]',
    'shadow-[var(--shadow-xs)]',
  ].join(' '),

  secondary: [
    'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]',
    'border border-[var(--color-border)]',
    'hover:bg-[var(--color-bg-ui)]',
    'active:bg-[var(--color-bg-ui-hover)]',
  ].join(' '),

  ghost: [
    'bg-transparent text-[var(--color-text-secondary)]',
    'hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]',
    'active:bg-[var(--color-bg-ui)]',
  ].join(' '),

  danger: [
    'bg-[var(--color-danger)] text-white',
    'hover:bg-[var(--color-danger-hover)]',
    'shadow-[var(--shadow-xs)]',
  ].join(' '),

  outline: [
    'bg-transparent text-[var(--color-text-primary)]',
    'border border-[var(--color-border-input)]',
    'hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)]',
  ].join(' '),

  link: [
    'bg-transparent text-[var(--color-accent)]',
    'hover:underline underline-offset-4',
    'p-0 h-auto',
  ].join(' '),
};

// ── Size styles ───────────────────────────────────────────────────────────────
const sizes = {
  xs: 'h-7  px-2.5 text-[11px] font-medium gap-1   rounded-[var(--radius-sm)]',
  sm: 'h-8  px-3   text-[13px] font-medium gap-1.5 rounded-[var(--radius-md)]',
  md: 'h-9  px-3.5 text-[13px] font-medium gap-1.5 rounded-[var(--radius-md)]',
  lg: 'h-10 px-4   text-[15px] font-medium gap-2   rounded-[var(--radius-md)]',
};

// Icon-only square sizes
const iconSizes = {
  xs: 'h-7  w-7  rounded-[var(--radius-sm)]',
  sm: 'h-8  w-8  rounded-[var(--radius-md)]',
  md: 'h-9  w-9  rounded-[var(--radius-md)]',
  lg: 'h-10 w-10 rounded-[var(--radius-md)]',
};

// ── Spinner ───────────────────────────────────────────────────────────────────
function ButtonSpinner() {
  return (
    <svg
      className="animate-spin h-3 w-3 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    iconOnly = false,
    leftIcon,
    rightIcon,
    as: Tag = 'button',
    className = '',
    disabled,
    children,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  const base = [
    'inline-flex items-center justify-center',
    'font-[var(--font-sans)]',
    'transition-all select-none',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1',
    'disabled:opacity-40 disabled:pointer-events-none',
    'whitespace-nowrap',
  ].join(' ');

  const sizeClass = iconOnly
    ? (iconSizes[size] ?? iconSizes.md)
    : (sizes[size] ?? sizes.md);

  const variantClass = variants[variant] ?? variants.secondary;

  return (
    <Tag
      ref={ref}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled || undefined}
      className={[base, sizeClass, variantClass, className].join(' ')}
      style={{ transitionDuration: '120ms' }}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner />
      ) : (
        leftIcon && <span className="shrink-0 leading-none">{leftIcon}</span>
      )}

      {/* In icon-only mode don't render children visually */}
      {!iconOnly && children}

      {/* Screen reader label for icon-only buttons is set via aria-label */}
      {iconOnly && children && (
        <span className="sr-only">{children}</span>
      )}

      {!isLoading && rightIcon && (
        <span className="shrink-0 leading-none">{rightIcon}</span>
      )}
    </Tag>
  );
});

export default Button;
