import { ArrowLeft, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthArt from '../components/auth/AuthArt';
import AuthField from '../components/auth/AuthField';
import RolePicker from '../components/auth/RolePicker';
import { ROUTES } from '../constants/routes';
import { useAuthForm } from '../hooks/useAuthForm';

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
  const {
    isRegister,
    values,
    selectedRole,
    error,
    busy,
    bindField,
    chooseDemoAccount,
    handleSubmit,
  } = useAuthForm({ mode, onAuthChange });
  const copy = COPY[isRegister ? 'register' : 'login'];

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
                value={values.name}
                onChange={bindField('name')}
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
              value={values.email}
              onChange={bindField('email')}
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
              value={values.password}
              onChange={bindField('password')}
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
