import type { Category } from '../api/types';
import { categoryColors } from '../lib/categoryColors';
import { CategoryIcon } from './CategoryIcon';

interface CategoryPickerProps {
  categories: Category[];
  value: number | null;
  onChange: (categoryId: number) => void;
  labelledBy: string;
}

/** Grid of round category buttons (icon + color + name). Behaves as a radio group. */
export function CategoryPicker({ categories, value, onChange, labelledBy }: CategoryPickerProps) {
  const colorOf = categoryColors(categories);

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid grid-cols-4 gap-x-2 gap-y-3">
      {categories.map((category) => {
        const selected = category.id === value;
        return (
          <button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(category.id)}
            className="group flex min-w-0 flex-col items-center gap-1.5 rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span
              className={`rounded-full transition-transform group-active:scale-95 ${
                selected ? 'scale-105 ring-2 ring-ink ring-offset-2 ring-offset-surface' : ''
              }`}
            >
              <CategoryIcon icon={category.icon} color={colorOf(category.id)} filled={selected} />
            </span>
            <span className={`w-full truncate text-center text-xs ${selected ? 'font-medium text-ink' : 'text-ink-muted'}`}>
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
