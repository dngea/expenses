import { useState, type ReactNode } from 'react';

export interface DonutSlice {
  key: string | number;
  label: string;
  value: number;
  color: string;
  /** Pre-formatted value shown in the center when the slice is active. */
  display: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  /** Content shown in the center when no slice is hovered/selected. */
  center: ReactNode;
  size?: number;
}

const STROKE = 22;
/** Visual gap between slices, in px along the ring. */
const GAP = 2;

/**
 * Ring chart in plain SVG. Hover, focus or tap a slice to show its value in the center.
 */
export function DonutChart({ slices, center, size = 240 }: DonutChartProps) {
  const [activeKey, setActiveKey] = useState<DonutSlice['key'] | null>(null);

  const radius = (size - STROKE) / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const active = slices.find((s) => s.key === activeKey);
  const showGaps = slices.filter((s) => s.value > 0).length > 1;

  const lengths = slices.map((s) => (total > 0 ? (s.value / total) * circumference : 0));
  const arcs = slices.map((slice, i) => ({
    slice,
    start: lengths.slice(0, i).reduce((sum, l) => sum + l, 0),
    length: lengths[i] ?? 0,
  }));

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={slices.map((s) => `${s.label}: ${s.display}`).join(', ') || 'No data'}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-2)"
          strokeWidth={STROKE}
        />
        {arcs.map(({ slice, start, length }) => {
          const visible = Math.max(length - (showGaps ? GAP : 0), 0.5);
          const isActive = slice.key === activeKey;
          const dimmed = activeKey !== null && !isActive;
          return (
            <circle
              key={slice.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={isActive ? STROKE + 6 : STROKE}
              strokeDasharray={`${visible} ${circumference - visible}`}
              strokeDashoffset={-start}
              className="cursor-pointer transition-[stroke-width,opacity] duration-150 focus:outline-none"
              style={{ opacity: dimmed ? 0.35 : 1 }}
              tabIndex={0}
              aria-label={`${slice.label}: ${slice.display}`}
              onMouseEnter={() => setActiveKey(slice.key)}
              onMouseLeave={() => setActiveKey(null)}
              onFocus={() => setActiveKey(slice.key)}
              onBlur={() => setActiveKey(null)}
              onClick={() => setActiveKey((k) => (k === slice.key ? null : slice.key))}
            />
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-center [&_p]:leading-none [&_p]:[text-box:trim-both_cap_alphabetic]">
        {active ? (
          <>
            <p className="-my-1 max-w-full truncate py-1 text-sm text-ink-muted">{active.label}</p>
            <p className="text-2xl font-bold tabular-nums">{active.display}</p>
            <p className="text-sm text-ink-faint tabular-nums">
              {total > 0 ? Math.round((active.value / total) * 100) : 0}%
            </p>
          </>
        ) : (
          center
        )}
      </div>
    </div>
  );
}
