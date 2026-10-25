import { useCallback, useEffect, useState } from 'react';
import { cancelRegistration, listMyRegistrations } from '../services/registrationService';

/** Daftar pendaftaran milik pengguna beserta aksi pembatalan. */
export function useMyRegistrations() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await listMyRegistrations();
      setItems(data.registrations || []);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(id) {
    try {
      await cancelRegistration(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return { items, error, cancel };
}
