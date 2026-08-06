/**
 * utils/index.js — Shared utility functions
 */

/**
 * Format a date string or Date object to a human-readable format.
 * @param {string|Date} date
 * @param {Intl.DateTimeFormatOptions} options
 */
export function formatDate(date, options = {}) {
  const defaults = { dateStyle: 'medium', ...options };
  return new Intl.DateTimeFormat('en-US', defaults).format(new Date(date));
}

/**
 * Truncate a URL for display.
 * @param {string} url
 * @param {number} maxLen
 */
export function truncateUrl(url, maxLen = 50) {
  if (!url || url.length <= maxLen) return url;
  return url.slice(0, maxLen) + '…';
}

/**
 * Copy text to clipboard and return a promise.
 * @param {string} text
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for older browsers
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

/**
 * Extract a friendly error message from an Axios error.
 * @param {import('axios').AxiosError} error
 * @param {string} fallback
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}
