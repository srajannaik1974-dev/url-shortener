/**
 * useDebounce.js
 * Returns a debounced value that only updates after `delay` ms of inactivity.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchValue, 400);
 */

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
