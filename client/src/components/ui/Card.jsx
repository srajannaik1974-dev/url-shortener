/**
 * Card.jsx — Design System v2
 *
 * Philosophy: Borders communicate containment; shadows are optional.
 * Cards are simple, flat surfaces — not decorative boxes.
 *
 * Props:
 *  padding   : 'none' | 'sm' | 'md' | 'lg' | 'xl'
 *  hoverable : boolean — adds subtle hover lift
 *  bordered  : boolean (default true) — show border
 *  as        : element type (polymorphic)
 *  className : string
 */

const padding = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
  xl:   'p-8',
};

export default function Card({
  padding: p = 'md',
  hoverable = false,
  bordered = true,
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={[
        'rounded-[var(--radius-lg)] bg-[var(--color-bg-page)]',
        bordered ? 'border border-[var(--color-border)]' : '',
        hoverable
          ? 'cursor-pointer transition-all duration-150 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]'
          : '',
        padding[p] ?? padding.md,
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
