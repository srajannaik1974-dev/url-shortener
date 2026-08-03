'use strict';

/**
 * datetime.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Timezone-aware date utilities for the URL Shortener.
 *
 * ── Why this module exists ───────────────────────────────────────────────────
 * JavaScript's Date object always works internally in UTC milliseconds since
 * epoch. ISO 8601 strings, however, can carry different timezone offsets:
 *
 *   "2026-08-04T06:30:00Z"           Explicit UTC
 *   "2026-08-04T12:00:00+05:30"      IST (UTC+5:30) → exact same instant as above
 *   "2026-08-04T12:00:00"            ⚠️  Ambiguous — JS treats as LOCAL SERVER time
 *
 * ── Timezone conversion explained ───────────────────────────────────────────
 * When `new Date(isoString)` is called in Node.js:
 *
 *  • If the string ends with Z            → parsed as UTC directly.
 *  • If the string has an offset (+HH:MM) → JS subtracts the offset, giving UTC.
 *    e.g. "2026-08-04T12:00:00+05:30"
 *         = 2026-08-04 12:00:00 minus 5 h 30 m
 *         = 2026-08-04T06:30:00Z  (stored in PostgreSQL as UTC)
 *  • If NO offset is present              → treated as LOCAL SERVER time,
 *    which may silently differ from client intent. We BLOCK this via Zod.
 *
 * ── Our strategy ────────────────────────────────────────────────────────────
 * 1. Validation  – Zod schema uses { offset: true } so only strings that carry
 *    an explicit offset (Z or +HH:MM) are accepted.  Bare local strings
 *    ("2026-08-04T12:00:00") are rejected with a clear error.
 *
 * 2. Storage     – parseToUtcDate() converts any offset-aware ISO string to a
 *    JavaScript Date.  Prisma then stores it as UTC in PostgreSQL (all
 *    TIMESTAMP WITH TIME ZONE columns are UTC-normalised by PostgreSQL).
 *
 * 3. Comparison  – Date.now() is always UTC milliseconds; comparing it with
 *    expiresAt.getTime() (also UTC millis) is always timezone-safe.
 */

/**
 * Parse any ISO 8601 string that carries a timezone offset (Z or +HH:MM) into
 * a UTC-normalised JavaScript Date object.
 *
 * This is semantically equivalent to `new Date(isoString)` but makes intent
 * explicit in call-sites and validates the result so callers don't silently
 * receive an Invalid Date.
 *
 * @param {string|Date|null|undefined} value
 *   - ISO 8601 string with offset (e.g. "2026-08-04T12:00:00+05:30" or "...Z")
 *   - A Date object (returned as-is after validation)
 *   - null / undefined -> returns null (no expiration)
 * @returns {Date|null}
 * @throws {RangeError} if the value is a string but cannot be parsed
 */
function parseToUtcDate(value) {
    if (!value && value !== 0) return null;
    if (value instanceof Date) {
        if (isNaN(value.getTime())) throw new RangeError('Invalid Date object supplied');
        return value;
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) {
        throw new RangeError(
            `Cannot parse "${value}" as a valid date. ` +
            'Ensure the string carries a timezone offset, e.g. Z (UTC) or +05:30 (IST).'
        );
    }
    return d;
}

/**
 * Format a Date for diagnostic log output, showing BOTH its UTC representation
 * AND the server's local timezone so IST (or any local) users can correlate.
 *
 * Example (server running in IST, UTC+5:30):
 *   formatUtcAndLocal(new Date('2026-08-04T06:30:00Z'))
 *   => "2026-08-04T06:30:00.000Z (local: 2026-08-04T12:00:00+05:30)"
 *
 * @param {Date|string|null|undefined} value
 * @returns {string}
 */
function formatUtcAndLocal(value) {
    if (!value) return 'none';

    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return 'invalid date';

    // UTC side
    const utc = d.toISOString();

    // Local side — build an ISO-like string with offset.
    // 'sv-SE' locale gives "YYYY-MM-DD HH:mm:ss" in local time (no AM/PM,
    // no locale-specific separators), which we reshape into ISO format.
    const localBase = d
        .toLocaleString('sv-SE', { hour12: false })
        .replace(' ', 'T');                  // "2026-08-04T12:00:00"

    const offsetMins = -d.getTimezoneOffset(); // positive for zones ahead of UTC
    const sign = offsetMins >= 0 ? '+' : '-';
    const absMin = Math.abs(offsetMins);
    const hh = String(Math.floor(absMin / 60)).padStart(2, '0');
    const mm = String(absMin % 60).padStart(2, '0');
    const local = `${localBase}${sign}${hh}:${mm}`;

    return `${utc} (local: ${local})`;
}

module.exports = { parseToUtcDate, formatUtcAndLocal };
