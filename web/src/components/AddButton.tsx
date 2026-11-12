export function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add expense"
      className="fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-10 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-3xl text-white shadow-lg hover:bg-teal-700 active:scale-95"
    >
      +
    </button>
  );
}
