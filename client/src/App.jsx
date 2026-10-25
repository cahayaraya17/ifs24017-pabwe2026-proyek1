import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import BootScreen from './components/common/BootScreen';
import RequireAuth from './components/common/RequireAuth';
import Navbar from './components/layout/Navbar';
import { MANAGER_ROLES } from './constants/roles';
import { ROUTES } from './constants/routes';
import { useSession } from './hooks/useSession';
import AuthPage from './pages/AuthPage';
import EventDetailPage from './pages/EventDetailPage';
import HomePage from './pages/HomePage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';

// Halaman berat dimuat saat dibutuhkan agar bundle awal tetap kecil.
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CampusMapPage = lazy(() => import('./pages/CampusMapPage'));

const AUTH_ROUTES = [
  [ROUTES.LOGIN, 'login'],
  [ROUTES.REGISTER, 'register'],
  [ROUTES.AUTH_LOGIN, 'login'],
  [ROUTES.AUTH_REGISTER, 'register'],
];

export default function App() {
  const { user, setUser, ready } = useSession();

  if (!ready) return <BootScreen />;

  return (
    <>
      <Navbar user={user} onAuthChange={setUser} />
      <Suspense fallback={<BootScreen />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          {AUTH_ROUTES.map(([path, mode]) => (
            <Route
              key={path}
              path={path}
              element={
                user ? (
                  <Navigate to={ROUTES.HOME} replace />
                ) : (
                  <AuthPage mode={mode} onAuthChange={setUser} />
                )
              }
            />
          ))}
          <Route path={ROUTES.EVENT_DETAIL_PATTERN} element={<EventDetailPage user={user} />} />
          <Route path={ROUTES.MAP} element={<CampusMapPage />} />
          <Route
            path={ROUTES.MY_REGISTRATIONS}
            element={
              <RequireAuth user={user}>
                <MyRegistrationsPage />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <RequireAuth user={user} roles={MANAGER_ROLES}>
                <DashboardPage user={user} />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
