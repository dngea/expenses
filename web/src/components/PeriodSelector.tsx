import { PERIODS, type Period } from '../lib/period';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div role="tablist" aria-label="Period" className="grid grid-cols-4 gap-1 rounded-xl bg-slate-200 p-1">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          role="tab"
          aria-selected={value === p.value}
          onClick={() => onChange(p.value)}
          className={`rounded-lg py-2 text-sm font-medium ${
            value === p.value ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
