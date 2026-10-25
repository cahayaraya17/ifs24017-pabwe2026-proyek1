import {
  Activity,
  CalendarDays,
  Compass,
  LayoutDashboard,
  LogIn,
  LogOut,
  UserRound,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MANAGER_ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { setToken } from '../../services/api';

function UserMenu({ user, onLogout }) {
  return (
    <>
      <span className="avatar">
        <UserRound size={17} />
      </span>
      <span className="user-name">{user.name}</span>
      <button className="icon-button" onClick={onLogout} title="Logout">
        <LogOut size={17} />
      </button>
    </>
  );
}

export default function Navbar({ user, onAuthChange }) {
  const navigate = useNavigate();
  const isManager = user && MANAGER_ROLES.includes(user.role);

  function logout() {
    setToken(null);
    onAuthChange(null);
    navigate(ROUTES.HOME);
  }

  return (
    <header className="topbar">
      <Link to={ROUTES.HOME} className="brand">
        <span className="brand-mark">
          <Activity size={21} />
        </span>
        <span>
          Campus<span className="brand-accent">Pulse</span>
          <small>YOUR CAMPUS, IN ONE PLACE</small>
        </span>
      </Link>

      <nav className="nav-links">
        <NavLink to={ROUTES.HOME} end>
          <Compass size={16} /> Explore
        </NavLink>
        <NavLink to={ROUTES.MAP}>
          <Compass size={16} /> Campus map
        </NavLink>
        {user && (
          <NavLink to={ROUTES.MY_REGISTRATIONS}>
            <CalendarDays size={16} /> My events
          </NavLink>
        )}
        {isManager && (
          <NavLink to={ROUTES.DASHBOARD}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
        )}
      </nav>

      <div className="nav-user">
        {user ? (
          <UserMenu user={user} onLogout={logout} />
        ) : (
          <Link className="button button-small" to={ROUTES.LOGIN}>
            <LogIn size={16} /> Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
