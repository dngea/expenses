import { getExpenseSummary, type ExpenseFilter } from '../api/expenses';
import type { CategoryTotal, MonthString } from '../api/types';

export type Period = 'day' | 'week' | 'month' | 'year';

export const PERIODS: { value: Period; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

/** The selected period plus the reference point it is anchored to. */
export interface PeriodSelection {
  period: Period;
  month: MonthString;
}

/**
 * Maps a period selection to the API filter.
 * Returns `null` when the backend does not support that period yet.
 * Extend this function when the backend supports day/week/year filtering.
 */
export function periodToFilter(selection: PeriodSelection): ExpenseFilter | null {
  switch (selection.period) {
    case 'month':
      return { month: selection.month };
    case 'day':
    case 'week':
    case 'year':
      return null;
  }
}

export function isPeriodSupported(period: Period): boolean {
  return periodToFilter({ period, month: '' }) !== null;
}

/** Loads the per-category totals for a period. */
export function fetchPeriodSummary(selection: PeriodSelection): Promise<CategoryTotal[]> {
  const filter = periodToFilter(selection);
  if (!filter) return Promise.reject(new Error(`Period "${selection.period}" is not supported yet.`));
  return getExpenseSummary(filter);
}
