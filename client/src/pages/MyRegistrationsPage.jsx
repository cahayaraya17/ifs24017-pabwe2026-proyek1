import { Link } from 'react-router-dom';
import RegistrationItem from '../components/events/RegistrationItem';
import StatePanel from '../components/common/StatePanel';
import { ROUTES } from '../constants/routes';
import { useMyRegistrations } from '../hooks/useMyRegistrations';

export default function MyRegistrationsPage() {
  const { items, error, cancel } = useMyRegistrations();

  function handleCancel(id) {
    if (window.confirm('Batalkan pendaftaran acara ini?')) cancel(id);
  }

  return (
    <main className="container page-pad">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR CAMPUS JOURNEY</span>
          <h1>
            My <span className="gradient-text">events.</span>
          </h1>
          <p className="muted">Semua acara yang kamu ikuti ada di sini.</p>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      {items.length === 0 && !error ? (
        <StatePanel>
          Kamu belum mendaftar acara. <Link to={ROUTES.HOME}>Jelajahi acara</Link>
        </StatePanel>
      ) : (
        <div className="registration-list">
          {items.map((registration) => (
            <RegistrationItem
              key={registration.id}
              registration={registration}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </main>
  );
}
