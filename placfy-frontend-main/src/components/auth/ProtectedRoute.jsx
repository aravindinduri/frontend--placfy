import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../ui/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ roles = [], children }) {
  const location = useLocation();
  const { user, isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Only redirect if definitely unauthenticated
    const params = new URLSearchParams({ redirect: location.pathname + location.search });
    return <Navigate to={`/login?${params.toString()}`} replace />;
  }

  const userRoles = new Set((user.roles || []).map((r) => (r || '').toLowerCase()));
  const hasAccess = roles.length === 0 || roles.some((r) => userRoles.has(r.toLowerCase()));

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
}
