/**
 * StatCard.jsx — Design System v2
 *
 * Metric display card for the Dashboard overview.
 * Minimal — number + label + optional trend indicator.
 *
 * Props:
 *  title     : string — metric name
 *  value     : string | number — the primary metric
 *  change    : number | null — e.g. 12.5 (positive = up, negative = down)
 *  changeLabel: string — e.g. "vs last week"
 *  icon      : Lucide icon component
 *  loading   : boolean
 *  className : string
 */

import Skeleton from './Skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  loading = false,
  className = '',
}) {
  const isPositive = change > 0;
  const isNeutral  = change === null || change === undefined;

  return (
    <div
      className={[
        'rounded-[var(--radius-lg)] border border-[var(--color-border)]',
        'bg-[var(--color-bg-page)] p-5',
        'flex flex-col gap-3',
        className,
      ].join(' ')}
    >
      {/* Header: title + icon */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[var(--color-text-secondary)]">
          {loading ? <Skeleton width={80} height={12} /> : title}
        </p>
        {Icon && !loading && (
          <span
            className="flex items-center justify-center w-8 h-8
                       rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)]
                       text-[var(--color-text-tertiary)]"
            aria-hidden="true"
          >
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>

      {/* Primary value */}
      {loading ? (
        <Skeleton width={100} height={28} />
      ) : (
        <p
          className="text-[28px] font-semibold text-[var(--color-text-primary)] leading-none tracking-tight"
          aria-label={`${title}: ${value}`}
        >
          {value ?? '—'}
        </p>
      )}

      {/* Trend */}
      {!loading && !isNeutral && (
        <div className="flex items-center gap-1.5">
          <span
            className={[
              'inline-flex items-center gap-0.5',
              'text-[12px] font-medium',
              isPositive
                ? 'text-[var(--color-success-text)]'
                : 'text-[var(--color-danger-text)]',
            ].join(' ')}
          >
            {isPositive
              ? <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              : <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-[12px] text-[var(--color-text-tertiary)]">
            {changeLabel}
          </span>
        </div>
      )}
    </div>
  );
}
