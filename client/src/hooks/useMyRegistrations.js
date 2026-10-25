import { useCallback, useEffect, useState } from 'react';
import { cancelRegistration, listMyRegistrations } from '../services/registrationService';

export function useMyRegistrations() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await listMyRegistrations());
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = useCallback(
    async (id) => {
      try {
        await cancelRegistration(id);
        await load();
      } catch (err) {
        setError(err.message);
      }
    },
    [load],
  );

  return { items, error, cancel };
}
