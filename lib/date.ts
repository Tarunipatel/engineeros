import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Vercel's serverless functions run in UTC regardless of where the user is,
 * so a naive `dayjs()` "today" drifts from the user's real calendar day for
 * roughly 5.5 hours every day (studying past midnight IST would get logged
 * under the wrong date, streaks would look reset, etc). Pin every "now" to
 * the app's one real user's timezone instead of the process's local time.
 */
const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Kolkata";

function now() {
  return dayjs().tz(APP_TIMEZONE);
}

export const DATE_FORMAT = "YYYY-MM-DD";

export function today(): string {
  return now().format(DATE_FORMAT);
}

export function formatDate(date: string | Date, format = "MMM D, YYYY"): string {
  return dayjs(date).format(format);
}

export function isPastOrToday(date: string): boolean {
  return dayjs(date).isBefore(now().add(1, "day"), "day");
}

export function isOverdue(date: string): boolean {
  return dayjs(date).isBefore(now(), "day");
}

export function isToday(date: string): boolean {
  return dayjs(date).isSame(now(), "day");
}

export function addDays(date: string, days: number): string {
  return dayjs(date).add(days, "day").format(DATE_FORMAT);
}

export function daysBetween(a: string, b: string): number {
  return dayjs(b).diff(dayjs(a), "day");
}

/** Monday-start week range containing `date` (defaults to today). */
export function weekRange(date?: string): { start: string; end: string } {
  const d = date ? dayjs(date) : now();
  const start = d.startOf("isoWeek");
  const end = d.endOf("isoWeek");
  return { start: start.format(DATE_FORMAT), end: end.format(DATE_FORMAT) };
}

export function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(now().subtract(i, "day").format(DATE_FORMAT));
  }
  return days;
}

export function greeting(): string {
  const hour = now().hour();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
