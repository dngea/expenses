import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { useAuth } from "./AuthContext";
import { ErrorMessages } from "../../shared/components/ErrorMessages";

export function AccountPage() {
  const { authState, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleLogout() {
    setLoggingOut(true);
    setError(undefined);
    try {
      await logout();
    } catch (err) {
      setError(err);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Account</h2>
      {authState.status === "authenticated" ? (
        <>
          <p className="rounded-lg border border-accent/30 bg-accent-soft p-3 text-sm text-accent-ink">
            You are logged in.
          </p>
          <ErrorMessages error={error} />
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full rounded-lg py-2 text-sm font-medium text-red-400 ring-1 ring-red-400/20 hover:bg-red-500/10 disabled:opacity-50"
          >
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
