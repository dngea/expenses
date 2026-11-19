import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { AddButton } from '../../shared/components/AddButton';
import { EntryForm } from './EntryForm';
import { ErrorMessages } from '../../shared/components/ErrorMessages';
import { ModeSelector } from './ModeSelector';
import { PeriodNavigator } from './PeriodNavigator';
import { PeriodSelector } from './PeriodSelector';
import { Sheet } from '../../shared/components/Sheet';
import { SummaryList } from './SummaryList';
import { categoryColors } from '../categories/categoryColors';
import { todayString } from '../../shared/lib/dates';
import { MODES, parseMode, type Mode } from './mode';
import { fetchPeriodSummary, type Period } from './period';
import { useAsync } from '../../shared/lib/useAsync';

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
  // The date the period is anchored to; kept when switching between day/week/month/year.
  const [anchor, setAnchor] = useState(todayString);
  const [formOpen, setFormOpen] = useState(false);

  const categories = useAsync(config.getCategories, [config]);
  const colorOf = useMemo(
    () => (categories.data ? categoryColors(categories.data) : undefined),
    [categories.data],
  );

  const selection = { period, anchor };
  const summary = useAsync(
    () => fetchPeriodSummary({ period, anchor }, config.getSummary),
    [config, period, anchor],
  );

  function handleModeChange(next: Mode) {
    setSearchParams(next === 'expenses' ? {} : { view: next }, { replace: true });
  }

  function handleCreated() {
    setFormOpen(false);
    summary.reload();
    categories.reload();
  }

  return (
    <div className="space-y-4 pb-20">
      <ModeSelector value={mode} onChange={handleModeChange} />

      <PeriodSelector value={period} onChange={setPeriod} />

      <PeriodNavigator selection={selection} onChange={setAnchor} />

      {summary.error ? (
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
