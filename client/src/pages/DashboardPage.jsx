import { Plus } from 'lucide-react';
import EventFormModal from '../components/dashboard/EventFormModal';
import EventsTable from '../components/dashboard/EventsTable';
import StatsCards from '../components/dashboard/StatsCards';
import { useDashboard } from '../hooks/useDashboard';

export default function DashboardPage({ user }) {
  const dashboard = useDashboard();

  return (
    <main className="container dashboard-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">CAMPUS CONTROL CENTER</span>
          <h1>
            Event <span className="gradient-text">dashboard.</span>
          </h1>
          <p className="muted">
            Selamat datang, {user?.name}. Kelola acara dan pantau partisipasi kampus.
          </p>
        </div>
        <button className="button" onClick={dashboard.startCreate}>
          <Plus size={17} /> Create event
        </button>
      </div>

      {dashboard.error && <div className="form-error dashboard-error">{dashboard.error}</div>}

      <StatsCards stats={dashboard.stats} />

      {dashboard.showForm && (
        <EventFormModal
          form={dashboard.form}
          categories={dashboard.categories}
          editing={dashboard.editing}
          busy={dashboard.busy}
          onChange={dashboard.updateField}
          onSubmit={dashboard.submit}
          onClose={dashboard.closeForm}
        />
      )}

      <EventsTable
        events={dashboard.events}
        onEdit={dashboard.startEdit}
        onDelete={dashboard.remove}
      />
    </main>
  );
}
