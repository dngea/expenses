import { useState, type FormEvent } from 'react';
import { login, type LoginResponse } from '../api/auth';
import { ErrorMessages } from './ErrorMessages';
import { inputClass, labelClass, primaryButtonClass } from './ui';

export function LoginForm({ onLoggedIn }: { onLoggedIn: (result: LoginResponse) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(undefined);
    try {
      const result = await login(email, password);
      setPassword('');
      onLoggedIn(result);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <ErrorMessages error={error} />

      <button type="submit" className={`${primaryButtonClass} w-full py-3`} disabled={submitting}>
        {submitting ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  );
}
