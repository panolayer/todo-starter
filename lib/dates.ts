// Calendar-day helpers for due dates. A due date is a plain YYYY-MM-DD string
// with no time zone: a todo is due on a day, not at an instant. "Today" is
// passed in by the caller so these functions stay pure and easy to test.

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 86_400_000;

/** How many days ahead, counting today, an open todo counts as due soon. */
export const DUE_SOON_DAYS = 3;

/** Format a Date as its local calendar day, YYYY-MM-DD. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** True when `value` is a YYYY-MM-DD string naming a real calendar day. */
export function isDateKey(value: string): boolean {
  if (!DATE_KEY.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function toUtcMs(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/** The calendar day `days` days after `dateKey` (negative `days` goes back). */
export function addDays(dateKey: string, days: number): string {
  const date = new Date(toUtcMs(dateKey) + days * MS_PER_DAY);
  return date.toISOString().slice(0, 10);
}

/**
 * Whole calendar days from `today` until `due`: 0 when it is due today, 1 when
 * it is due tomorrow, and negative once the day has passed.
 */
export function daysUntil(due: string, today: string): number {
  return Math.round((toUtcMs(due) - toUtcMs(today)) / MS_PER_DAY);
}

/** True when an open todo's due date is earlier than `today`. */
export function isOverdue(todo: { completed: boolean; dueDate: string | null }, today: string): boolean {
  if (todo.completed || todo.dueDate === null) return false;
  return daysUntil(todo.dueDate, today) < 0;
}

/**
 * True when an open todo is due within the next DUE_SOON_DAYS days, inclusive:
 * anything due from today through DUE_SOON_DAYS days from today is due soon.
 * Completed todos and todos without a due date are never due soon.
 */
export function isDueSoon(todo: { completed: boolean; dueDate: string | null }, today: string): boolean {
  if (todo.completed || todo.dueDate === null) return false;
  const days = daysUntil(todo.dueDate, today);
  return days >= 0 && days < DUE_SOON_DAYS;
}

/**
 * Read a due date from a request body. null or "" clears the due date and
 * returns null. A string is returned as-is only when isDateKey accepts it (a
 * YYYY-MM-DD string naming a real calendar day); any other string, such as
 * "next week" or "2025-02-30", and any non-string value return undefined so
 * the caller can reject the request.
 */
export function parseDueDate(value: unknown): string | null | undefined {
  if (value === null || value === "") return null;
  if (typeof value !== "string" || !isDateKey(value)) return undefined;
  return value;
}
