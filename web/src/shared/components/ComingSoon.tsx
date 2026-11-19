export function ComingSoon({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-line p-8 text-center text-ink-muted">
      <p className="font-medium">{label} view</p>
      <p className="text-sm">Coming soon.</p>
    </div>
  );
}
