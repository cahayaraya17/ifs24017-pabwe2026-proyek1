import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData } from '../services/dashboardService';
import { deleteEvent, saveEvent } from '../services/eventService';
import { EMPTY_EVENT_FORM } from '../constants';
import { buildEventPayload, validateEventForm } from '../utils/validators';
import { toInputDateTime } from '../utils/date';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_EVENT_FORM);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchDashboardData();
      setStats(data.stats);
      setEvents(data.events);
      setCategories(data.categories);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = useCallback((field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  }, []);

  const startCreate = useCallback(() => {
    setEditing(null);
    setForm({ ...EMPTY_EVENT_FORM, category_id: categories[0]?.id || 1 });
    setShowForm(true);
  }, [categories]);

  const startEdit = useCallback((event) => {
    setEditing(event.id);
    setForm({
      ...event,
      start_at: toInputDateTime(event.start_at),
      end_at: toInputDateTime(event.end_at),
    });
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => setShowForm(false), []);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      setBusy(true);
      setError('');
      try {
        const validationError = validateEventForm(form);
        if (validationError) throw new Error(validationError);
        await saveEvent(buildEventPayload(form), editing);
        setShowForm(false);
        await load();
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat menyimpan acara.');
      } finally {
        setBusy(false);
      }
    },
    [form, editing, load],
  );

  const remove = useCallback(
    async (id) => {
      if (!window.confirm('Hapus atau arsipkan acara ini?')) return;
      try {
        await deleteEvent(id);
        await load();
      } catch (err) {
        setError(err.message);
      }
    },
    [load],
  );

  return {
    stats,
    events,
    categories,
    error,
    form,
    editing,
    showForm,
    busy,
    updateField,
    startCreate,
    startEdit,
    closeForm,
    submit,
    remove,
  };
}
