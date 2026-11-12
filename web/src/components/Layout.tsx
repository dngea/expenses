import { useState } from 'react';
import { Outlet } from 'react-router';
import { Drawer } from './Drawer';

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-teal-700 px-2 pt-[env(safe-area-inset-top)] text-white shadow">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="rounded-full p-3 hover:bg-teal-600"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <rect y="3" width="20" height="2" rx="1" />
            <rect y="9" width="20" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Expenses</h1>
      </header>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
