import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <img src="/Logo3.png" alt="Placfy Logo" className="mb-6 w-16 h-16 rounded shadow" />
      <h1 className="text-5xl font-bold text-brand mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2 text-slate-900">Page Not Found</h2>
      <p className="text-slate-500 max-w-md text-center mb-8">Sorry, the page you're looking for doesn’t exist, was moved, or never existed.</p>
      <Link to="/" className="btn-primary text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-brand-dark transition">Go to Home</Link>
    </div>
  );
}
