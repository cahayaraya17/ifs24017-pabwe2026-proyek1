import { CalendarDays, GraduationCap, ShieldCheck } from 'lucide-react';
import { ROLES } from '../../constants/roles';

const ROLE_OPTIONS = [
  { role: ROLES.STUDENT, label: 'Mahasiswa', icon: GraduationCap },
  { role: ROLES.ORGANIZER, label: 'Organizer', icon: CalendarDays },
  { role: ROLES.ADMIN, label: 'Admin', icon: ShieldCheck },
];

/** Pintasan untuk mengisi form login dengan akun demo sesuai peran. */
export default function RolePicker({ selectedRole, onSelect }) {
  return (
    <div className="role-picker" aria-label="Pilih jenis akun">
      {ROLE_OPTIONS.map(({ role, label, icon: Icon }) => (
        <button
          key={role}
          type="button"
          className={selectedRole === role ? 'role-option selected' : 'role-option'}
          onClick={() => onSelect(role)}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
