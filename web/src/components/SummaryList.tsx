import type { CategoryTotal } from '../api/types';
import { formatEur, sumDecimals } from '../lib/format';
import { categoryColors } from '../lib/categoryColors';
import { DonutChart } from './DonutChart';

interface SummaryListProps {
  rows: CategoryTotal[];
  /** Color per category id (from `categoryColors`). Defaults to colors by id order of `rows`. */
  colorOf?: (categoryId: number) => string;
  emptyText?: string;
}

export function SummaryList({ rows, colorOf, emptyText = 'Nothing in this period.' }: SummaryListProps) {
  const total = sumDecimals(rows.map((r) => r.total));

  const colorFor = colorOf ?? categoryColors(rows.map((r) => ({ id: r.category_id })));

  // Biggest spend first, both in the ring and in the list.
  const sorted = [...rows].sort((a, b) => Number(b.total) - Number(a.total));
  const totalNumber = Number(total);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
        <DonutChart
          slices={sorted.map((row) => ({
            key: row.category_id,
            label: row.category_name,
            // Proportions only; exact amounts are always shown from the decimal strings.
            value: Number(row.total),
            color: colorFor(row.category_id),
            display: formatEur(row.total),
          }))}
          center={
            <>
              <p className="text-sm text-ink-muted">Total</p>
              <p className="text-3xl font-bold tabular-nums">{formatEur(total)}</p>
              {/* Invisible twin of the "Total" label so the amount sits at the exact center. */}
              <p className="invisible text-sm" aria-hidden="true">Total</p>
            </>
          }
        />
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-ink-muted">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl bg-surface ring-1 ring-line">
          {sorted.map((row) => (
            <li key={row.category_id} className="flex items-center gap-3 px-4 py-3">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: colorFor(row.category_id) }}
                aria-hidden="true"
              />
              <span className="flex-1 truncate">{row.category_name}</span>
              <span className="text-sm text-ink-faint tabular-nums">
                {totalNumber > 0 ? Math.round((Number(row.total) / totalNumber) * 100) : 0}%
              </span>
              <span className="w-24 text-right font-medium tabular-nums">{formatEur(row.total)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
