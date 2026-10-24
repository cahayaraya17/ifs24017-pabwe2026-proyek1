
import { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  LockKeyhole,
  Mail,
  UserRound,
  ShieldCheck,
  CalendarDays,
  GraduationCap,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api, setToken } from '../services/api';

export default function AuthPage({ mode, onAuthChange }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = mode === 'register';

  function chooseDemo(role) {
    setSelectedRole(role);

    const demos = {
      student: 'student@campuspulse.local',
      organizer: 'organizer@campuspulse.local',
      admin: 'admin@campuspulse.local',
    };

    setEmail(demos[role]);
    setPassword('CampusPulse123!');
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const data = await api(
        `/auth/${isRegister ? 'register' : 'login'}`,
        {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        }
      );

      setToken(data.token);
      onAuthChange(data.user);

      navigate(
        location.state?.from ||
          (['admin', 'organizer'].includes(data.user.role)
            ? '/dashboard'
            : '/')
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Kembali ke beranda
      </Link>

      <div className="auth-card">
        <div className="auth-art campus-gate-art">
          <div className="auth-art-photo" aria-hidden="true" />
          <div className="auth-water-ripple ripple-one" />
          <div className="auth-water-ripple ripple-two" />
          <div className="auth-orbit orbit-a" />
          <div className="auth-orbit orbit-b" />

          <span className="auth-logo">
            <Activity size={29} />
          </span>

          <h2>
            Welcome to
            <br />
            <span className="gradient-text">your campus.</span>
          </h2>

          <p>
            Acara baru, koneksi baru, pengalaman yang membentuk ceritamu.
          </p>

          <div className="auth-art-footer">
            <span className="pulse-dot" /> YOUR CAMPUS. YOUR PULSE.
          </div>
        </div>

        <div className="auth-form-wrap">
          <span className="eyebrow">
            {isRegister ? 'JOIN THE COMMUNITY' : 'WELCOME BACK'}
          </span>

          <h1>
            {isRegister ? 'Create your account' : 'Good to see you.'}
          </h1>

          <p className="muted">
            {isRegister
              ? 'Mulai temukan pengalaman kampus yang baru.'
              : 'Masuk untuk melanjutkan perjalanan kampusmu.'}
          </p>

          {!isRegister && (
            <div className="role-picker" aria-label="Pilih jenis akun">
              <button
                type="button"
                className={
                  selectedRole === 'student'
                    ? 'role-option selected'
                    : 'role-option'
                }
                onClick={() => chooseDemo('student')}
              >
                <GraduationCap size={18} />
                <span>Mahasiswa</span>
              </button>

              <button
                type="button"
                className={
                  selectedRole === 'organizer'
                    ? 'role-option selected'
                    : 'role-option'
                }
                onClick={() => chooseDemo('organizer')}
              >
                <CalendarDays size={18} />
                <span>Organizer</span>
              </button>

              <button
                type="button"
                className={
                  selectedRole === 'admin'
                    ? 'role-option selected'
                    : 'role-option'
                }
                onClick={() => chooseDemo('admin')}
              >
                <ShieldCheck size={18} />
                <span>Admin</span>
              </button>
            </div>
          )}

          <form onSubmit={submit} className="auth-form">
            {isRegister && (
              <label>
                Nama lengkap
                <div className="input-with-icon">
                  <UserRound size={17} />
                  <input
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama kamu"
                    autoComplete="name"
                  />
                </div>
              </label>
            )}

            <label>
              Email kampus
              <div className="input-with-icon">
                <Mail size={17} />
                <input
                  id="username"
                  name="username"
                  required
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@kampus.ac.id"
                />
              </div>
            </label>

            <label>
              Password
              <div className="input-with-icon">
                <LockKeyhole size={17} />
                <input
                  id="password"
                  name="password"
                  required
                  minLength={8}
                  type="password"
                  autoComplete={
                    isRegister ? 'new-password' : 'current-password'
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                />
              </div>
            </label>

            {error && <div className="form-error">{error}</div>}

            <button
              id="btn-submit"
              type="submit"
              disabled={busy}
              className="button button-full"
            >
              {busy
                ? 'Memproses...'
                : isRegister
                  ? 'Create account'
                  : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Login' : 'Daftar sekarang'}
            </Link>
          </p>

          <div className="demo-note">
            <strong>Akun demo lokal</strong>
            <br />
            Pilih peran di atas untuk mengisi email dan password demo. Peran
            tetap diverifikasi oleh server.
          </div>
        </div>
      </div>
    </main>
  );
}
