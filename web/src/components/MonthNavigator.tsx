import type { MonthString } from '../api/types';
import { formatMonth, shiftMonth } from '../lib/dates';

interface MonthNavigatorProps {
  month: MonthString;
  onChange: (month: MonthString) => void;
}

export function MonthNavigator({ month, onChange }: MonthNavigatorProps) {
  const buttonClass = 'rounded-full px-4 py-2 text-xl text-slate-600 hover:bg-slate-200';
  return (
    <div className="flex items-center justify-between">
      <button type="button" className={buttonClass} onClick={() => onChange(shiftMonth(month, -1))} aria-label="Previous month">
        ‹
      </button>
      <span className="font-medium">{formatMonth(month)}</span>
      <button type="button" className={buttonClass} onClick={() => onChange(shiftMonth(month, 1))} aria-label="Next month">
        ›
      </button>
    </div>
  );
}
