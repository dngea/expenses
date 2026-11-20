import { ChevronRight } from "lucide-react";
import type { Movement } from "../../shared/api/types";
import { formatEur } from "../../shared/lib/format";
import { toUtc } from "../../shared/lib/dates";

interface EntryListProps {
  /** Entries of a single category (the page header already says which one). */
  entries: Movement[];
  /** The category's color, shown as a small dot on each row. */
  color: string;
  onSelect: (entry: Movement) => void;
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/**
 * Expenses/incomes of one category; tap one to edit it. Rows show a color dot, the
 * description (if any) and the date — no category name, since the page is about one category.
 */
export function EntryList({ entries, color, onSelect }: EntryListProps) {
  if (entries.length === 0) return null;

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      {entries.map((entry) => {
        const date = dateFormat.format(toUtc(entry.spent_at));
        return (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onSelect(entry)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                {entry.description ? (
                  <>
                    <span className="block truncate">{entry.description}</span>
                    <span className="block text-xs text-ink-faint">{date}</span>
                  </>
                ) : (
                  <span className="block">{date}</span>
                )}
              </span>
              <span className="font-medium tabular-nums">{formatEur(entry.amount)}</span>
              <ChevronRight size={18} className="text-ink-faint" aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
