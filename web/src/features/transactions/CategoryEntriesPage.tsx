import { ChevronLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Expense } from '../../shared/api/types';
import { ErrorMessages } from '../../shared/components/ErrorMessages';
import { Sheet } from '../../shared/components/Sheet';
import { formatEur, sumDecimals } from '../../shared/lib/format';
import { useAsync } from '../../shared/lib/useAsync';
import { CategoryIcon } from '../categories/CategoryIcon';
import { categoryColors } from '../categories/categoryColors';
import { EditEntryForm } from './EditEntryForm';
import { EntryList } from './EntryList';
import { MODES } from './mode';
import { formatPeriod, periodRange } from './period';
import { useTransactionParams } from './useTransactionParams';

/**
 * The expenses (or income) of ONE category in the selected period, opened from a row of the
 * home summary. Just the list: tap an entry to edit or delete it.
 */
export function CategoryEntriesPage() {
  const categoryId = Number(useParams().categoryId);
  const { mode, selection, search } = useTransactionParams();
  const config = MODES[mode];
  const { period, anchor } = selection;
  const [editing, setEditing] = useState<Expense | null>(null);

  const categories = useAsync(config.getCategories, [config]);
  const category = categories.data?.find((c) => c.id === categoryId);
  const colorOf = useMemo(
    () => (categories.data ? categoryColors(categories.data) : undefined),
    [categories.data],
  );

  // The backend has no category filter yet, so we load the period and keep this category here.
  const entries = useAsync(
    () =>
      config
        .getEntries(periodRange({ period, anchor }))
        .then((all) => all.filter((e) => e.category_id === categoryId)),
    [config, period, anchor, categoryId],
  );
  const total = sumDecimals((entries.data ?? []).map((e) => e.amount));

  function handleSaved() {
    setEditing(null);
    entries.reload();
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-3">
        <Link
          to={`/${search}`}
          aria-label="Back"
          className="-ml-2 rounded-full p-2 text-ink-muted hover:bg-surface-2"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </Link>
        {category && colorOf && (
          <CategoryIcon icon={category.icon} color={colorOf(category.id)} />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold">{category?.name ?? '…'}</h2>
          <p className="text-sm text-ink-muted">{formatPeriod(selection)}</p>
        </div>
        {entries.data && (
          <p className="text-xl font-bold tabular-nums">{formatEur(total)}</p>
        )}
      </div>

      <ErrorMessages error={categories.error} />
      <ErrorMessages error={entries.error} />

      {entries.loading && !entries.data ? (
        <p className="py-8 text-center text-ink-muted">Loading…</p>
      ) : entries.data?.length === 0 ? (
        <p className="py-8 text-center text-ink-muted">{config.emptyText}</p>
      ) : (
        entries.data &&
        colorOf && (
          <div className={entries.loading ? 'opacity-60' : ''}>
            <EntryList
              entries={entries.data}
              color={colorOf(categoryId)}
              onSelect={setEditing}
            />
          </div>
        )
      )}

      <Sheet title={config.editTitle} open={editing !== null} onClose={() => setEditing(null)}>
        {editing && (
          <EditEntryForm
            key={`${mode}-${editing.id}`}
            config={config}
            entry={editing}
            onSaved={handleSaved}
          />
        )}
      </Sheet>
    </div>
  );
}
