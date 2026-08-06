/**
 * Badge.jsx — Design System v2
 *
 * Inline status chips. Used for URL status, plan tier, etc.
 * Deliberately small and understated — not colorful pills.
 *
 * Props:
 *  variant : 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent'
 *  size    : 'sm' | 'md'
 *  dot     : boolean — show leading dot indicator
 *  className: string
 */

const variants = {
  default: 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
  success: 'bg-[var(--color-success-subtle)] text-[var(--color-success-text)] border-[var(--color-success-border)]',
  warning: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning-text)] border-[var(--color-warning-border)]',
  danger:  'bg-[var(--color-danger-subtle)]  text-[var(--color-danger-text)]  border-[var(--color-danger-border)]',
  info:    'bg-[var(--color-info-subtle)]    text-[var(--color-info-text)]    border-[var(--color-info-border)]',
  accent:  'bg-[var(--color-accent-subtle)]  text-[var(--color-accent-text)]  border-[var(--color-accent-subtle-border)]',
};

const dotColors = {
  default: 'bg-[var(--color-text-tertiary)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger:  'bg-[var(--color-danger)]',
  info:    'bg-[var(--color-info)]',
  accent:  'bg-[var(--color-accent)]',
};

const sizes = {
  sm: 'text-[11px] px-1.5 py-0.5 gap-1 leading-[16px]',
  md: 'text-[12px] px-2   py-1   gap-1 leading-[16px]',
};

export default function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
  children,
}) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium',
        'border rounded-[var(--radius-sm)]',
        'select-none whitespace-nowrap',
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.sm,
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] ?? dotColors.default}`}
        />
      )}
      {children}
    </span>
  );
}
