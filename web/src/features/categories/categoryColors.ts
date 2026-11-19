/**
 * Category colors, shared by the chart, lists and pickers so a category always looks the same.
 * The backend stores the color KEY (e.g. "blue"); the actual shade lives in `index.css`
 * (--color-series-*), validated for color-blind readers on the dark surfaces.
 */
export const CATEGORY_COLORS = {
  blue: "var(--color-series-1)",
  orange: "var(--color-series-2)",
  aqua: "var(--color-series-3)",
  yellow: "var(--color-series-4)",
  magenta: "var(--color-series-5)",
  green: "var(--color-series-6)",
  violet: "var(--color-series-7)",
  red: "var(--color-series-8)",
  gray: "var(--color-series-other)",
} as const;

export type CategoryColorKey = keyof typeof CATEGORY_COLORS;

export const CATEGORY_COLOR_KEYS = Object.keys(
  CATEGORY_COLORS,
) as CategoryColorKey[];

const OTHER_COLOR = "var(--color-series-other)";

interface ColoredCategory {
  id: number;
  color?: string | null;
}

/** Colors handed out automatically, in order, to categories without a color of their own. */
const FALLBACK_KEYS = CATEGORY_COLOR_KEYS.filter((k) => k !== "gray");

/**
 * Returns a color-KEY lookup for a list of categories. A category's own valid `color` wins;
 * categories without one get a slot by id order (so it stays stable), and gray past the 8th.
 */
export function categoryColorKeys(
  categories: ColoredCategory[],
): (categoryId: number) => CategoryColorKey {
  const byId = new Map<number, CategoryColorKey>();
  const order = categories.map((c) => c.id).sort((a, b) => a - b);
  for (const c of categories) {
    const own = isCategoryColorKey(c.color) ? c.color : undefined;
    const index = order.indexOf(c.id);
    byId.set(c.id, own ?? FALLBACK_KEYS[index] ?? "gray");
  }
  return (categoryId) => byId.get(categoryId) ?? "gray";
}

/** Like `categoryColorKeys`, but returns the CSS color to paint with. */
export function categoryColors(
  categories: ColoredCategory[],
): (categoryId: number) => string {
  const keyOf = categoryColorKeys(categories);
  return (categoryId) => CATEGORY_COLORS[keyOf(categoryId)] ?? OTHER_COLOR;
}

export function isCategoryColorKey(
  value: string | null | undefined,
): value is CategoryColorKey {
  return !!value && value in CATEGORY_COLORS;
}

/** Background tint for an icon circle in an unselected state. */
export function tint(color: string, percent = 18): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}
