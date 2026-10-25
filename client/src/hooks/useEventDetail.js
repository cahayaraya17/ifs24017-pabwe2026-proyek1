import { useCallback, useEffect, useState } from 'react';
import { getEvent, registerForEvent } from '../services/eventService';

export function useEventDetail(id) {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch((err) => setError(err.message));
  }, [id]);

  const register = useCallback(async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await registerForEvent(id);
      setMessage(result.message || 'Pendaftaran berhasil!');
      setEvent((old) => ({ ...old, registered_count: (old.registered_count || 0) + 1 }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }, [id]);

  return { event, error, message, busy, register };
}
