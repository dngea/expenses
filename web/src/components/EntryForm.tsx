import { useState, type FormEvent } from "react";
import type { ModeConfig } from "../lib/mode";
import { todayString } from "../lib/dates";
import { useAsync } from "../lib/useAsync";
import { CategoryPicker } from "./CategoryPicker";
import { ErrorMessages } from "./ErrorMessages";
import { inputClass, labelClass, primaryButtonClass } from "./ui";

/** Form for a new expense or income; the API calls and texts come from `config`. */
export function EntryForm({
  config,
  onCreated,
}: {
  config: ModeConfig;
  onCreated: () => void;
}) {
  const categories = useAsync(config.getCategories, [config]);

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryMissing, setCategoryMissing] = useState(false);
  const [description, setDescription] = useState("");
  const [spentAt, setSpentAt] = useState(todayString);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (categoryId === null) {
      setCategoryMissing(true);
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      await config.create({
        // Accept "12,50" as well as "12.50". Validation (positive, 2 decimals) is done by the backend.
        amount: Number(amount.replace(",", ".")),
        category_id: categoryId,
        spent_at: spentAt,
        description: description.trim() || undefined,
      });
      onCreated();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className={labelClass}>
          Amount (€)
        </label>
        <input
          id="amount"
          className={inputClass}
          inputMode="decimal"
          placeholder="0.00"
          required
          autoFocus
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div>
        <p id="category-label" className={labelClass}>
          Category
        </p>
        {categories.loading && !categories.data ? (
          <p className="text-ink-muted py-4 text-center text-sm">Loading…</p>
        ) : (
          <CategoryPicker
            categories={categories.data ?? []}
            value={categoryId}
            onChange={(id) => {
              setCategoryId(id);
              setCategoryMissing(false);
            }}
            labelledBy="category-label"
          />
        )}
        {categoryMissing && (
          <p role="alert" className="mt-1 text-sm text-red-300">
            Choose a category.
          </p>
        )}
        {categories.data?.length === 0 && (
          <p className="text-ink-muted mt-1 text-sm">
            {config.noCategoriesText}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="spentAt" className={labelClass}>
          Date
        </label>
        <input
          id="spentAt"
          type="date"
          className={inputClass}
          required
          value={spentAt}
          onChange={(e) => setSpentAt(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description (optional)
        </label>
        <input
          id="description"
          className={inputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <ErrorMessages error={categories.error} />
      <ErrorMessages error={error} />

      <button
        type="submit"
        className={`${primaryButtonClass} w-full py-3`}
        disabled={submitting}
      >
        {submitting ? "Saving…" : config.saveLabel}
      </button>
    </form>
  );
}
