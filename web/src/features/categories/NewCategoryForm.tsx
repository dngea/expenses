import { createCategory } from "./categoriesApi";
import { CategoryForm } from "./CategoryForm";
import type { CategoryColorKey } from "./categoryColors";
import { DEFAULT_CATEGORY_ICON } from "./categoryIcons";

interface NewCategoryFormProps {
  onCreated: () => void;
  /** Preselected color, e.g. the first one no category uses yet. */
  initialColor?: CategoryColorKey;
}

export function NewCategoryForm({
  onCreated,
  initialColor = "blue",
}: NewCategoryFormProps) {
  return (
    <CategoryForm
      initialValues={{ name: "", color: initialColor, icon: DEFAULT_CATEGORY_ICON }}
      submitLabel="Save category"
      onSubmit={createCategory}
      onDone={onCreated}
    />
  );
}
