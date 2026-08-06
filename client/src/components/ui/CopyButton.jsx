/**
 * CopyButton.jsx — Design System v2
 *
 * Icon button that copies text to clipboard.
 * Shows a ✓ checkmark for 2 seconds on success.
 *
 * Props:
 *  text     : string — the text to copy
 *  size     : 'sm' | 'md'
 *  className: string
 */

import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text, size = 'sm', className = '' }) {
  const { copied, copy } = useCopyToClipboard();

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const buttonSize = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      className={[
        'inline-flex items-center justify-center shrink-0',
        'rounded-[var(--radius-md)]',
        'border border-[var(--color-border)]',
        'bg-[var(--color-bg-page)]',
        'text-[var(--color-text-tertiary)]',
        'hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]',
        'hover:bg-[var(--color-bg-subtle)]',
        'transition-all focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
        buttonSize,
        className,
      ].join(' ')}
      style={{ transitionDuration: '120ms' }}
    >
      {copied ? (
        <Check className={`${iconSize} text-[var(--color-success)]`} />
      ) : (
        <Copy className={iconSize} />
      )}
    </button>
  );
}
