import { useCallback, useEffect, useState } from 'react';
import { getDashboardStats, listCategories } from '../services/dashboardService';
import { listManagedEvents } from '../services/eventService';

/** Data dashboard pengelola: statistik, daftar acara, dan kategori. */
export function useDashboardData() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      const [statsData, eventsData, categoriesData] = await Promise.all([
        getDashboardStats(),
        listManagedEvents(),
        listCategories(),
      ]);

      setStats(statsData.stats);
      setEvents(eventsData.events || []);
      setCategories(categoriesData.categories || []);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { stats, events, categories, error, setError, reload };
}
