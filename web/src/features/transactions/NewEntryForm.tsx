import { EMPTY_ENTRY, EntryForm } from "./EntryForm";
import type { ModeConfig } from "./mode";

export function NewEntryForm({
  config,
  onCreated,
}: {
  config: ModeConfig;
  onCreated: () => void;
}) {
  return (
    <EntryForm
      config={config}
      initialValues={EMPTY_ENTRY()}
      submitLabel={config.saveLabel}
      onSubmit={config.create}
      onDone={onCreated}
    />
  );
}
