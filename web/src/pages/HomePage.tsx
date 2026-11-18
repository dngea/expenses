import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { AddButton } from '../components/AddButton';
import { ComingSoon } from '../components/ComingSoon';
import { EntryForm } from '../components/EntryForm';
import { ErrorMessages } from '../components/ErrorMessages';
import { ModeSelector } from '../components/ModeSelector';
import { MonthNavigator } from '../components/MonthNavigator';
import { PeriodSelector } from '../components/PeriodSelector';
import { Sheet } from '../components/Sheet';
import { SummaryList } from '../components/SummaryList';
import { categoryColors } from '../lib/categoryColors';
import { currentMonth } from '../lib/dates';
import { MODES, parseMode, type Mode } from '../lib/mode';
import { fetchPeriodSummary, isPeriodSupported, PERIODS, type Period } from '../lib/period';
import { useAsync } from '../lib/useAsync';

export function HomePage() {
  // Kept in the URL (?view=incomes) so a refresh or the back button keeps the current view.
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = parseMode(searchParams.get('view'));
  const config = MODES[mode];

  // The mode tints the whole app (page background, header, cards…), so it goes on <html>.
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    return () => {
      delete document.documentElement.dataset.mode;
    };
  }, [mode]);

  const [period, setPeriod] = useState<Period>('month');
  const [month, setMonth] = useState(currentMonth);
  const [formOpen, setFormOpen] = useState(false);

  const categories = useAsync(config.getCategories, [config]);
  const colorOf = useMemo(
    () => (categories.data ? categoryColors(categories.data) : undefined),
    [categories.data],
  );

  const supported = isPeriodSupported(period);
  const summary = useAsync(
    supported ? () => fetchPeriodSummary({ period, month }, config.getSummary) : null,
    [config, period, month],
  );

  function handleModeChange(next: Mode) {
    setSearchParams(next === 'expenses' ? {} : { view: next }, { replace: true });
  }

  function handleCreated() {
    setFormOpen(false);
    summary.reload();
    categories.reload();
  }

  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? period;

  return (
    <div className="space-y-4 pb-20">
      <ModeSelector value={mode} onChange={handleModeChange} />

      <PeriodSelector value={period} onChange={setPeriod} />

      {period === 'month' && <MonthNavigator month={month} onChange={setMonth} />}

      {!supported ? (
        <ComingSoon label={periodLabel} />
      ) : summary.error ? (
        <ErrorMessages error={summary.error} />
      ) : summary.loading && !summary.data ? (
        <p className="py-8 text-center text-ink-muted">Loading…</p>
      ) : (
        <div className={summary.loading ? 'opacity-60' : ''}>
          <SummaryList
            rows={summary.data ?? []}
            colorOf={colorOf}
            emptyText={config.emptyText}
          />
        </div>
      )}

      <AddButton label={config.addLabel} onClick={() => setFormOpen(true)} />

      <Sheet title={config.newTitle} open={formOpen} onClose={() => setFormOpen(false)}>
        <EntryForm key={mode} config={config} onCreated={handleCreated} />
      </Sheet>
    </div>
  );
}
