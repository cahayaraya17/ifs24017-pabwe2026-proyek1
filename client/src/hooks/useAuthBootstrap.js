import { useEffect, useState } from 'react';
import { getToken, setToken } from '../services/api';
import { fetchCurrentUser } from '../services/authService';

export function useAuthBootstrap() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setReady(true);
      return;
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  return { user, setUser, ready };
}
