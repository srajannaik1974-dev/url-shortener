/**
 * EmptyState.jsx — Design System v2
 *
 * Used when a list or section has no content.
 * Clean, minimal — no illustration blobs or emojis.
 *
 * Props:
 *  icon       : Lucide icon component
 *  title      : string
 *  description: string
 *  action     : ReactNode (optional button/link)
 *  size       : 'sm' | 'md' | 'lg'
 *  className  : string
 */

const sizes = {
  sm: { wrap: 'py-8',  icon: 'w-8 h-8',  title: 'text-[14px]', desc: 'text-[13px]' },
  md: { wrap: 'py-12', icon: 'w-10 h-10', title: 'text-[15px]', desc: 'text-[13px]' },
  lg: { wrap: 'py-16', icon: 'w-12 h-12', title: 'text-[18px]', desc: 'text-[15px]' },
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = 'md',
  className = '',
}) {
  const sz = sizes[size] ?? sizes.md;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${sz.wrap} ${className}`}
      role="status"
      aria-label={title}
    >
      {Icon && (
        <div
          className="flex items-center justify-center mb-4
                     w-14 h-14 rounded-[var(--radius-lg)]
                     bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
          aria-hidden="true"
        >
          <Icon className={`${sz.icon} text-[var(--color-text-tertiary)] stroke-[1.5]`} />
        </div>
      )}

      {title && (
        <p className={`font-semibold text-[var(--color-text-primary)] ${sz.title} mb-1`}>
          {title}
        </p>
      )}

      {description && (
        <p
          className={`text-[var(--color-text-secondary)] ${sz.desc} max-w-xs leading-relaxed`}
        >
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}
