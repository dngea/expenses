import { useState, type FormEvent } from 'react';
import { getCategories } from '../api/categories';
import { createExpense } from '../api/expenses';
import { todayString } from '../lib/dates';
import { useAsync } from '../lib/useAsync';
import { ErrorMessages } from './ErrorMessages';
import { inputClass, labelClass, primaryButtonClass } from './ui';

export function ExpenseForm({ onCreated }: { onCreated: () => void }) {
  const categories = useAsync(getCategories, []);

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [spentAt, setSpentAt] = useState(todayString);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(undefined);
    try {
      await createExpense({
        // Accept "12,50" as well as "12.50". Validation (positive, 2 decimals) is done by the backend.
        amount: Number(amount.replace(',', '.')),
        category_id: Number(categoryId),
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
        <label htmlFor="amount" className={labelClass}>Amount (€)</label>
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
        <label htmlFor="category" className={labelClass}>Category</label>
        <select
          id="category"
          className={inputClass}
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={categories.loading}
        >
          <option value="" disabled>
            {categories.loading ? 'Loading…' : 'Select a category'}
          </option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {categories.data?.length === 0 && (
          <p className="mt-1 text-sm text-slate-500">No categories yet. Create one in the menu first.</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Description (optional)</label>
        <input
          id="description"
          className={inputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="spentAt" className={labelClass}>Date</label>
        <input
          id="spentAt"
          type="date"
          className={inputClass}
          required
          value={spentAt}
          onChange={(e) => setSpentAt(e.target.value)}
        />
      </div>

      <ErrorMessages error={categories.error} />
      <ErrorMessages error={error} />

      <button type="submit" className={`${primaryButtonClass} w-full py-3`} disabled={submitting}>
        {submitting ? 'Saving…' : 'Save expense'}
      </button>
    </form>
  );
}
