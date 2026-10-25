import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

/** Melindungi route: mengarahkan ke login bila belum masuk, atau ke beranda bila peran tidak sesuai. */
export default function RequireAuth({ user, roles, children }) {
  const location = useLocation();

  if (!user) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={ROUTES.HOME} replace />;
  return children;
}
