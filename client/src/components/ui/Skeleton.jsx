/**
 * Skeleton.jsx — Design System v2
 *
 * Loading skeleton with shimmer animation.
 * Composable via sub-components for common patterns.
 *
 * Usage:
 *   <Skeleton width="100%" height={16} />
 *   <Skeleton.Text lines={3} />
 *   <Skeleton.Avatar size="md" />
 *   <Skeleton.Card />
 *
 * Props (base):
 *  width  : string | number
 *  height : string | number
 *  rounded: 'sm' | 'md' | 'lg' | 'full' (default 'md')
 *  className: string
 */

const radii = {
  sm:   'rounded-[var(--radius-sm)]',
  md:   'rounded-[var(--radius-md)]',
  lg:   'rounded-[var(--radius-lg)]',
  full: 'rounded-full',
};

function SkeletonBase({ width, height, rounded = 'md', className = '', style = {} }) {
  return (
    <span
      aria-hidden="true"
      className={`block skeleton-shimmer ${radii[rounded] ?? radii.md} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    />
  );
}

// ── Skeleton.Text — multi-line paragraph placeholder ─────────────────────────
function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          height={14}
          width={i === lines - 1 ? '65%' : '100%'}
          rounded="md"
        />
      ))}
    </div>
  );
}

// ── Skeleton.Avatar — circle placeholder ──────────────────────────────────────
const avatarSizes = { xs: 24, sm: 32, md: 40, lg: 48 };

function SkeletonAvatar({ size = 'md', className = '' }) {
  const s = avatarSizes[size] ?? avatarSizes.md;
  return <SkeletonBase width={s} height={s} rounded="full" className={`shrink-0 ${className}`} />;
}

// ── Skeleton.Card — full card with title + lines ──────────────────────────────
function SkeletonCard({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-page)] p-4 ${className}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <SkeletonAvatar size="sm" />
        <div className="flex flex-col gap-1.5 flex-1">
          <SkeletonBase height={13} width="45%" />
          <SkeletonBase height={11} width="30%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

// ── Skeleton.Row — table row placeholder ─────────────────────────────────────
function SkeletonRow({ cols = 4, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-4 px-4 py-3 border-b border-[var(--color-border)] ${className}`}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBase
          key={i}
          height={13}
          width={i === 0 ? '30%' : '15%'}
          className="flex-shrink-0"
        />
      ))}
    </div>
  );
}

// ── Attach sub-components ─────────────────────────────────────────────────────
SkeletonBase.Text   = SkeletonText;
SkeletonBase.Avatar = SkeletonAvatar;
SkeletonBase.Card   = SkeletonCard;
SkeletonBase.Row    = SkeletonRow;

export default SkeletonBase;
