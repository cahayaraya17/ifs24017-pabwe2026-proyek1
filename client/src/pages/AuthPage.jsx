import { useState } from 'react';
import { ArrowLeft, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthArt from '../components/auth/AuthArt';
import AuthField from '../components/auth/AuthField';
import RolePicker from '../components/auth/RolePicker';
import { DEMO_EMAILS, DEMO_PASSWORD } from '../constants/demoAccounts';
import { MANAGER_ROLES, ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';
import { setToken } from '../services/api';
import { authenticate } from '../services/authService';
import { validateAuthForm } from '../utils/validators';

const COPY = {
  login: {
    eyebrow: 'WELCOME BACK',
    title: 'Good to see you.',
    subtitle: 'Masuk untuk melanjutkan perjalanan kampusmu.',
    submit: 'Sign in',
    switchPrompt: 'Belum punya akun?',
    switchLabel: 'Daftar sekarang',
    switchTo: ROUTES.REGISTER,
  },
  register: {
    eyebrow: 'JOIN THE COMMUNITY',
    title: 'Create your account',
    subtitle: 'Mulai temukan pengalaman kampus yang baru.',
    submit: 'Create account',
    switchPrompt: 'Sudah punya akun?',
    switchLabel: 'Login',
    switchTo: ROUTES.LOGIN,
  },
};

export default function AuthPage({ mode, onAuthChange }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister = mode === 'register';
  const copy = COPY[isRegister ? 'register' : 'login'];

  function chooseDemoAccount(role) {
    setSelectedRole(role);
    setEmail(DEMO_EMAILS[role]);
    setPassword(DEMO_PASSWORD);
  }

  function getRedirectPath(user) {
    if (location.state?.from) return location.state.from;
    return MANAGER_ROLES.includes(user.role) ? ROUTES.DASHBOARD : ROUTES.HOME;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const validationError = validateAuthForm({ name, email, password }, isRegister);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);

    try {
      const data = await authenticate(mode, { name, email, password });
      setToken(data.token);
      onAuthChange(data.user);
      navigate(getRedirectPath(data.user));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page container">
      <Link to={ROUTES.HOME} className="back-link">
        <ArrowLeft size={16} /> Kembali ke beranda
      </Link>

      <div className="auth-card">
        <AuthArt />

        <div className="auth-form-wrap">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p className="muted">{copy.subtitle}</p>

          {!isRegister && <RolePicker selectedRole={selectedRole} onSelect={chooseDemoAccount} />}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {isRegister && (
              <AuthField
                label="Nama lengkap"
                icon={UserRound}
                id="name"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nama kamu"
              />
            )}
            <AuthField
              label="Email kampus"
              icon={Mail}
              id="username"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
              required
              type="text"
              maxLength={190}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@kampus.ac.id"
            />
            <AuthField
              label="Password"
              icon={LockKeyhole}
              id="password"
              name="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              minLength={8}
              maxLength={100}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimal 8 karakter"
            />
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            <button id="btn-submit" type="submit" disabled={busy} className="button button-full">
              {busy ? 'Memproses...' : copy.submit}
            </button>
          </form>

          <p className="auth-switch">
            {copy.switchPrompt} <Link to={copy.switchTo}>{copy.switchLabel}</Link>
          </p>
          <div className="demo-note">
            <strong>Akun demo lokal</strong>
            <br />
            Pilih peran di atas untuk mengisi email dan password demo. Peran tetap diverifikasi oleh
            server.
          </div>
        </div>
      </div>
    </main>
  );
}
