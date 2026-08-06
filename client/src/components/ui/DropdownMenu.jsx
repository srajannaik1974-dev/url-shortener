/**
 * DropdownMenu.jsx — Design System v2
 *
 * Floating dropdown menu with Framer Motion slide-in.
 * Click-outside to close, keyboard navigable.
 *
 * Usage:
 *   <DropdownMenu trigger={<Button>Options</Button>}>
 *     <DropdownMenu.Item icon={Edit} onClick={…}>Edit</DropdownMenu.Item>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item icon={Trash2} variant="danger" onClick={…}>Delete</DropdownMenu.Item>
 *   </DropdownMenu>
 */

import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickOutside } from '../../hooks/useClickOutside';

const menuVariants = {
  hidden:  { opacity: 0, scale: 0.97, y: -4 },
  visible: { opacity: 1, scale: 1,    y: 0  },
};

// ── Item ──────────────────────────────────────────────────────────────────────
function DropdownItem({
  icon: Icon,
  onClick,
  variant = 'default',
  disabled = false,
  children,
}) {
  const isDestructive = variant === 'danger';

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={[
        'w-full flex items-center gap-2.5 px-3 py-1.5',
        'text-[13px] font-medium leading-none text-left',
        'rounded-[var(--radius-sm)] transition-colors',
        'focus-visible:outline-none focus-visible:bg-[var(--color-bg-subtle)]',
        'disabled:opacity-40 disabled:pointer-events-none',
        isDestructive
          ? 'text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]'
          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
      ].join(' ')}
      style={{ transitionDuration: '100ms' }}
    >
      {Icon && (
        <Icon
          className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-tertiary)]"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

// ── Separator ─────────────────────────────────────────────────────────────────
function DropdownSeparator() {
  return <div className="my-1 h-px bg-[var(--color-border)]" role="separator" />;
}

// ── Label ─────────────────────────────────────────────────────────────────────
function DropdownLabel({ children }) {
  return (
    <p className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] select-none">
      {children}
    </p>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
function DropdownMenu({
  trigger,
  children,
  align = 'right',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(wrapRef, close);

  const alignClass = align === 'left'
    ? 'left-0'
    : align === 'center'
    ? 'left-1/2 -translate-x-1/2'
    : 'right-0';

  return (
    <div ref={wrapRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setOpen((o) => !o)}>
        {trigger}
      </div>

      {/* Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className={[
              'absolute top-full mt-1.5 z-[var(--z-dropdown)]',
              'w-44 p-1',
              'rounded-[var(--radius-lg)]',
              'border border-[var(--color-border)]',
              'bg-[var(--color-bg-page)]',
              'shadow-[var(--shadow-lg)]',
              alignClass,
            ].join(' ')}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

DropdownMenu.Item      = DropdownItem;
DropdownMenu.Separator = DropdownSeparator;
DropdownMenu.Label     = DropdownLabel;

export default DropdownMenu;
