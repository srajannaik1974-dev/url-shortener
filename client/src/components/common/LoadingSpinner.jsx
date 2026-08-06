/**
 * LoadingSpinner.jsx — Design System v2
 *
 * Pure CSS spinner. Uses currentColor — inherits from parent.
 *
 * Props:
 *  size     : 'xs' | 'sm' | 'md' | 'lg'
 *  label    : string — accessible label (default 'Loading…')
 *  className: string
 */

const sizes = {
  xs: 'w-3   h-3   border',
  sm: 'w-4   h-4   border-2',
  md: 'w-6   h-6   border-2',
  lg: 'w-8   h-8   border-[3px]',
};

export default function LoadingSpinner({
  size = 'md',
  label = 'Loading…',
  className = '',
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={[
        'inline-block rounded-full animate-spin',
        'border-current border-t-transparent opacity-70',
        sizes[size] ?? sizes.md,
        className,
      ].join(' ')}
    />
  );
}
