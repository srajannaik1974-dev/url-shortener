/**
 * useCopyToClipboard.js
 * Clipboard copy with 2-second "copied" state auto-reset.
 *
 * Returns: { copied: boolean, copy: (text: string) => Promise<void> }
 */

import { useState, useCallback, useRef } from 'react';

export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const copy = useCallback(async (text) => {
    if (!text) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = text;
        el.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), resetMs);
    } catch (err) {
      console.warn('useCopyToClipboard: failed to copy', err);
    }
  }, [resetMs]);

  return { copied, copy };
}
