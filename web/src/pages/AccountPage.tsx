import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

export function AccountPage() {
  // const [loggedIn, setLoggedIn] = useState(false);

  const { authState } = useAuth();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Account</h2>
      {authState.status === "authenticated" ? (
        <p className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
          You are logged in.
        </p>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
