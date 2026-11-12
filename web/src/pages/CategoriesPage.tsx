import { useState, type FormEvent } from 'react';
import { createCategory, getCategories } from '../api/categories';
import { ErrorMessages } from '../components/ErrorMessages';
import { inputClass, primaryButtonClass } from '../components/ui';
import { useAsync } from '../lib/useAsync';

export function CategoriesPage() {
  const categories = useAsync(getCategories, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Categories</h2>
      <NewCategoryForm onCreated={categories.reload} />

      {categories.error ? (
        <ErrorMessages error={categories.error} />
      ) : categories.loading && !categories.data ? (
        <p className="text-slate-500">Loading…</p>
      ) : categories.data?.length === 0 ? (
        <p className="py-8 text-center text-slate-500">No categories yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {categories.data?.map((c) => (
            <li key={c.id} className="px-4 py-3">{c.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NewCategoryForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(undefined);
    try {
      await createCategory(name.trim());
      setName('');
      onCreated();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          className={inputClass}
          placeholder="New category name"
          aria-label="New category name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className={primaryButtonClass} disabled={submitting}>
          Add
        </button>
      </div>
      <ErrorMessages error={error} />
    </form>
  );
}
