export function ComingSoon({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center text-slate-500">
      <p className="font-medium">{label} view</p>
      <p className="text-sm">Coming soon.</p>
    </div>
  );
}
