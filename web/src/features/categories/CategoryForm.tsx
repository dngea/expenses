import { useState, type ReactNode, type SyntheticEvent } from "react";
import type { NewCategory } from "../../shared/api/types";
import {
  CATEGORY_COLOR_KEYS,
  CATEGORY_COLORS,
  type CategoryColorKey,
} from "./categoryColors";
import {
  CATEGORY_ICON_KEYS,
  getCategoryIcon,
  type CategoryIconKey,
} from "./categoryIcons";
import { CategoryIcon } from "./CategoryIcon";
import { ErrorMessages } from "../../shared/components/ErrorMessages";
import { labelClass, primaryButtonClass } from "../../shared/components/ui";

export interface CategoryFormValues {
  name: string;
  color: CategoryColorKey;
  icon: CategoryIconKey;
}

interface CategoryFormProps {
  /** Values the fields start with (empty for "new", the category's data for "edit"). */
  initialValues: CategoryFormValues;
  submitLabel: string;
  /** Saves the values; throw to show the error in the form. */
  onSubmit: (values: NewCategory) => Promise<unknown>;
  /** Called after a successful save. */
  onDone: () => void;
  /** Focus the name on open. Off for editing, so the keyboard doesn't pop up on mobile. */
  autoFocusName?: boolean;
  /** Extra content under the submit button (e.g. the delete button when editing). */
  footer?: ReactNode;
}

/** How many icons the picker shows before "Show more". */
const VISIBLE_ICONS = 10;

/**
 * Shared form for creating and editing a category. Use `NewCategoryForm` or
 * `EditCategoryForm` rather than this directly.
 */
export function CategoryForm({
  initialValues,
  submitLabel,
  onSubmit,
  onDone,
  autoFocusName = true,
  footer,
}: CategoryFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [color, setColor] = useState<CategoryColorKey>(initialValues.color);
  const [icon, setIcon] = useState<CategoryIconKey>(initialValues.icon);
  const [showAllIcons, setShowAllIcons] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  const colorValue = CATEGORY_COLORS[color];

  // Collapsed: the first icons, always including the selected one (so editing a category
  // whose icon is further down still shows it).
  const firstIcons = CATEGORY_ICON_KEYS.slice(0, VISIBLE_ICONS);
  const visibleIcons = showAllIcons
    ? CATEGORY_ICON_KEYS
    : firstIcons.includes(icon)
      ? firstIcons
      : [...firstIcons.slice(0, VISIBLE_ICONS - 1), icon];

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(undefined);
    try {
      await onSubmit({ name: name.trim(), color, icon });
      onDone();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Live preview — the name is typed directly into it. */}
      <div className="bg-surface-2 focus-within:ring-accent flex items-center gap-3 rounded-xl p-3 ring-1 ring-transparent">
        <CategoryIcon icon={icon} color={colorValue} size="lg" />
        <input
          id="category-name"
          aria-label="Name"
          placeholder="Category name"
          className="text-ink placeholder:text-ink-faint min-w-0 flex-1 bg-transparent text-lg font-medium focus:outline-none"
          required
          autoFocus={autoFocusName}
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <p id="category-color-label" className={labelClass}>
          Color
        </p>
        <div
          role="radiogroup"
          aria-labelledby="category-color-label"
          className="flex flex-wrap gap-3"
        >
          {CATEGORY_COLOR_KEYS.map((key) => {
            const selected = key === color;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={key}
                onClick={() => setColor(key)}
                className={`focus-visible:outline-accent h-9 w-9 rounded-full transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 ${
                  selected
                    ? "ring-ink ring-offset-surface scale-110 ring-2 ring-offset-2"
                    : ""
                }`}
                style={{ backgroundColor: CATEGORY_COLORS[key] }}
              />
            );
          })}
        </div>
      </div>

      <div>
        <p id="category-icon-label" className={labelClass}>
          Icon
        </p>
        <div
          role="radiogroup"
          aria-labelledby="category-icon-label"
          className="grid grid-cols-6 gap-2 sm:grid-cols-8"
        >
          {visibleIcons.map((key) => {
            const Icon = getCategoryIcon(key);
            const selected = key === icon;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={key}
                title={key}
                onClick={() => setIcon(key)}
                className={`focus-visible:outline-accent flex aspect-square items-center justify-center rounded-full transition-colors focus-visible:outline-2 ${
                  selected
                    ? ""
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                }`}
                style={
                  selected
                    ? {
                        backgroundColor: colorValue,
                        color: "var(--color-page)",
                      }
                    : undefined
                }
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowAllIcons((v) => !v)}
          aria-expanded={showAllIcons}
          className="text-accent-ink mt-2 rounded-lg px-2 py-1 text-sm font-medium hover:bg-surface-2"
        >
          {showAllIcons
            ? "Show less"
            : `Show more (${CATEGORY_ICON_KEYS.length - VISIBLE_ICONS})`}
        </button>
      </div>

      <ErrorMessages error={error} />

      <button
        type="submit"
        className={`${primaryButtonClass} w-full py-3`}
        disabled={submitting}
      >
        {submitting ? "Saving…" : submitLabel}
      </button>

      {footer}
    </form>
  );
}
