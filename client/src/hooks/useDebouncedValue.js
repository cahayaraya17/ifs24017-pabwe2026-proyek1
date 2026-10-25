import { useEffect, useState } from 'react';

const DEFAULT_DELAY_MS = 300;

/** Menunda pembaruan nilai sampai pengguna berhenti mengubahnya selama `delay` milidetik. */
export function useDebouncedValue(value, delay = DEFAULT_DELAY_MS) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
