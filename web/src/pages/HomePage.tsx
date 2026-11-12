import { useState } from 'react';
import { AddButton } from '../components/AddButton';
import { ComingSoon } from '../components/ComingSoon';
import { ErrorMessages } from '../components/ErrorMessages';
import { ExpenseForm } from '../components/ExpenseForm';
import { MonthNavigator } from '../components/MonthNavigator';
import { PeriodSelector } from '../components/PeriodSelector';
import { Sheet } from '../components/Sheet';
import { SummaryList } from '../components/SummaryList';
import { currentMonth } from '../lib/dates';
import { fetchPeriodSummary, isPeriodSupported, PERIODS, type Period } from '../lib/period';
import { useAsync } from '../lib/useAsync';

export function HomePage() {
  const [period, setPeriod] = useState<Period>('month');
  const [month, setMonth] = useState(currentMonth);
  const [formOpen, setFormOpen] = useState(false);

  const supported = isPeriodSupported(period);
  const summary = useAsync(supported ? () => fetchPeriodSummary({ period, month }) : null, [period, month]);

  function handleCreated() {
    setFormOpen(false);
    summary.reload();
  }

  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? period;

  return (
    <div className="space-y-4 pb-20">
      <PeriodSelector value={period} onChange={setPeriod} />

      {period === 'month' && <MonthNavigator month={month} onChange={setMonth} />}

      {!supported ? (
        <ComingSoon label={periodLabel} />
      ) : summary.error ? (
        <ErrorMessages error={summary.error} />
      ) : summary.loading && !summary.data ? (
        <p className="py-8 text-center text-slate-500">Loading…</p>
      ) : (
        <div className={summary.loading ? 'opacity-60' : ''}>
          <SummaryList rows={summary.data ?? []} />
        </div>
      )}

      <AddButton onClick={() => setFormOpen(true)} />

      <Sheet title="New expense" open={formOpen} onClose={() => setFormOpen(false)}>
        <ExpenseForm onCreated={handleCreated} />
      </Sheet>
    </div>
  );
}
