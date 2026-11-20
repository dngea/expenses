import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Category } from '../../shared/api/types';
import { AddButton } from '../../shared/components/AddButton';
import { ErrorMessages } from '../../shared/components/ErrorMessages';
import { Sheet } from '../../shared/components/Sheet';
import { useAsync } from '../../shared/lib/useAsync';
import { MODES } from '../transactions/mode';
import { ModeSelector } from '../transactions/ModeSelector';
import { useTransactionParams } from '../transactions/useTransactionParams';
import { getCategories } from './categoriesApi';
import { CATEGORY_COLOR_KEYS, CATEGORY_COLORS, categoryColorKeys } from './categoryColors';
import { CategoryIcon } from './CategoryIcon';
import { EditCategoryForm } from './EditCategoryForm';
import { NewCategoryForm } from './NewCategoryForm';

export function CategoriesPage() {
  // Expense and income categories are separate lists; the ?view= param picks which one.
  const { mode, setMode } = useTransactionParams();
  const { type } = MODES[mode];
  const categories = useAsync(() => getCategories(type), [type]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const list = categories.data ?? [];
  const colorKeyOf = categoryColorKeys(list);
  // Suggest the first color no category uses yet.
  const usedColors = new Set(list.map((c) => colorKeyOf(c.id)));
  const nextColor = CATEGORY_COLOR_KEYS.find((k) => !usedColors.has(k)) ?? 'blue';

  function handleSaved() {
    setCreating(false);
    setEditing(null);
    categories.reload();
  }

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-xl font-semibold">Categories</h2>

      <ModeSelector value={mode} onChange={setMode} />

      {categories.error ? (
        <ErrorMessages error={categories.error} />
      ) : categories.loading && !categories.data ? (
        <p className="text-ink-muted">Loading…</p>
      ) : list.length === 0 ? (
        <p className="py-8 text-center text-ink-muted">No categories yet. Tap + to create one.</p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
          {list.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setEditing(c)}
                aria-label={`Edit ${c.name}`}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none"
              >
                <CategoryIcon icon={c.icon} color={CATEGORY_COLORS[colorKeyOf(c.id)]} size="sm" />
                <span className="flex-1 truncate">{c.name}</span>
                <ChevronRight size={18} className="text-ink-faint" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AddButton label="Add category" onClick={() => setCreating(true)} />

      <Sheet title="New category" open={creating} onClose={() => setCreating(false)}>
        <NewCategoryForm type={type} onCreated={handleSaved} initialColor={nextColor} />
      </Sheet>

      <Sheet title="Edit category" open={editing !== null} onClose={() => setEditing(null)}>
        {editing && (
          <EditCategoryForm
            key={editing.id}
            category={editing}
            type={type}
            currentColor={colorKeyOf(editing.id)}
            onSaved={handleSaved}
          />
        )}
      </Sheet>
    </div>
  );
}
