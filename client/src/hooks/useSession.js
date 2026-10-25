import { useEffect, useState } from 'react';
import { getToken, setToken } from '../services/api';
import { fetchCurrentUser } from '../services/authService';

/** Memulihkan sesi login dari token yang tersimpan saat aplikasi dibuka. */
export function useSession() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setReady(true);
      return;
    }

    fetchCurrentUser()
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  return { user, setUser, ready };
}
