/**
 * Sidebar.jsx — Design System v2
 *
 * Dashboard navigation sidebar.
 * Design: Linear-inspired — compact 220px, 32px items, 2px accent left-border active state.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Link2, BarChart2, User, Settings,
  LogOut, Zap, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Snip.ly';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', to: '/dashboard',          icon: LayoutDashboard, end: true, id: 'sidebar-dashboard' },
      { label: 'My URLs',   to: '/dashboard/urls',      icon: Link2,           id: 'sidebar-urls'      },
      { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart2,       id: 'sidebar-analytics' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile',  to: '/dashboard/profile',  icon: User,     id: 'sidebar-profile'  },
      { label: 'Settings', to: '/dashboard/settings', icon: Settings, id: 'sidebar-settings' },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[var(--z-overlay)] bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard sidebar"
        className={[
          'fixed top-0 left-0 z-[calc(var(--z-overlay)+1)] h-dvh',
          'flex flex-col',
          'w-[var(--sidebar-width)]',
          'bg-[var(--color-bg-page)]',
          'border-r border-[var(--color-border)]',
          'transition-transform',
          // Desktop always visible; mobile slides
          'md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        style={{ transitionDuration: '220ms', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* ── Brand header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 h-14 shrink-0 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-1.5">
            <span
              className="flex items-center justify-center w-5 h-5 rounded bg-[var(--color-accent)] text-white"
              aria-hidden="true"
            >
              <Zap className="w-3 h-3" />
            </span>
            <span className="text-[14px] font-semibold text-[var(--color-text-primary)] tracking-tight">
              {APP_NAME}
            </span>
          </div>
          <button
            id="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
            className="md:hidden flex items-center justify-center w-6 h-6
                       rounded text-[var(--color-text-tertiary)]
                       hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]
                       transition-colors"
            style={{ transitionDuration: '100ms' }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-3" aria-label="Sidebar navigation">
          {NAV_SECTIONS.map(({ label, items }) => (
            <div key={label} className="mb-4">
              {/* Section label */}
              <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest
                            text-[var(--color-text-tertiary)] select-none">
                {label}
              </p>

              <div className="space-y-px px-2">
                {items.map(({ label: itemLabel, to, icon: Icon, end, id }) => (
                  <NavLink
                    key={to}
                    to={to}
                    id={id}
                    end={end}
                    onClick={onClose}
                    className={({ isActive }) => [
                      'flex items-center gap-2.5 px-2 py-[7px]',
                      'text-[13px] font-medium leading-none',
                      'rounded-[var(--radius-md)]',
                      'transition-colors relative',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
                      isActive
                        ? [
                            'text-[var(--color-text-primary)]',
                            'bg-[var(--color-bg-subtle)]',
                            // 2px left accent border via pseudo-element alternative
                          ].join(' ')
                        : [
                            'text-[var(--color-text-secondary)]',
                            'hover:text-[var(--color-text-primary)]',
                            'hover:bg-[var(--color-bg-subtle)]',
                          ].join(' '),
                    ].join(' ')}
                    style={{ transitionDuration: '100ms' }}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator bar */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2
                                       w-0.5 h-4 rounded-r bg-[var(--color-accent)]"
                            aria-hidden="true"
                          />
                        )}
                        <Icon
                          className={`w-4 h-4 shrink-0 stroke-[1.5] ${
                            isActive
                              ? 'text-[var(--color-accent)]'
                              : 'text-[var(--color-text-tertiary)]'
                          }`}
                          aria-hidden="true"
                        />
                        {itemLabel}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── User + Logout ─────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-[var(--color-border)] p-3">
          {/* User info */}
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1 rounded-[var(--radius-md)]">
            <span
              className="flex items-center justify-center w-6 h-6 shrink-0
                         rounded-full bg-[var(--color-bg-ui)]
                         text-[var(--color-text-secondary)] text-[10px] font-semibold"
              aria-hidden="true"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-[var(--color-text-tertiary)] truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            id="sidebar-logout"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-2 py-[7px]
                       text-[13px] font-medium text-[var(--color-text-secondary)]
                       rounded-[var(--radius-md)]
                       hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]
                       transition-colors focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            style={{ transitionDuration: '100ms' }}
          >
            <LogOut className="w-4 h-4 shrink-0 stroke-[1.5]" aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
