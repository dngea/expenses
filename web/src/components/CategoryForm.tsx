import { useState, type FormEvent } from "react";
import { createCategory } from "../api/categories";
import {
  CATEGORY_COLOR_KEYS,
  CATEGORY_COLORS,
  type CategoryColorKey,
} from "../lib/categoryColors";
import {
  CATEGORY_ICON_KEYS,
  DEFAULT_CATEGORY_ICON,
  getCategoryIcon,
  type CategoryIconKey,
} from "../lib/categoryIcons";
import { CategoryIcon } from "./CategoryIcon";
import { ErrorMessages } from "./ErrorMessages";
import { labelClass, primaryButtonClass } from "./ui";

interface CategoryFormProps {
  onCreated: () => void;
  /** Preselected color, e.g. the first one no category uses yet. */
  initialColor?: CategoryColorKey;
}

export function CategoryForm({
  onCreated,
  initialColor = "blue",
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<CategoryColorKey>(initialColor);
  const [icon, setIcon] = useState<CategoryIconKey>(DEFAULT_CATEGORY_ICON);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  const colorValue = CATEGORY_COLORS[color];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(undefined);
    try {
      await createCategory({ name: name.trim(), color, icon });
      onCreated();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Live preview — the name is typed directly into it. */}
      <div className="flex items-center gap-3 rounded-xl bg-surface-2 p-3 ring-1 ring-transparent focus-within:ring-accent">
        <CategoryIcon icon={icon} color={colorValue} size="lg" />
        <input
          id="category-name"
          aria-label="Name"
          placeholder="Category name"
          className="min-w-0 flex-1 bg-transparent text-lg font-medium text-ink placeholder:text-ink-faint focus:outline-none"
          required
          autoFocus
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
          {CATEGORY_ICON_KEYS.map((key) => {
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
      </div>

      <ErrorMessages error={error} />

      <button
        type="submit"
        className={`${primaryButtonClass} w-full py-3`}
        disabled={submitting}
      >
        {submitting ? "Saving…" : "Save category"}
      </button>
    </form>
  );
}
