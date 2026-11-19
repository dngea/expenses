import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DateString } from "../../shared/api/types";
import { todayString } from "../../shared/lib/dates";
import {
  formatPeriod,
  PERIODS,
  periodRange,
  shiftPeriod,
  type PeriodSelection,
} from "./period";

interface PeriodNavigatorProps {
  selection: PeriodSelection;
  onChange: (anchor: DateString) => void;
}

/** ‹ label › to move one day/week/month/year back or forward, plus a "Today" shortcut. */
export function PeriodNavigator({ selection, onChange }: PeriodNavigatorProps) {
  const unit = PERIODS.find(
    (p) => p.value === selection.period,
  )?.label.toLowerCase();
  const buttonClass =
    "rounded-full px-4 py-2 text-xl text-ink-muted hover:bg-surface-2";
  const { from, to } = periodRange(selection);
  const today = todayString();
  // Where today is relative to the shown period: the arrow points that way.
  const todayIs = today > to ? "ahead" : today < from ? "behind" : "here";
  const arrow = { size: 12, strokeWidth: 2.5, "aria-hidden": true } as const;

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(shiftPeriod(selection, -1))}
        aria-label={`Previous ${unit}`}
      >
        ‹
      </button>

      <div className="flex flex-col items-center gap-0.5">
        <span className="font-medium">{formatPeriod(selection)}</span>

        {todayIs !== "here" && (
          <button
            type="button"
            onClick={() => onChange(today)}
            className="text-accent-ink flex items-center gap-1 text-xs font-medium hover:underline"
          >
            {todayIs === "behind" && (
              <ChevronLeft className="translate-y-px" {...arrow} />
            )}
            <span>Back to today</span>
            {todayIs === "ahead" && (
              <ChevronRight className="translate-y-px" {...arrow} />
            )}
          </button>
        )}
      </div>

      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(shiftPeriod(selection, 1))}
        aria-label={`Next ${unit}`}
      >
        ›
      </button>
    </div>
  );
}
