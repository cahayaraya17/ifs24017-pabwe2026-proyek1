import { CalendarDays, ChartNoAxesColumn, Users } from 'lucide-react';

const PLACEHOLDER = '—';

const METRICS = [
  {
    key: 'event_count',
    icon: CalendarDays,
    color: 'purple',
    label: 'Total events',
    caption: 'Acara yang dikelola',
  },
  {
    key: 'registration_count',
    icon: Users,
    color: 'blue',
    label: 'Registrations',
    caption: 'Total pendaftaran aktif',
  },
  {
    key: 'published_count',
    icon: ChartNoAxesColumn,
    color: 'pink',
    label: 'Published',
    caption: 'Acara yang terlihat publik',
  },
];

export default function StatsCards({ stats }) {
  return (
    <div className="dashboard-stats">
      {METRICS.map(({ key, icon: Icon, color, label, caption }) => (
        <div className="metric-card" key={key}>
          <span className={`metric-icon ${color}`}>
            <Icon />
          </span>
          <span className="muted">{label}</span>
          <strong>{stats?.[key] ?? PLACEHOLDER}</strong>
          <small>{caption}</small>
        </div>
      ))}
    </div>
  );
}
