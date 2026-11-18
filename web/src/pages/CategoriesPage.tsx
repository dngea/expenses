import { useState } from 'react';
import { getCategories } from '../api/categories';
import { AddButton } from '../components/AddButton';
import { CategoryForm } from '../components/CategoryForm';
import { CategoryIcon } from '../components/CategoryIcon';
import { ErrorMessages } from '../components/ErrorMessages';
import { Sheet } from '../components/Sheet';
import { CATEGORY_COLOR_KEYS, categoryColors } from '../lib/categoryColors';
import { useAsync } from '../lib/useAsync';

export function CategoriesPage() {
  const categories = useAsync(getCategories, []);
  const [formOpen, setFormOpen] = useState(false);

  const list = categories.data ?? [];
  const colorOf = categoryColors(list);
  // Suggest the first color no category uses yet.
  const usedColors = new Set(list.map((c) => c.color));
  const nextColor = CATEGORY_COLOR_KEYS.find((k) => !usedColors.has(k)) ?? 'blue';

  function handleCreated() {
    setFormOpen(false);
    categories.reload();
  }

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-xl font-semibold">Categories</h2>

      {categories.error ? (
        <ErrorMessages error={categories.error} />
      ) : categories.loading && !categories.data ? (
        <p className="text-ink-muted">Loading…</p>
      ) : list.length === 0 ? (
        <p className="py-8 text-center text-ink-muted">No categories yet. Tap + to create one.</p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl bg-surface ring-1 ring-line">
          {list.map((c) => (
            <li key={c.id} className="flex items-center gap-3 px-4 py-3">
              <CategoryIcon icon={c.icon} color={colorOf(c.id)} size="sm" />
              <span className="truncate">{c.name}</span>
            </li>
          ))}
        </ul>
      )}

      <AddButton label="Add category" onClick={() => setFormOpen(true)} />

      <Sheet title="New category" open={formOpen} onClose={() => setFormOpen(false)}>
        <CategoryForm onCreated={handleCreated} initialColor={nextColor} />
      </Sheet>
    </div>
  );
}
