import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import React from "react";
import { fetchMe } from "../api/auth";
import { login as loginRequest } from "../api/auth";

type AuthState =
  | { status: "loading" }
  | {
      status: "authenticated";
      user: { id: number; username: string; email: string };
    }
  | { status: "unauthenticated" };

type AuthContextValue = {
  authState: AuthState;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  const refresh = useCallback(async () => {
    try {
      const user = await fetchMe();

      setState({ status: "authenticated", user });
    } catch {
      setState({ status: "unauthenticated" });
    }
  }, []);

  // si no usamos useCallBack, se recrea la función en cada renderizado. Por ello, cada componente que use useAuth se volverán a renderizar
  const login = useCallback(
    async (email: string, password: string) => {
      await loginRequest(email, password);
      await refresh();
    },
    [refresh],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return (
    <AuthContext value={{ authState: state, refresh, login }}>
      {children}
    </AuthContext>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside of a provider");
  }

  return context;
}
