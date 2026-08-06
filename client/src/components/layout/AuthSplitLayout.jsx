/**
 * AuthSplitLayout.jsx
 *
 * Premium split layout for Authentication pages (Login, Register).
 * Left side: Form content
 * Right side: Graphic/Pattern
 */

import { Zap } from 'lucide-react';

export default function AuthSplitLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-[calc(100dvh-56px)] bg-[var(--color-bg-app)]">
      {/* ── Left side (Form) ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[540px]">
        <div className="mx-auto w-full max-w-[360px]">
          {/* Header */}
          <div className="mb-8">
            <div
              className="flex items-center justify-center w-10 h-10 mb-6
                         rounded-[var(--radius-lg)] bg-[var(--color-accent)] text-white shadow-[var(--shadow-sm)]"
              aria-hidden="true"
            >
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-[24px] font-semibold text-[var(--color-text-primary)] tracking-tight mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[14px] text-[var(--color-text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* ── Right side (Graphic/Pattern) ────────────────────────────────── */}
      <div className="hidden lg:flex relative flex-1 bg-[var(--color-bg-page)] border-l border-[var(--color-border)] overflow-hidden items-center justify-center">
        {/* Subtle grid pattern background */}
        <svg
          className="absolute inset-0 h-full w-full stroke-[var(--color-border-strong)] opacity-[0.15] dark:opacity-[0.07]"
          aria-hidden="true"
        >
          <defs>
            <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V0h32" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>

        {/* Decorative graphic / Testimonial box */}
        <div className="relative z-10 max-w-md p-8 rounded-[var(--radius-xl)] bg-[var(--color-bg-page)]/80 backdrop-blur-md border border-[var(--color-border)] shadow-[var(--shadow-xl)]">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-[var(--color-danger)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-warning)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
          </div>
          <p className="text-[15px] font-medium text-[var(--color-text-primary)] leading-relaxed italic mb-4">
            "Snip.ly has completely transformed how we share links with our customers. The analytics are incredibly insightful."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-ui)] flex items-center justify-center text-[12px] font-semibold text-[var(--color-text-secondary)]">
              S
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">Sarah Jenkins</p>
              <p className="text-[12px] text-[var(--color-text-tertiary)]">Product Manager, TechCorp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
