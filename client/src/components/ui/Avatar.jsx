/**
 * Avatar.jsx — Design System v2
 *
 * Renders an image or initials-based fallback.
 * Used in Topbar, URL list author column, comment threads.
 *
 * Props:
 *  src       : string (image URL)
 *  name      : string (generates initials when no image)
 *  size      : 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *  className : string
 */

const sizes = {
  xs: { outer: 'w-5 h-5',  text: 'text-[9px]'  },
  sm: { outer: 'w-7 h-7',  text: 'text-[11px]' },
  md: { outer: 'w-8 h-8',  text: 'text-[12px]' },
  lg: { outer: 'w-10 h-10', text: 'text-[14px]' },
  xl: { outer: 'w-12 h-12', text: 'text-[16px]' },
};

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sz = sizes[size] ?? sizes.md;
  const initials = getInitials(name);

  return (
    <span
      className={[
        'inline-flex items-center justify-center',
        'rounded-full overflow-hidden select-none shrink-0',
        'bg-[var(--color-bg-ui)] text-[var(--color-text-secondary)]',
        sz.outer,
        className,
      ].join(' ')}
      aria-label={name || 'User avatar'}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <span className={`font-semibold leading-none ${sz.text}`}>
          {initials || '?'}
        </span>
      )}
    </span>
  );
}
