import { CalendarDays, TrendingUp, Users } from 'lucide-react';

const STATS = [
  { icon: CalendarDays, tone: 'purple', title: 'Discover', caption: 'Events worth your time' },
  { icon: Users, tone: 'blue', title: 'Connect', caption: 'Meet your community' },
  { icon: TrendingUp, tone: 'pink', title: 'Grow', caption: 'Make every moment count' },
];

export default function StatsStrip() {
  return (
    <section className="stats-strip container">
      {STATS.map(({ icon: Icon, tone, title, caption }) => (
        <div key={title}>
          <span className={`stat-icon ${tone}`}>
            <Icon size={18} />
          </span>
          <span>
            <strong>{title}</strong>
            <small>{caption}</small>
          </span>
        </div>
      ))}
    </section>
  );
}
