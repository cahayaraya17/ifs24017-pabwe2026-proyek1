import { CalendarDays, TrendingUp, Users } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: CalendarDays, color: 'purple', title: 'Discover', caption: 'Events worth your time' },
  { icon: Users, color: 'blue', title: 'Connect', caption: 'Meet your community' },
  { icon: TrendingUp, color: 'pink', title: 'Grow', caption: 'Make every moment count' },
];

export default function StatsStrip() {
  return (
    <section className="stats-strip container">
      {HIGHLIGHTS.map(({ icon: Icon, color, title, caption }) => (
        <div key={title}>
          <span className={`stat-icon ${color}`}>
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
