import { useState } from "react";
import type { Expense } from "../../shared/api/types";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import { formatEur } from "../../shared/lib/format";
import { EntryForm } from "./EntryForm";
import type { ModeConfig } from "./mode";

interface EditEntryFormProps {
  config: ModeConfig;
  entry: Expense;
  /** Called after saving or deleting. */
  onSaved: () => void;
}

export function EditEntryForm({ config, entry, onSaved }: EditEntryFormProps) {
  return (
    <EntryForm
      config={config}
      initialValues={{
        amount: entry.amount,
        categoryId: entry.category_id,
        spentAt: entry.spent_at,
        description: entry.description ?? "",
      }}
      submitLabel="Save changes"
      onSubmit={(values) => config.update(entry.id, values)}
      onDone={onSaved}
      autoFocusAmount={false}
      footer={<DeleteEntryButton config={config} entry={entry} onDeleted={onSaved} />}
    />
  );
}

/** Delete button + confirmation modal (same pattern as deleting a category). */
function DeleteEntryButton({
  config,
  entry,
  onDeleted,
}: {
  config: ModeConfig;
  entry: Expense;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleConfirm() {
    setDeleting(true);
    setError(undefined);
    try {
      await config.remove(entry.id);
      setOpen(false);
      onDeleted();
    } catch (err) {
      setError(err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(undefined);
          setOpen(true);
        }}
        className="w-full rounded-lg py-3 font-medium text-red-400 hover:bg-red-500/10"
      >
        Delete {config.noun}
      </button>

      <ConfirmDialog
        open={open}
        title={`Delete ${config.noun}?`}
        confirmLabel="Delete"
        danger
        busy={deleting}
        error={error}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-ink">
            {entry.description || entry.category_name}
          </strong>{" "}
          ({formatEur(entry.amount)})? This cannot be undone.
        </p>
      </ConfirmDialog>
    </>
  );
}
