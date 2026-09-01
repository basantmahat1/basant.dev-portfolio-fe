import React from 'react';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
          <div className="shell max-w-md">
            <div className="glass p-8">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-red-500 ring-4 ring-red-500/20">
                <FaExclamationTriangle size={24} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Something went wrong</h2>
              <p className="mb-6 text-xs text-text-secondary leading-relaxed">
                An unexpected interface error occurred. You can reload the page or return to the homepage.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="btn-primary text-xs inline-flex items-center gap-1.5"
                >
                  <FaRedo size={11} /> Refresh Page
                </button>
                <a
                  href="/"
                  className="btn-secondary text-xs inline-flex items-center gap-1.5"
                >
                  <FaHome size={11} /> Go Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
