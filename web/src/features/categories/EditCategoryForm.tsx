import { useState } from "react";
import type { Category, MovementType } from "../../shared/api/types";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import { ErrorMessages } from "../../shared/components/ErrorMessages";
import { countMovementsInCategory } from "../transactions/movementsApi";
import { deleteCategory, updateCategory } from "./categoriesApi";
import { CategoryForm } from "./CategoryForm";
import type { CategoryColorKey } from "./categoryColors";
import { DEFAULT_CATEGORY_ICON, isCategoryIconKey } from "./categoryIcons";

interface EditCategoryFormProps {
  category: Category;
  /** Expense or income category; needed to count its movements before deleting. */
  type: MovementType;
  /**
   * The color the category is shown with right now. For categories without a saved color
   * this is the automatic one, so the form starts with what the user actually sees.
   */
  currentColor: CategoryColorKey;
  /** Called after saving or deleting. */
  onSaved: () => void;
}

export function EditCategoryForm({
  category,
  type,
  currentColor,
  onSaved,
}: EditCategoryFormProps) {
  return (
    <CategoryForm
      initialValues={{
        name: category.name,
        color: currentColor,
        icon: isCategoryIconKey(category.icon) ? category.icon : DEFAULT_CATEGORY_ICON,
      }}
      submitLabel="Save changes"
      onSubmit={(values) => updateCategory(category.id, values)}
      onDone={onSaved}
      autoFocusName={false}
      footer={<DeleteCategoryButton category={category} type={type} onDeleted={onSaved} />}
    />
  );
}

/**
 * Delete button + confirmation modal. Before asking, it checks whether the category has
 * expenses: if so, the modal warns that they will be deleted too and sends ?force=true.
 */
function DeleteCategoryButton({
  category,
  type,
  onDeleted,
}: {
  category: Category;
  type: MovementType;
  onDeleted: () => void;
}) {
  /** null = modal closed; otherwise the number of expenses in the category. */
  const [expenseCount, setExpenseCount] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<unknown>();
  const [dialogError, setDialogError] = useState<unknown>();

  async function openDialog() {
    setChecking(true);
    setError(undefined);
    setDialogError(undefined);
    try {
      setExpenseCount(await countMovementsInCategory(type, category.id));
    } catch (err) {
      setError(err);
    } finally {
      setChecking(false);
    }
  }

  async function handleConfirm() {
    if (expenseCount === null) return;
    setDeleting(true);
    setDialogError(undefined);
    try {
      await deleteCategory(category.id, { force: expenseCount > 0 });
      setExpenseCount(null);
      onDeleted();
    } catch (err) {
      setDialogError(err);
    } finally {
      setDeleting(false);
    }
  }

  const hasExpenses = (expenseCount ?? 0) > 0;
  const expensesLabel = `${expenseCount} ${expenseCount === 1 ? "expense" : "expenses"}`;

  return (
    <div className="space-y-2">
      <ErrorMessages error={error} />
      <button
        type="button"
        onClick={openDialog}
        disabled={checking}
        className="w-full rounded-lg py-3 font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
      >
        {checking ? "Checking…" : "Delete category"}
      </button>

      <ConfirmDialog
        open={expenseCount !== null}
        title={hasExpenses ? "Delete category and its expenses?" : "Delete category?"}
        confirmLabel={hasExpenses ? `Delete category and ${expensesLabel}` : "Delete"}
        danger
        busy={deleting}
        error={dialogError}
        onConfirm={handleConfirm}
        onCancel={() => setExpenseCount(null)}
      >
        {hasExpenses ? (
          <p>
            <strong className="text-ink">“{category.name}”</strong> has{" "}
            <strong className="text-ink">{expensesLabel}</strong>. Deleting the
            category will also delete all of them. This cannot be undone.
          </p>
        ) : (
          <p>
            Are you sure you want to delete{" "}
            <strong className="text-ink">“{category.name}”</strong>?
          </p>
        )}
      </ConfirmDialog>
    </div>
  );
}
