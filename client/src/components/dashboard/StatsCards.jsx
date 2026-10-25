import { CalendarDays, ChartNoAxesColumn, Users } from 'lucide-react';

function MetricCard({ icon: Icon, tone, label, value, caption }) {
  return (
    <div className="metric-card">
      <span className={`metric-icon ${tone}`}>
        <Icon />
      </span>
      <span className="muted">{label}</span>
      <strong>{value ?? '—'}</strong>
      <small>{caption}</small>
    </div>
  );
}

export default function StatsCards({ stats }) {
  return (
    <div className="dashboard-stats">
      <MetricCard
        icon={CalendarDays}
        tone="purple"
        label="Total events"
        value={stats?.event_count}
        caption="Acara yang dikelola"
      />
      <MetricCard
        icon={Users}
        tone="blue"
        label="Registrations"
        value={stats?.registration_count}
        caption="Total pendaftaran aktif"
      />
      <MetricCard
        icon={ChartNoAxesColumn}
        tone="pink"
        label="Published"
        value={stats?.published_count}
        caption="Acara yang terlihat publik"
      />
    </div>
  );
}
