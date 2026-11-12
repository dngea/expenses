import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
  reload: () => void;
}

/**
 * Runs `load` on mount and whenever `deps` change. Pass `null` as `load` to skip loading.
 * Stale responses (from earlier deps) are ignored.
 */
export function useAsync<T>(load: (() => Promise<T>) | null, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(load !== null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!load) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(undefined);
    load()
      .then((result) => active && setData(result))
      .catch((err: unknown) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [...deps, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  return { data, error, loading, reload };
}
