/**
 * Pagination.jsx — Design System v2
 *
 * Clean number pagination: < 1 2 3 … 10 >
 * No over-engineering — shows at most 7 page buttons.
 *
 * Props:
 *  page       : number — current page (1-indexed)
 *  totalPages : number
 *  onChange   : (page: number) => void
 *  className  : string
 */

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];

  return [1, '…', current - 1, current, current + 1, '…', total];
}

const btnBase = [
  'inline-flex items-center justify-center',
  'h-8 min-w-[32px] px-1',
  'text-[13px] font-medium',
  'rounded-[var(--radius-md)]',
  'transition-colors select-none',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
].join(' ');

export default function Pagination({ page = 1, totalPages = 1, onChange, className = '' }) {
  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center gap-1 ${className}`}
    >
      {/* Previous */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${btnBase} text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:pointer-events-none`}
        style={{ transitionDuration: '100ms' }}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex items-center justify-center h-8 w-8 text-[13px] text-[var(--color-text-tertiary)]"
            aria-hidden="true"
          >
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={[
              btnBase,
              'w-8',
              p === page
                ? 'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]',
            ].join(' ')}
            style={{ transitionDuration: '100ms' }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={`${btnBase} text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:pointer-events-none`}
        style={{ transitionDuration: '100ms' }}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
