import type { DateString, MonthString } from '../api/types';

const pad = (n: number) => String(n).padStart(2, '0');

/** Today's local date as "YYYY-MM-DD". */
export function todayString(): DateString {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Current local month as "YYYY-MM". */
export function currentMonth(): MonthString {
  return todayString().slice(0, 7);
}

/** Moves a "YYYY-MM" month by `delta` months, using plain integer math. */
export function shiftMonth(month: MonthString, delta: number): MonthString {
  const [year = 0, mon = 1] = month.split('-').map(Number);
  const index = year * 12 + (mon - 1) + delta;
  return `${Math.floor(index / 12)}-${pad((index % 12) + 1)}`;
}

const monthLabelFormat = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "2026-11" -> "November 2026". Uses UTC so the label never shifts with the local time zone. */
export function formatMonth(month: MonthString): string {
  const [year = 0, mon = 1] = month.split('-').map(Number);
  return monthLabelFormat.format(Date.UTC(year, mon - 1, 1));
}
