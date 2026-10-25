import { useEffect, useState } from 'react';
import { listEvents } from '../services/eventService';

export function useEvents({ q, category }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    listEvents({ q, category })
      .then((data) => active && setEvents(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [q, category]);

  return { events, loading, error };
}
