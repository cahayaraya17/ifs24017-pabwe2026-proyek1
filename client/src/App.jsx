import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import BootScreen from './components/BootScreen';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import { MANAGER_ROLES } from './constants';
import { useAuthBootstrap } from './hooks/useAuthBootstrap';
import AuthPage from './pages/AuthPage';
import EventDetailPage from './pages/EventDetailPage';
import HomePage from './pages/HomePage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CampusMapPage = lazy(() => import('./pages/CampusMapPage'));

// /auth/login dan /auth/register adalah alias (dipakai Delcom Grading) dan tidak boleh dialihkan.
const AUTH_ROUTES = [
  ['/login', 'login'],
  ['/register', 'register'],
  ['/auth/login', 'login'],
  ['/auth/register', 'register'],
];

export default function App() {
  const { user, setUser, ready } = useAuthBootstrap();

  if (!ready) return <BootScreen />;

  return (
    <>
      <Navbar user={user} onAuthChange={setUser} />
      <ErrorBoundary>
        <Suspense fallback={<BootScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {AUTH_ROUTES.map(([path, mode]) => (
              <Route
                key={path}
                path={path}
                element={
                  user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <AuthPage mode={mode} onAuthChange={setUser} />
                  )
                }
              />
            ))}
            <Route path="/events/:id" element={<EventDetailPage user={user} />} />
            <Route path="/map" element={<CampusMapPage />} />
            <Route
              path="/my-registrations"
              element={
                <RequireAuth user={user}>
                  <MyRegistrationsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth user={user} roles={MANAGER_ROLES}>
                  <DashboardPage user={user} />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
