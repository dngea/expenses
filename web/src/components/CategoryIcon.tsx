import { createElement } from 'react';
import { getCategoryIcon } from '../lib/categoryIcons';
import { tint } from '../lib/categoryColors';

interface CategoryIconProps {
  icon: string | null | undefined;
  color: string;
  /** Filled = solid color circle; otherwise a soft tint with a colored icon. */
  filled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { box: 'h-9 w-9', icon: 18 },
  md: { box: 'h-12 w-12', icon: 22 },
  lg: { box: 'h-16 w-16', icon: 30 },
};

/** A category's icon inside a circle of its color. */
export function CategoryIcon({ icon, color, filled = false, size = 'md' }: CategoryIconProps) {
  const s = SIZES[size];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${s.box}`}
      style={{
        backgroundColor: filled ? color : tint(color),
        color: filled ? 'var(--color-page)' : color,
      }}
    >
      {/* createElement: the icon is looked up from a static registry, not created during render. */}
      {createElement(getCategoryIcon(icon), { size: s.icon, strokeWidth: 2, 'aria-hidden': true })}
    </span>
  );
}
