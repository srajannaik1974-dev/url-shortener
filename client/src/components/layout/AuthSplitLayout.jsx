import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

/**
 * AuthSplitLayout.jsx
 *
 * Authentic single-column layout for Authentication (Login / Register).
 * Handcrafted aesthetic inspired by GitHub, Notion, and Arc Browser.
 */
export default function AuthSplitLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-app)] text-[var(--color-text-primary)] font-[var(--font-sans)] flex flex-col justify-between items-center px-4 py-8 sm:py-14 select-none">
      {/* Brand Header */}
      <header className="flex flex-col items-center gap-3 pt-2 sm:pt-4">
        <Link to="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded p-1">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-accent)] text-white shadow-sm">
            <Zap className="w-4 h-4 fill-current" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
            Snip<span className="text-[var(--color-text-secondary)] font-normal">.ly</span>
          </span>
        </Link>
      </header>

      {/* Main Auth Card Box */}
      <main className="w-full max-w-[380px] my-auto">
        <div className="bg-[var(--color-bg-page)] border border-[var(--color-border)] rounded-xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="space-y-1 text-left">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[380px] text-center text-[11px] text-[var(--color-text-tertiary)] py-4 space-y-2">
        <div className="flex items-center justify-center gap-4">
          <a href="/#terms" className="hover:text-[var(--color-text-secondary)] transition-colors">Terms of Service</a>
          <span className="text-[var(--color-border)]">•</span>
          <a href="/#privacy" className="hover:text-[var(--color-text-secondary)] transition-colors">Privacy Policy</a>
        </div>
        <p className="opacity-70">&copy; {new Date().getFullYear()} Snip.ly — URL Shortener Platform</p>
      </footer>
    </div>
  );
}
