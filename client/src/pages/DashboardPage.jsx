import { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import EventFormModal from '../components/dashboard/EventFormModal';
import EventsTable from '../components/dashboard/EventsTable';
import StatsCards from '../components/dashboard/StatsCards';
import { useDashboardData } from '../hooks/useDashboardData';
import { deleteEvent, saveEvent } from '../services/eventService';
import { buildEventPayload, createEmptyEventForm, toEventFormValues } from '../utils/eventForm';

export default function DashboardPage({ user }) {
  const { stats, events, categories, error, setError, reload } = useDashboardData();
  const [form, setForm] = useState(createEmptyEventForm());
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  function startCreate() {
    setEditingId(null);
    setForm(createEmptyEventForm(categories));
    setShowForm(true);
  }

  function startEdit(event) {
    setEditingId(event.id);
    setForm(toEventFormValues(event));
    setShowForm(true);
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    setBusy(true);
    setError('');

    try {
      await saveEvent(editingId, buildEventPayload(form));
      setShowForm(false);
      await reload();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan acara.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus atau arsipkan acara ini?')) return;

    try {
      await deleteEvent(id);
      await reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container dashboard-page">
      <DashboardHeader userName={user?.name} onCreate={startCreate} />

      {error && <div className="form-error dashboard-error">{error}</div>}

      <StatsCards stats={stats} />

      {showForm && (
        <EventFormModal
          form={form}
          onChange={setForm}
          categories={categories}
          isEditing={Boolean(editingId)}
          busy={busy}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      <EventsTable events={events} onEdit={startEdit} onDelete={handleDelete} />
    </main>
  );
}
