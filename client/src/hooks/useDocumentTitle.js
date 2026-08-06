/**
 * useDocumentTitle.js
 * Reactively sets document.title with app name suffix.
 */

import { useEffect } from 'react';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Snip.ly';

export function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — ${APP_NAME}` : APP_NAME;
    return () => { document.title = prev; };
  }, [title]);
}
