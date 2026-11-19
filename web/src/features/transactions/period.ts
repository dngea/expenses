import type { CategoryTotal, DateString } from '../../shared/api/types';
import {
  addDays,
  addMonths,
  endOfMonth,
  startOfMonth,
  startOfWeek,
  toUtc,
} from '../../shared/lib/dates';
import type { ExpenseFilter } from './expensesApi';

export type Period = 'day' | 'week' | 'month' | 'year';

export const PERIODS: { value: Period; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

/**
 * The selected period plus the date it is anchored to. The anchor is kept when switching
 * period: anchored on 19 Nov 2026, "Week" shows 16–22 Nov and "Year" shows 2026.
 */
export interface PeriodSelection {
  period: Period;
  anchor: DateString;
}

/** First and last day (both inclusive) of the period that contains the anchor. */
export function periodRange({ period, anchor }: PeriodSelection): Required<ExpenseFilter> {
  switch (period) {
    case 'day':
      return { from: anchor, to: anchor };
    case 'week': {
      const from = startOfWeek(anchor);
      return { from, to: addDays(from, 6) };
    }
    case 'month':
      return { from: startOfMonth(anchor), to: endOfMonth(anchor) };
    case 'year':
      return { from: `${anchor.slice(0, 4)}-01-01`, to: `${anchor.slice(0, 4)}-12-31` };
  }
}

/** Moves the anchor one period back (-1) or forward (+1). */
export function shiftPeriod({ period, anchor }: PeriodSelection, delta: number): DateString {
  switch (period) {
    case 'day':
      return addDays(anchor, delta);
    case 'week':
      return addDays(anchor, 7 * delta);
    case 'month':
      return addMonths(anchor, delta);
    case 'year':
      return addMonths(anchor, 12 * delta);
  }
}

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' });
const dayFormat = fmt({ weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const dayMonthFormat = fmt({ day: 'numeric', month: 'short' });
const fullDateFormat = fmt({ day: 'numeric', month: 'short', year: 'numeric' });
const monthFormat = fmt({ month: 'long', year: 'numeric' });

/**
 * Label for the navigator: "Thu 19 Nov 2026", "16 – 22 Nov 2026",
 * "30 Nov – 6 Dec 2026", "November 2026", "2026".
 */
export function formatPeriod(selection: PeriodSelection): string {
  const { from, to } = periodRange(selection);
  switch (selection.period) {
    case 'day':
      return dayFormat.format(toUtc(from));
    case 'week': {
      if (from.slice(0, 4) !== to.slice(0, 4)) {
        return `${fullDateFormat.format(toUtc(from))} – ${fullDateFormat.format(toUtc(to))}`;
      }
      if (from.slice(0, 7) !== to.slice(0, 7)) {
        return `${dayMonthFormat.format(toUtc(from))} – ${fullDateFormat.format(toUtc(to))}`;
      }
      return `${Number(from.slice(8))} – ${fullDateFormat.format(toUtc(to))}`;
    }
    case 'month':
      return monthFormat.format(toUtc(from));
    case 'year':
      return from.slice(0, 4);
  }
}

/** Loads the per-category totals for a period. */
export function fetchPeriodSummary(
  selection: PeriodSelection,
  getSummary: (filter: ExpenseFilter) => Promise<CategoryTotal[]>,
): Promise<CategoryTotal[]> {
  return getSummary(periodRange(selection));
}
