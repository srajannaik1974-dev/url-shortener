/**
 * Alert.jsx — Design System v2
 *
 * Notification banner component for in-page messages (errors, warnings, info).
 * Inspired by Linear & Vercel design system.
 */

import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const alertVariants = {
  danger: {
    container: 'bg-[var(--color-danger-subtle)] border-[var(--color-danger-border)] text-[var(--color-danger-text)]',
    icon: AlertCircle,
  },
  warning: {
    container: 'bg-[var(--color-warning-subtle)] border-[var(--color-warning-border)] text-[var(--color-warning-text)]',
    icon: AlertTriangle,
  },
  success: {
    container: 'bg-[var(--color-success-subtle)] border-[var(--color-success-border)] text-[var(--color-success-text)]',
    icon: CheckCircle2,
  },
  info: {
    container: 'bg-[var(--color-info-subtle)] border-[var(--color-info-border)] text-[var(--color-info-text)]',
    icon: Info,
  },
};

export default function Alert({
  variant = 'danger',
  title,
  children,
  onClose,
  className = '',
}) {
  const config = alertVariants[variant] || alertVariants.danger;
  const IconComponent = config.icon;

  return (
    <div
      role="alert"
      className={[
        'flex items-start gap-3 p-3.5 rounded-[var(--radius-lg)] border text-[13px] leading-relaxed transition-all duration-150',
        config.container,
        className,
      ].join(' ')}
    >
      <IconComponent className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <h5 className="font-semibold mb-0.5 tracking-tight">{title}</h5>}
        <div className="opacity-95">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-0.5 rounded opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
