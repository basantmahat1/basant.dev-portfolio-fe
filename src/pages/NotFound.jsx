import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-3 font-display text-4xl font-bold text-tertiary">404</h1>
      <p className="mb-6 text-text-secondary">This page doesn&apos;t exist.</p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
