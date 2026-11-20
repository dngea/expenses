import type { MovementType } from "../../shared/api/types";
import { createCategory } from "./categoriesApi";
import { CategoryForm } from "./CategoryForm";
import type { CategoryColorKey } from "./categoryColors";
import { DEFAULT_CATEGORY_ICON } from "./categoryIcons";

interface NewCategoryFormProps {
  /** Whether this is an expense or an income category. */
  type: MovementType;
  onCreated: () => void;
  /** Preselected color, e.g. the first one no category uses yet. */
  initialColor?: CategoryColorKey;
}

export function NewCategoryForm({
  type,
  onCreated,
  initialColor = "blue",
}: NewCategoryFormProps) {
  return (
    <CategoryForm
      initialValues={{ name: "", color: initialColor, icon: DEFAULT_CATEGORY_ICON }}
      submitLabel="Save category"
      onSubmit={(values) => createCategory(type, values)}
      onDone={onCreated}
    />
  );
}
