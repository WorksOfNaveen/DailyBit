const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Format a Date as YYYY-MM-DD in local time. */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Parse YYYY-MM-DD into a Date at local midnight. */
export function parseDate(dateString: string): Date {
  if (!DATE_FORMAT_REGEX.test(dateString)) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Add (or subtract) days from a date. */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Last N calendar days ending today, oldest first. */
export function getLastNDates(n: number, endDate: Date = new Date()): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    dates.push(formatDate(addDays(endDate, -i)));
  }
  return dates;
}

export function formatDisplayDate(dateString: string): string {
  const date = parseDate(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatHeaderDate(date: Date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getShortWeekday(dateString: string): string {
  const date = parseDate(dateString);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}
