import { CalendarDays, GraduationCap, ShieldCheck } from 'lucide-react';

const ROLE_OPTIONS = [
  { role: 'student', label: 'Mahasiswa', icon: GraduationCap },
  { role: 'organizer', label: 'Organizer', icon: CalendarDays },
  { role: 'admin', label: 'Admin', icon: ShieldCheck },
];

export default function RolePicker({ selectedRole, onChoose }) {
  return (
    <div className="role-picker" aria-label="Pilih jenis akun">
      {ROLE_OPTIONS.map(({ role, label, icon: Icon }) => (
        <button
          key={role}
          type="button"
          className={selectedRole === role ? 'role-option selected' : 'role-option'}
          aria-pressed={selectedRole === role}
          onClick={() => onChoose(role)}
        >
          <Icon size={18} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
