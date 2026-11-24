import { useMemo, useState } from 'react';
import { AddButton } from '../../shared/components/AddButton';
import { ErrorMessages } from '../../shared/components/ErrorMessages';
import { Sheet } from '../../shared/components/Sheet';
import { useAsync } from '../../shared/lib/useAsync';
import { categoryColors } from '../categories/categoryColors';
import { Balance } from './Balance';
import { MODES } from './mode';
import { getBalance } from './movementsApi';
import { ModeSelector } from './ModeSelector';
import { NewEntryForm } from './NewEntryForm';
import { fetchPeriodSummary } from './period';
import { PeriodNavigator } from './PeriodNavigator';
import { PeriodSelector } from './PeriodSelector';
import { SummaryList } from './SummaryList';
import { useTransactionParams } from './useTransactionParams';

export function HomePage() {
  const { mode, selection, search, setMode, setPeriod, setAnchor } = useTransactionParams();
  const config = MODES[mode];
  const { period, anchor } = selection;
  const [formOpen, setFormOpen] = useState(false);

  const categories = useAsync(config.getCategories, [config]);
  const colorOf = useMemo(
    () => (categories.data ? categoryColors(categories.data) : undefined),
    [categories.data],
  );

  const balance = useAsync(getBalance, []);

  const summary = useAsync(
    () => fetchPeriodSummary({ period, anchor }, config.getSummary),
    [config, period, anchor],
  );

  function handleCreated() {
    setFormOpen(false);
    summary.reload();
    balance.reload();
    categories.reload();
  }

  return (
    <div className="space-y-4 pb-20">
      <Balance balance={balance.data?.balance} />

      <ModeSelector value={mode} onChange={setMode} />

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
            iconOf={(id) => categories.data?.find((c) => c.id === id)?.icon}
            emptyText={config.emptyText}
            // Each category row opens its entries for this same period.
            hrefFor={(categoryId) => `/category/${categoryId}${search}`}
          />
        </div>
      )}

      <AddButton label={config.addLabel} onClick={() => setFormOpen(true)} />

      <Sheet title={config.newTitle} open={formOpen} onClose={() => setFormOpen(false)}>
        <NewEntryForm key={mode} config={config} onCreated={handleCreated} />
      </Sheet>
    </div>
  );
}
