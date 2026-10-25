import { Plus } from 'lucide-react';

export default function DashboardHeader({ userName, onCreate }) {
  return (
    <div className="dashboard-heading">
      <div>
        <span className="eyebrow">CAMPUS CONTROL CENTER</span>
        <h1>
          Event <span className="gradient-text">dashboard.</span>
        </h1>
        <p className="muted">
          Selamat datang, {userName}. Kelola acara dan pantau partisipasi kampus.
        </p>
      </div>
      <button className="button" onClick={onCreate}>
        <Plus size={17} /> Create event
      </button>
    </div>
  );
}
