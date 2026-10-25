import { Component } from 'react';

/** Menangkap error render tak terduga agar seluruh aplikasi tidak menjadi layar kosong. */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="container page-pad">
        <div className="state-panel error-state">
          <h1>Terjadi kesalahan.</h1>
          <p>Muat ulang halaman, atau kembali lagi beberapa saat lagi.</p>
          <button className="button" onClick={() => window.location.reload()}>
            Muat ulang
          </button>
        </div>
      </main>
    );
  }
}
