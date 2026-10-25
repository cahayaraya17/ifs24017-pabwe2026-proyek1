import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthArt from '../components/auth/AuthArt';
import AuthFields from '../components/auth/AuthFields';
import RolePicker from '../components/auth/RolePicker';
import { useAuthForm } from '../hooks/useAuthForm';

export default function AuthPage({ mode, onAuthChange }) {
  const { values, setField, selectedRole, chooseDemo, error, busy, isRegister, submit } =
    useAuthForm({ mode, onAuthChange });

  return (
    <main className="auth-page container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Kembali ke beranda
      </Link>
      <div className="auth-card">
        <AuthArt />
        <div className="auth-form-wrap">
          <span className="eyebrow">{isRegister ? 'JOIN THE COMMUNITY' : 'WELCOME BACK'}</span>
          <h1>{isRegister ? 'Create your account' : 'Good to see you.'}</h1>
          <p className="muted">
            {isRegister
              ? 'Mulai temukan pengalaman kampus yang baru.'
              : 'Masuk untuk melanjutkan perjalanan kampusmu.'}
          </p>
          {!isRegister && <RolePicker selectedRole={selectedRole} onChoose={chooseDemo} />}
          <form onSubmit={submit} className="auth-form" noValidate>
            <AuthFields values={values} onChange={setField} isRegister={isRegister} />
            {error && <div className="form-error">{error}</div>}
            <button id="btn-submit" type="submit" disabled={busy} className="button button-full">
              {busy ? 'Memproses...' : isRegister ? 'Create account' : 'Sign in'}
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
            Pilih peran di atas untuk mengisi email dan password demo. Peran tetap diverifikasi oleh
            server.
          </div>
        </div>
      </div>
    </main>
  );
}
