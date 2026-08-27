const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/**
 * Render an ISO timestamp as a short relative string, e.g. "3 days ago".
 */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const elapsed = Date.parse(iso) - now;
  const magnitude = Math.abs(elapsed);

  if (magnitude < HOUR) {
    return relative.format(Math.round(elapsed / MINUTE), 'minute');
  }
  if (magnitude < DAY) {
    return relative.format(Math.round(elapsed / HOUR), 'hour');
  }
  if (magnitude < WEEK) {
    return relative.format(Math.round(elapsed / DAY), 'day');
  }
  if (magnitude < MONTH) {
    return relative.format(Math.round(elapsed / WEEK), 'week');
  }
  if (magnitude < YEAR) {
    return relative.format(Math.round(elapsed / MONTH), 'month');
  }
  return relative.format(Math.round(elapsed / YEAR), 'year');
}

/** "12.2 KB" / "278.2 KB" — for file and image items. */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${unit === 0 ? value : value.toFixed(1)} ${units[unit]}`;
}

/** Two-letter fallback for the user avatar. */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}
