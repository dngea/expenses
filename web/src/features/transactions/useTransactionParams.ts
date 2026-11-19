import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import type { DateString } from '../../shared/api/types';
import { todayString } from '../../shared/lib/dates';
import { parseMode, type Mode } from './mode';
import { PERIODS, type Period, type PeriodSelection } from './period';

const DEFAULT_PERIOD: Period = 'month';

/**
 * View (expenses/income), period and anchor date, kept in the URL
 * (?view=incomes&period=week&date=2026-11-19). Refresh, back button and links between
 * the home and a category's detail all keep the same selection. Defaults are left out.
 */
export function useTransactionParams() {
  const [params, setParams] = useSearchParams();

  const mode = parseMode(params.get('view'));
  const periodParam = params.get('period');
  const period: Period = PERIODS.some((p) => p.value === periodParam)
    ? (periodParam as Period)
    : DEFAULT_PERIOD;
  const dateParam = params.get('date');
  const anchor: DateString =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : todayString();
  const selection: PeriodSelection = { period, anchor };

  function update(next: { mode?: Mode; period?: Period; anchor?: DateString }) {
    setParams(
      transactionSearch(next.mode ?? mode, {
        period: next.period ?? period,
        anchor: next.anchor ?? anchor,
      }),
      { replace: true },
    );
  }

  // The mode tints the whole app (page background, header, cards…), so it goes on <html>.
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    return () => {
      delete document.documentElement.dataset.mode;
    };
  }, [mode]);

  return {
    mode,
    selection,
    search: transactionSearch(mode, selection),
    setMode: (m: Mode) => update({ mode: m }),
    setPeriod: (p: Period) => update({ period: p }),
    setAnchor: (a: DateString) => update({ anchor: a }),
  };
}

/** Query string for a selection, e.g. "?view=incomes&period=week&date=2026-11-19". */
export function transactionSearch(mode: Mode, { period, anchor }: PeriodSelection): string {
  const p = new URLSearchParams();
  if (mode !== 'expenses') p.set('view', mode);
  if (period !== DEFAULT_PERIOD) p.set('period', period);
  if (anchor !== todayString()) p.set('date', anchor);
  const qs = p.toString();
  return qs ? `?${qs}` : '';
}
