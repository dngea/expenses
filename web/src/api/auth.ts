import { apiFetch } from './client';

export interface LoginResponse {
  access_token: string;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } });
}
