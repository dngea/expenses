import type { CategoryTotal } from '../api/types';
import { formatEur, sumDecimals } from '../lib/format';

export function SummaryList({ rows }: { rows: CategoryTotal[] }) {
  const total = sumDecimals(rows.map((r) => r.total));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
        <p className="text-sm text-slate-500">Total</p>
        <p className="text-3xl font-bold tabular-nums">{formatEur(total)}</p>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-slate-500">No expenses in this period.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {rows.map((row) => (
            <li key={row.category_id} className="flex items-center justify-between px-4 py-3">
              <span>{row.category_name}</span>
              <span className="font-medium tabular-nums">{formatEur(row.total)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
