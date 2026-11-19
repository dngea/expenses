import { useState } from "react";
import { Outlet } from "react-router";
import { Drawer } from "./Drawer";
import { useAuth } from "../features/auth/AuthContext";

import { LoginForm } from "../features/auth/LoginForm";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { authState } = useAuth();

  console.log("authSate >>", authState);

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col">
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-surface px-2 pt-[env(safe-area-inset-top)] text-ink border-b border-line">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="rounded-full p-3 hover:bg-surface-2"
          aria-label="Open menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect y="3" width="20" height="2" rx="1" />
            <rect y="9" width="20" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-accent-ink">Expenses</h1>
      </header>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1 p-4">
        {authState.status === "authenticated" && <Outlet />}
        {authState.status === "unauthenticated" && <LoginForm />}
        {authState.status === "loading" && <p>Loading....</p>}
      </main>
    </div>
  );
}
