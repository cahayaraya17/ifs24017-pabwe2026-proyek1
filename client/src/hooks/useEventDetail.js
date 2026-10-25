import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { getEvent, registerForEvent } from '../services/eventService';

/** Memuat detail acara dan menangani pendaftaran peserta. */
export function useEventDetail(id, user) {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then((data) => setEvent(data.event))
      .catch((err) => setError(err.message));
  }, [id]);

  async function register() {
    if (!user) {
      navigate(ROUTES.LOGIN, { state: { from: ROUTES.eventDetail(id) } });
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await registerForEvent(id);
      setMessage(result.message || 'Pendaftaran berhasil!');
      setEvent((previous) => ({
        ...previous,
        registered_count: (previous.registered_count || 0) + 1,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return { event, error, message, busy, register };
}
