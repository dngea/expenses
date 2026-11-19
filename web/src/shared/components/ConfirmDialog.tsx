import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ErrorMessages } from './ErrorMessages';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Red confirm button for destructive actions. */
  danger?: boolean;
  busy?: boolean;
  error?: unknown;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Centered confirmation modal. Stacks above sheets/drawers.
 * Rendered in a portal on <body>, so it is not inside the sheet's scroll container: otherwise
 * focusing its buttons would make the browser scroll the sheet underneath.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  danger = false,
  busy = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus "Cancel" on open (safe default for a destructive action) without scrolling anything.
  useEffect(() => {
    if (open) cancelRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Capture phase + stopPropagation: Escape closes only this dialog, not the sheet below it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      if (!busy) onCancel();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-[fade-in_150ms_ease-out] bg-black/70"
        onClick={busy ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-sm animate-[fade-in_150ms_ease-out] space-y-4 rounded-2xl bg-surface p-5 shadow-2xl ring-1 ring-line"
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold">
          {title}
        </h2>
        <div className="text-sm text-ink-muted">{children}</div>

        <ErrorMessages error={error} />

        <div className="flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-lg py-2.5 font-medium text-ink-muted ring-1 ring-line hover:bg-surface-2 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 rounded-lg px-3 py-2.5 font-medium disabled:opacity-50 ${
              danger ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-accent text-page hover:bg-accent-ink'
            }`}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
