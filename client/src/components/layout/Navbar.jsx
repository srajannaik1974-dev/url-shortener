/**
 * Navbar.jsx — Design System v2
 *
 * Public-facing navigation bar.
 * Design: Vercel/Linear-inspired — minimal, 56px height, border-only bottom.
 */

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Moon, Sun, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Snip.ly';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing',  href: '/#pricing'  },
  { label: 'Docs',     href: '/#docs'     },
];

export default function Navbar() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      id="main-navbar"
      className={[
        'sticky top-0 z-[var(--z-sticky)] w-full',
        'h-14 flex items-center',
        'border-b border-[var(--color-border)]',
        'bg-[var(--color-bg-page)]/95 backdrop-blur-sm',
      ].join(' ')}
    >
      <div className="w-full max-w-[var(--content-max-w)] mx-auto px-4 sm:px-6
                      flex items-center justify-between gap-4">

        {/* ── Brand ──────────────────────────────────────────────────────── */}
        <Link
          to="/"
          className="flex items-center gap-1.5 shrink-0 focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
        >
          <span
            className="flex items-center justify-center w-6 h-6
                       rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white"
            aria-hidden="true"
          >
            <Zap className="w-3.5 h-3.5" />
          </span>
          <span className="text-[15px] font-semibold text-[var(--color-text-primary)] tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        {/* ── Desktop nav ────────────────────────────────────────────────── */}
        <nav
          className="hidden md:flex items-center gap-0.5"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 text-[13px] font-medium
                         text-[var(--color-text-secondary)]
                         hover:text-[var(--color-text-primary)]
                         rounded-[var(--radius-md)] hover:bg-[var(--color-bg-subtle)]
                         transition-colors focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              style={{ transitionDuration: '100ms' }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            id="navbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-8 h-8
                       rounded-[var(--radius-md)] text-[var(--color-text-tertiary)]
                       hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]
                       transition-colors focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            style={{ transitionDuration: '100ms' }}
          >
            {isDark
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />}
          </button>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-1.5 ml-1">
            {user ? (
              <NavLink to="/dashboard">
                <Button variant="primary" size="sm">Dashboard</Button>
              </NavLink>
            ) : (
              <>
                <NavLink to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </NavLink>
                <NavLink to="/register">
                  <Button variant="primary" size="sm">Get started</Button>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="navbar-menu-toggle"
            className="md:hidden flex items-center justify-center w-8 h-8
                       rounded-[var(--radius-md)] text-[var(--color-text-tertiary)]
                       hover:bg-[var(--color-bg-subtle)] transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            style={{ transitionDuration: '100ms' }}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="absolute top-14 left-0 right-0 z-[var(--z-dropdown)]
                     border-b border-[var(--color-border)] bg-[var(--color-bg-page)]
                     p-3 flex flex-col gap-0.5"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 text-[13px] font-medium text-[var(--color-text-secondary)]
                         hover:text-[var(--color-text-primary)] rounded-[var(--radius-md)]
                         hover:bg-[var(--color-bg-subtle)] transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-1.5 pt-2 mt-1 border-t border-[var(--color-border)]">
            {user ? (
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">Dashboard</Button>
              </NavLink>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Log in</Button>
                </NavLink>
                <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Get started</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
