import { useState, type ReactNode, type SyntheticEvent } from "react";
import type { NewExpense } from "../../shared/api/types";
import type { ModeConfig } from "./mode";
import { todayString } from "../../shared/lib/dates";
import { useAsync } from "../../shared/lib/useAsync";
import { CategoryPicker } from "../categories/CategoryPicker";
import { ErrorMessages } from "../../shared/components/ErrorMessages";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
} from "../../shared/components/ui";

export interface EntryFormValues {
  amount: string;
  categoryId: number | null;
  spentAt: string;
  description: string;
}

export const EMPTY_ENTRY = (): EntryFormValues => ({
  amount: "",
  categoryId: null,
  spentAt: todayString(),
  description: "",
});

interface EntryFormProps {
  /** Expenses or income: where the categories come from. */
  config: ModeConfig;
  /** Values the fields start with (empty for "new", the entry's data for "edit"). */
  initialValues: EntryFormValues;
  submitLabel: string;
  /** Saves the values; throw to show the error in the form. */
  onSubmit: (entry: NewExpense) => Promise<unknown>;
  /** Called after a successful save. */
  onDone: () => void;
  /** Focus the amount on open. Off for editing, so the keyboard doesn't pop up on mobile. */
  autoFocusAmount?: boolean;
  /** Extra content under the submit button (e.g. the delete button when editing). */
  footer?: ReactNode;
}

/**
 * Shared form for creating and editing an expense or income. Use `NewEntryForm` or
 * `EditEntryForm` rather than this directly.
 */
export function EntryForm({
  config,
  initialValues,
  submitLabel,
  onSubmit,
  onDone,
  autoFocusAmount = true,
  footer,
}: EntryFormProps) {
  const categories = useAsync(config.getCategories, [config]);

  const [amount, setAmount] = useState(initialValues.amount);
  const [categoryId, setCategoryId] = useState<number | null>(initialValues.categoryId);
  const [categoryMissing, setCategoryMissing] = useState(false);
  const [description, setDescription] = useState(initialValues.description);
  const [spentAt, setSpentAt] = useState(initialValues.spentAt);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (categoryId === null) {
      setCategoryMissing(true);
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      await onSubmit({
        // Accept "12,50" as well as "12.50". Validation (positive, 2 decimals) is done by the backend.
        amount: Number(amount.replace(",", ".")),
        category_id: categoryId,
        spent_at: spentAt,
        // null clears an existing description when editing.
        description: description.trim() || null,
      });
      onDone();
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
          autoFocus={autoFocusAmount}
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
        {submitting ? "Saving…" : submitLabel}
      </button>

      {footer}
    </form>
  );
}
