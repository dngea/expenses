import type { DateString } from '../api/types';

/*
 * Plain calendar dates ("YYYY-MM-DD") with no time zone. Date math is done in UTC on
 * purpose, so a date never shifts because of the user's local time zone or DST.
 */

const pad = (n: number) => String(n).padStart(2, '0');

/** Today's local date as "YYYY-MM-DD". */
export function todayString(): DateString {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** "2026-11-19" -> UTC timestamp of that day at 00:00. */
export function toUtc(date: DateString): number {
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/** UTC timestamp -> "YYYY-MM-DD". */
export function fromUtc(ms: number): DateString {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function addDays(date: DateString, days: number): DateString {
  const d = new Date(toUtc(date));
  d.setUTCDate(d.getUTCDate() + days);
  return fromUtc(d.getTime());
}

/**
 * Moves a date by whole months, keeping the day when possible and clamping it otherwise
 * (Jan 31 + 1 month -> Feb 28/29).
 */
export function addMonths(date: DateString, months: number): DateString {
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number);
  const index = y * 12 + (m - 1) + months;
  const year = Math.floor(index / 12);
  const month = index - year * 12; // 0-based
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return fromUtc(Date.UTC(year, month, Math.min(d, lastDay)));
}

/** Monday of the week that contains `date` (weeks run Monday–Sunday). */
export function startOfWeek(date: DateString): DateString {
  const dayOfWeek = (new Date(toUtc(date)).getUTCDay() + 6) % 7; // 0 = Monday
  return addDays(date, -dayOfWeek);
}

export function startOfMonth(date: DateString): DateString {
  return `${date.slice(0, 7)}-01`;
}

export function endOfMonth(date: DateString): DateString {
  return addDays(addMonths(startOfMonth(date), 1), -1);
}
