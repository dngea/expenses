export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-page shadow-lg shadow-accent/20 hover:bg-accent-ink active:scale-95"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
