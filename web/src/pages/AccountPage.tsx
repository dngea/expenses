import { useState } from 'react';
import type { LoginResponse } from '../api/auth';
import { LoginForm } from '../components/LoginForm';

export function AccountPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLoggedIn(result: LoginResponse) {
    // TODO(auth): store `result.access_token` and send it with requests in src/api/client.ts.
    void result;
    setLoggedIn(true);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Account</h2>
      {loggedIn ? (
        <p className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
          You are logged in.
        </p>
      ) : (
        <LoginForm onLoggedIn={handleLoggedIn} />
      )}
    </div>
  );
}
