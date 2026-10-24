
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import EventDetailPage from './pages/EventDetailPage';
import DashboardPage from './pages/DashboardPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import CampusMapPage from './pages/CampusMapPage';
import { api, getToken, setToken } from './services/api';

function RequireAuth({ user, children, roles }) {
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (getToken()) {
      api('/auth/me')
        .then((d) => setUser(d.user))
        .catch(() => setToken(null))
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div className="boot-screen">
        <span className="brand-mark">
          <span className="pulse-dot" />
        </span>
        <p>Preparing your campus...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} onAuthChange={setUser} />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* URL login khusus yang tetap bisa dibuka */}
        <Route
          path="/auth/login"
          element={
            <AuthPage mode="login" onAuthChange={setUser} />
          }
        />

        {/* Login biasa: pengguna yang sudah login diarahkan ke beranda */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage mode="login" onAuthChange={setUser} />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage mode="register" onAuthChange={setUser} />
            )
          }
        />

        <Route
          path="/events/:id"
          element={<EventDetailPage user={user} />}
        />

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
            <RequireAuth
              user={user}
              roles={['admin', 'organizer']}
            >
              <DashboardPage user={user} />
            </RequireAuth>
          }
        />

        {/* URL lain yang tidak dikenal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
