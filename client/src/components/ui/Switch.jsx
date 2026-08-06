/**
 * Switch.jsx — Design System v2
 *
 * Accessible toggle switch. Works with react-hook-form Controller.
 *
 * Props:
 *  checked  : boolean
 *  onChange : (checked: boolean) => void
 *  disabled : boolean
 *  label    : string
 *  id       : string
 *  size     : 'sm' | 'md'
 *  className: string
 */

import { forwardRef } from 'react';

const sizes = {
  sm: {
    track:  'w-8  h-4',
    thumb:  'w-3  h-3  translate-x-0.5',
    active: 'translate-x-[18px]',
  },
  md: {
    track:  'w-10 h-5',
    thumb:  'w-3.5 h-3.5 translate-x-0.5',
    active: 'translate-x-[22px]',
  },
};

const Switch = forwardRef(function Switch(
  { checked = false, onChange, disabled = false, label, id, size = 'md', className = '' },
  ref
) {
  const sz = sizes[size] ?? sizes.md;

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2.5 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <button
        ref={ref}
        role="switch"
        id={id}
        type="button"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={[
          'relative inline-flex shrink-0 items-center',
          'rounded-full border-2 border-transparent',
          'transition-colors focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1',
          sz.track,
          checked
            ? 'bg-[var(--color-accent)]'
            : 'bg-[var(--color-bg-ui)]',
        ].join(' ')}
        style={{ transitionDuration: '150ms' }}
      >
        <span
          aria-hidden="true"
          className={[
            'inline-block rounded-full bg-white shadow-[var(--shadow-sm)]',
            'transition-transform',
            sz.thumb,
            checked ? sz.active : '',
          ].join(' ')}
          style={{ transitionDuration: '150ms' }}
        />
      </button>

      {label && (
        <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
          {label}
        </span>
      )}
    </label>
  );
});

export default Switch;
