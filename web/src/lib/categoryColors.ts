/**
 * Category colors, shared by the chart, lists and pickers so a category always looks the same.
 * The backend stores the color KEY (e.g. "blue"); the actual shade lives in `index.css`
 * (--color-series-*), validated for color-blind readers on the dark surfaces.
 */
export const CATEGORY_COLORS = {
  blue: 'var(--color-series-1)',
  orange: 'var(--color-series-2)',
  aqua: 'var(--color-series-3)',
  yellow: 'var(--color-series-4)',
  magenta: 'var(--color-series-5)',
  green: 'var(--color-series-6)',
  violet: 'var(--color-series-7)',
  red: 'var(--color-series-8)',
} as const;

export type CategoryColorKey = keyof typeof CATEGORY_COLORS;

export const CATEGORY_COLOR_KEYS = Object.keys(CATEGORY_COLORS) as CategoryColorKey[];

const OTHER_COLOR = 'var(--color-series-other)';

interface ColoredCategory {
  id: number;
  color?: string | null;
}

/**
 * Returns a color lookup for a list of categories. A category's own `color` wins; categories
 * without one (created before colors existed) get a slot by id order, so they stay stable.
 */
export function categoryColors(categories: ColoredCategory[]): (categoryId: number) => string {
  const byId = new Map<number, string>();
  const order = categories.map((c) => c.id).sort((a, b) => a - b);
  const fallbacks = Object.values(CATEGORY_COLORS);
  for (const c of categories) {
    const own = c.color && CATEGORY_COLORS[c.color as CategoryColorKey];
    const index = order.indexOf(c.id);
    byId.set(c.id, own || (index < fallbacks.length ? fallbacks[index]! : OTHER_COLOR));
  }
  return (categoryId) => byId.get(categoryId) ?? OTHER_COLOR;
}

/** Background tint for an icon circle in an unselected state. */
export function tint(color: string, percent = 18): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}
