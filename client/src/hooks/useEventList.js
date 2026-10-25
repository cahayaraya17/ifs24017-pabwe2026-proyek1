import { useEffect, useState } from 'react';
import { ALL_CATEGORIES } from '../constants/events';
import { listEvents } from '../services/eventService';

function buildQueryString(query, category) {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  if (category !== ALL_CATEGORIES) params.set('category', category);
  return params.toString();
}

/** Mengambil daftar acara publik setiap kali kata kunci atau kategori berubah. */
export function useEventList({ query, category }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    listEvents(buildQueryString(query, category))
      .then((data) => active && setEvents(data.events || []))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [query, category]);

  return { events, loading, error };
}
