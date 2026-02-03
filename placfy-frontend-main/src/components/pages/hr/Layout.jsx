import { Outlet } from 'react-router-dom';

export default function HRLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">HR Portal</h1>
        <Outlet />
      </div>
    </div>
  );
}
