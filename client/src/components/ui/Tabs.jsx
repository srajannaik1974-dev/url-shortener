/**
 * Tabs.jsx — Design System v2
 *
 * Underline-style tabs. GitHub/Linear inspired.
 * Active tab: bottom border in accent color + text-primary weight.
 *
 * Usage:
 *   <Tabs value={tab} onChange={setTab}>
 *     <Tabs.List>
 *       <Tabs.Tab value="overview">Overview</Tabs.Tab>
 *       <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
 *     </Tabs.List>
 *   </Tabs>
 *   <Tabs.Panel value="overview" current={tab}>…</Tabs.Panel>
 *
 * Props (Tabs):
 *  value   : string — active tab value
 *  onChange: (value: string) => void
 */

import { createContext, useContext } from 'react';

const TabsCtx = createContext(null);

// ── Root ──────────────────────────────────────────────────────────────────────
function Tabs({ value, onChange, children, className = '' }) {
  return (
    <TabsCtx.Provider value={{ value, onChange }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

// ── Tabs.List ─────────────────────────────────────────────────────────────────
function TabsList({ children, className = '' }) {
  return (
    <div
      role="tablist"
      className={[
        'flex items-center gap-0',
        'border-b border-[var(--color-border)]',
        '-mb-px', // overlap with content border if needed
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

// ── Tabs.Tab ──────────────────────────────────────────────────────────────────
function Tab({ value, children, disabled = false, icon: Icon, count }) {
  const ctx = useContext(TabsCtx);
  const isActive = ctx?.value === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      disabled={disabled}
      onClick={() => !disabled && ctx?.onChange(value)}
      className={[
        'inline-flex items-center gap-1.5',
        'px-3 py-2.5',
        'text-[13px] font-medium leading-none whitespace-nowrap',
        'border-b-2 -mb-[1px]', // sits on top of TabsList border
        'transition-colors select-none',
        'focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset',
        isActive
          ? 'text-[var(--color-text-primary)] border-[var(--color-accent)]'
          : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
      style={{ transitionDuration: '100ms' }}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      {children}
      {count !== undefined && (
        <span
          className={[
            'inline-flex items-center justify-center',
            'min-w-[18px] h-[18px] px-1',
            'rounded-full text-[11px] font-medium',
            isActive
              ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)]'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-tertiary)]',
          ].join(' ')}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ── Tabs.Panel ────────────────────────────────────────────────────────────────
function TabPanel({ value, current, children, className = '' }) {
  if (value !== current) return null;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={`focus-visible:outline-none ${className}`}
    >
      {children}
    </div>
  );
}

Tabs.List  = TabsList;
Tabs.Tab   = Tab;
Tabs.Panel = TabPanel;

export default Tabs;
