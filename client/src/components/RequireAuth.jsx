import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ user, roles, children }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
