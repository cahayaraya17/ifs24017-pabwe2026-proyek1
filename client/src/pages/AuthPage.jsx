import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthArt from '../components/auth/AuthArt';
import AuthFields from '../components/auth/AuthFields';
import RolePicker from '../components/auth/RolePicker';
import { useAuthForm } from '../hooks/useAuthForm';

const COPY = {
  login: {
    eyebrow: 'WELCOME BACK',
    title: 'Good to see you.',
    subtitle: 'Masuk untuk melanjutkan perjalanan kampusmu.',
    submit: 'Sign in',
    switchQuestion: 'Belum punya akun?',
    switchLabel: 'Daftar sekarang',
    switchTo: '/register',
  },
  register: {
    eyebrow: 'JOIN THE COMMUNITY',
    title: 'Create your account',
    subtitle: 'Mulai temukan pengalaman kampus yang baru.',
    submit: 'Create account',
    switchQuestion: 'Sudah punya akun?',
    switchLabel: 'Login',
    switchTo: '/login',
  },
};

export default function AuthPage({ mode, onAuthChange }) {
  const {
    values,
    setField,
    selectedRole,
    chooseDemo,
    error,
    busy,
    isRegister,
    submit,
  } = useAuthForm({ mode, onAuthChange });
  const copy = COPY[isRegister ? 'register' : 'login'];

  return (
    <main className="auth-page container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Kembali ke beranda
      </Link>
      <div className="auth-card">
        <AuthArt />
        <div className="auth-form-wrap">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p className="muted">{copy.subtitle}</p>
          {!isRegister && <RolePicker selectedRole={selectedRole} onChoose={chooseDemo} />}
          <form onSubmit={submit} className="auth-form" noValidate>
            <AuthFields values={values} onChange={setField} isRegister={isRegister} />
            {error && <div className="form-error" role="alert">{error}</div>}
            <button
              id="btn-submit"
              type="submit"
              disabled={busy}
              className="button button-full"
            >
              {busy ? 'Memproses...' : copy.submit}
            </button>
          </form>
          <p className="auth-switch">
            {copy.switchQuestion} <Link to={copy.switchTo}>{copy.switchLabel}</Link>
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
