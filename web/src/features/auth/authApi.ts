import { apiFetch } from "../../shared/api/client";

type UserResponse = {
  id: number;
  username: string;
  email: string;
};

export function login(email: string, password: string): Promise<void> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

/** The backend clears the httpOnly `token` cookie (JS can't delete it itself). */
export function logout(): Promise<void> {
  return apiFetch("/auth/logout", { method: "POST" });
}

export function fetchMe() {
  return apiFetch<UserResponse>("/auth/me", { method: "GET" });
}
