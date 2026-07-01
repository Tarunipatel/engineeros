import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export const DATE_FORMAT = "YYYY-MM-DD";

export function today(): string {
  return dayjs().format(DATE_FORMAT);
}

export function formatDate(date: string | Date, format = "MMM D, YYYY"): string {
  return dayjs(date).format(format);
}

export function isPastOrToday(date: string): boolean {
  return dayjs(date).isBefore(dayjs().add(1, "day"), "day");
}

export function isOverdue(date: string): boolean {
  return dayjs(date).isBefore(dayjs(), "day");
}

export function isToday(date: string): boolean {
  return dayjs(date).isSame(dayjs(), "day");
}

export function addDays(date: string, days: number): string {
  return dayjs(date).add(days, "day").format(DATE_FORMAT);
}

export function daysBetween(a: string, b: string): number {
  return dayjs(b).diff(dayjs(a), "day");
}

/** Monday-start week range containing `date` (defaults to today). */
export function weekRange(date?: string): { start: string; end: string } {
  const d = date ? dayjs(date) : dayjs();
  const start = d.startOf("isoWeek");
  const end = d.endOf("isoWeek");
  return { start: start.format(DATE_FORMAT), end: end.format(DATE_FORMAT) };
}

export function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(dayjs().subtract(i, "day").format(DATE_FORMAT));
  }
  return days;
}

export function greeting(): string {
  const hour = dayjs().hour();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
