import { Activity } from 'lucide-react';

/** Panel ilustrasi di sisi kiri halaman login/registrasi. */
export default function AuthArt() {
  return (
    <div className="auth-art campus-gate-art">
      <img
        className="auth-art-photo"
        src="/images/itdel-gate.webp"
        alt=""
        aria-hidden="true"
        width="330"
        height="413"
        fetchpriority="high"
        decoding="async"
      />
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
      <p>Acara baru, koneksi baru, pengalaman yang membentuk ceritamu.</p>
      <div className="auth-art-footer">
        <span className="pulse-dot" /> YOUR CAMPUS. YOUR PULSE.
      </div>
    </div>
  );
}
