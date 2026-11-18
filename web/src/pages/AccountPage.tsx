import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

export function AccountPage() {
  // const [loggedIn, setLoggedIn] = useState(false);

  const { authState } = useAuth();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Account</h2>
      {authState.status === "authenticated" ? (
        <p className="rounded-lg border border-accent/30 bg-accent-soft p-3 text-sm text-accent-ink">
          You are logged in.
        </p>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
