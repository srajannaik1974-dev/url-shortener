/**
 * PageTitle.jsx — Design System v2
 *
 * Page-level heading component.
 * Handles document.title via useDocumentTitle hook.
 *
 * Props:
 *  title      : string — page title
 *  description: string — optional subtext
 *  actions    : ReactNode — slot for CTA buttons (top-right)
 *  className  : string
 */

import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export default function PageTitle({ title, description, actions, className = '' }) {
  useDocumentTitle(title);

  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div className="min-w-0">
        <h1 className="text-[20px] font-semibold text-[var(--color-text-primary)] leading-[28px] tracking-[-0.015em] truncate">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)] leading-[20px]">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
