import { MODE_ORDER, MODES, type Mode } from "./mode";

interface ModeSelectorProps {
  value: Mode;
  onChange: (mode: Mode) => void;
}

/**
 * Top-level Expenses | Income switch. Deliberately bigger and filled with the accent color,
 * so it reads as a level above the Day/Week/Month/Year tabs.
 */
export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="View"
      className="bg-surface ring-line grid grid-cols-2 gap-1 rounded-xl p-1 ring-1"
    >
      {MODE_ORDER.map((mode) => {
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(mode)}
            className={`rounded-lg py-2 text-base font-semibold transition-colors ${
              active ? "bg-accent text-page" : "text-ink-muted hover:text-ink"
            }`}
          >
            {MODES[mode].label}
          </button>
        );
      })}
    </div>
  );
}
