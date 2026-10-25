import { Pencil, Trash2 } from 'lucide-react';
import { formatDateNumeric } from '../../utils/date';
import StatePanel from '../StatePanel';

function EventRow({ event, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <strong>{event.title}</strong>
        <small>
          {event.category_name} · {event.location}
        </small>
      </td>
      <td>{formatDateNumeric(event.start_at)}</td>
      <td>
        <span className={`status-badge status-${event.status}`}>{event.status}</span>
      </td>
      <td>
        {event.registered_count}/{event.capacity}
      </td>
      <td>
        <div className="table-actions">
          <button className="icon-button" title="Edit" onClick={() => onEdit(event)}>
            <Pencil size={16} />
          </button>
          <button className="icon-button danger" title="Delete" onClick={() => onDelete(event.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function EventsTable({ events, onEdit, onDelete }) {
  return (
    <section className="management-table">
      <div className="table-heading">
        <div>
          <h2>Your events</h2>
          <p className="muted">Kelola acara yang telah dibuat.</p>
        </div>
        <span className="table-count">{events.length} items</span>
      </div>

      {events.length === 0 ? (
        <StatePanel>Belum ada acara. Buat acara pertamamu!</StatePanel>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <EventRow key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
