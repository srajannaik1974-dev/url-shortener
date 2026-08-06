/**
 * Separator.jsx — Design System v2
 *
 * A semantic <hr> that respects the design system's border color.
 *
 * Props:
 *  orientation : 'horizontal' | 'vertical'
 *  className   : string
 *  label       : string (optional centered text label)
 */

export default function Separator({ orientation = 'horizontal', label, className = '' }) {
  if (orientation === 'vertical') {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={`block w-px self-stretch bg-[var(--color-border)] ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="flex-1 h-px bg-[var(--color-border)]" aria-hidden="true" />
        <span className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider select-none">
          {label}
        </span>
        <span className="flex-1 h-px bg-[var(--color-border)]" aria-hidden="true" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={`h-px border-none bg-[var(--color-border)] ${className}`}
    />
  );
}
