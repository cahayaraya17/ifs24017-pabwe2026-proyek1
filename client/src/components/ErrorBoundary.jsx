import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="container page-pad">
        <div className="state-panel error-state" role="alert">
          <strong>Terjadi kesalahan saat menampilkan halaman.</strong>
          <p>Silakan coba lagi atau muat ulang halaman.</p>
          <button type="button" className="button button-small" onClick={this.handleReset}>
            Coba lagi
          </button>
        </div>
      </main>
    );
  }
}
