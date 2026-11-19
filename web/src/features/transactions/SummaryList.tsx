import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import type { CategoryTotal } from "../../shared/api/types";
import { formatEur, sumDecimals } from "../../shared/lib/format";
import { CategoryIcon } from "../categories/CategoryIcon";
import { categoryColors } from "../categories/categoryColors";
import { DonutChart } from "../../shared/components/DonutChart";

interface SummaryListProps {
  rows: CategoryTotal[];
  /** Color per category id (from `categoryColors`). Defaults to colors by id order of `rows`. */
  colorOf?: (categoryId: number) => string;
  /** Icon key per category id. Missing icons fall back to a tag. */
  iconOf?: (categoryId: number) => string | null | undefined;
  emptyText?: string;
  /** If given, each category row links there (e.g. to that category's entries). */
  hrefFor?: (categoryId: number) => string;
}

export function SummaryList({
  rows,
  colorOf,
  iconOf,
  hrefFor,
  emptyText = "Nothing in this period.",
}: SummaryListProps) {
  const total = sumDecimals(rows.map((r) => r.total));

  const colorFor =
    colorOf ?? categoryColors(rows.map((r) => ({ id: r.category_id })));

  // Biggest spend first, both in the ring and in the list.
  const sorted = [...rows].sort((a, b) => Number(b.total) - Number(a.total));
  const totalNumber = Number(total);

  return (
    <div className="space-y-4">
      <div className="bg-surface ring-line rounded-2xl p-5 ring-1">
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
              <p className="text-ink-muted text-sm">Total</p>
              <p className="text-3xl font-bold tabular-nums">
                {formatEur(total)}
              </p>
              {/* Invisible twin of the "Total" label so the amount sits at the exact center. */}
              <p className="invisible text-sm" aria-hidden="true">
                Total
              </p>
            </>
          }
        />
      </div>

      {rows.length === 0 ? (
        <p className="text-ink-muted py-8 text-center">{emptyText}</p>
      ) : (
        <ul className="divide-line bg-surface ring-line divide-y overflow-hidden rounded-2xl ring-1">
          {sorted.map((row) => {
            const content = (
              <>
                <CategoryIcon
                  icon={iconOf?.(row.category_id)}
                  color={colorFor(row.category_id)}
                  size="sm"
                />
                <span className="flex-1 truncate">{row.category_name}</span>
                <span className="text-ink-faint text-sm tabular-nums">
                  {totalNumber > 0
                    ? Math.round((Number(row.total) / totalNumber) * 100)
                    : 0}
                  %
                </span>
                <span className="w-24 text-right font-medium tabular-nums">
                  {formatEur(row.total)}
                </span>
                {hrefFor && (
                  <ChevronRight
                    size={18}
                    className="text-ink-faint"
                    aria-hidden="true"
                  />
                )}
              </>
            );
            const rowClass = "flex items-center gap-3 px-4 py-3";
            return (
              <li key={row.category_id}>
                {hrefFor ? (
                  <Link
                    to={hrefFor(row.category_id)}
                    className={`${rowClass} hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className={rowClass}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
