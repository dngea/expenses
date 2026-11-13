import { apiFetch } from "./client";

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

export function fetchMe() {
  return apiFetch<UserResponse>("/auth/me", { method: "GET" });
}
