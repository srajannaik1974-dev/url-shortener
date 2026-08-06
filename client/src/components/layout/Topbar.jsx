/**
 * Topbar.jsx — Design System v2
 *
 * Dashboard top bar.
 * Keeps: theme toggle + user dropdown.
 * Page title is handled by PageTitle in each page.
 */

import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import Avatar from '../ui/Avatar';
import Separator from '../ui/Separator';

const ROUTE_TITLES = {
  '/dashboard':           'Dashboard',
  '/dashboard/urls':      'My URLs',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/profile':   'Profile',
  '/dashboard/settings':  'Settings',
};

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setOpen(false));

  const pageTitle = ROUTE_TITLES[location.pathname] ?? '';

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header
      id="dashboard-topbar"
      className={[
        'flex items-center gap-3 shrink-0',
        'h-[var(--topbar-height)] px-4',
        'border-b border-[var(--color-border)]',
        'bg-[var(--color-bg-page)]',
      ].join(' ')}
    >
      {/* Mobile sidebar toggle */}
      <button
        id="topbar-menu-toggle"
        onClick={onMenuClick}
        aria-label="Open sidebar"
        className="md:hidden flex items-center justify-center w-8 h-8
                   rounded-[var(--radius-md)] text-[var(--color-text-tertiary)]
                   hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]
                   transition-colors focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        style={{ transitionDuration: '100ms' }}
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Page title — visible on desktop */}
      {pageTitle && (
        <span className="hidden md:block text-[14px] font-medium text-[var(--color-text-secondary)] truncate">
          {pageTitle}
        </span>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        id="topbar-theme-toggle"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="flex items-center justify-center w-8 h-8
                   rounded-[var(--radius-md)] text-[var(--color-text-tertiary)]
                   hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]
                   transition-colors focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        style={{ transitionDuration: '100ms' }}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* User dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          id="topbar-user-menu"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={open}
          className="flex items-center gap-1.5 h-8 pl-1 pr-2
                     rounded-[var(--radius-md)] hover:bg-[var(--color-bg-subtle)]
                     transition-colors focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{ transitionDuration: '100ms' }}
        >
          <Avatar name={user?.name} size="sm" />
          <span className="hidden sm:block text-[13px] font-medium
                           text-[var(--color-text-primary)] max-w-[120px] truncate">
            {user?.name || 'User'}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-[var(--color-text-tertiary)] transition-transform ${open ? 'rotate-180' : ''}`}
            style={{ transitionDuration: '150ms' }}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-1.5 w-52
                       rounded-[var(--radius-lg)] border border-[var(--color-border)]
                       bg-[var(--color-bg-page)] shadow-[var(--shadow-lg)]
                       z-[var(--z-dropdown)] overflow-hidden"
          >
            {/* User info header */}
            <div className="px-3 py-2.5">
              <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">
                {user?.name}
              </p>
              <p className="text-[12px] text-[var(--color-text-tertiary)] truncate mt-px">
                {user?.email}
              </p>
            </div>

            <Separator />

            <div className="p-1">
              {[
                { label: 'Profile',  icon: User,     path: '/dashboard/profile',  id: 'topbar-profile-link'  },
                { label: 'Settings', icon: Settings, path: '/dashboard/settings', id: 'topbar-settings-link' },
              ].map(({ label, icon: Icon, path, id }) => (
                <button
                  key={path}
                  id={id}
                  role="menuitem"
                  onClick={() => { navigate(path); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-2 py-[7px]
                             text-[13px] font-medium text-[var(--color-text-primary)]
                             rounded-[var(--radius-md)]
                             hover:bg-[var(--color-bg-subtle)] transition-colors"
                  style={{ transitionDuration: '100ms' }}
                >
                  <Icon className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            <Separator />

            <div className="p-1">
              <button
                id="topbar-logout"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-2 py-[7px]
                           text-[13px] font-medium text-[var(--color-text-secondary)]
                           rounded-[var(--radius-md)]
                           hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]
                           transition-colors"
                style={{ transitionDuration: '100ms' }}
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
