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
import { logout } from '../services/authService';
import { isManager } from '../utils/roles';

function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark">
        <Activity size={21} />
      </span>
      <span>
        Campus<span className="brand-accent">Pulse</span>
        <small>YOUR CAMPUS, IN ONE PLACE</small>
      </span>
    </Link>
  );
}

function NavMenu({ user }) {
  return (
    <nav className="nav-links">
      <NavLink to="/" end>
        <Compass size={16} /> Explore
      </NavLink>
      <NavLink to="/map">
        <Compass size={16} /> Campus map
      </NavLink>
      {user && (
        <NavLink to="/my-registrations">
          <CalendarDays size={16} /> My events
        </NavLink>
      )}
      {isManager(user) && (
        <NavLink to="/dashboard">
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
      )}
    </nav>
  );
}

function UserMenu({ user, onLogout }) {
  if (!user) {
    return (
      <Link className="button button-small" to="/login">
        <LogIn size={16} /> Sign in
      </Link>
    );
  }
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

  function handleLogout() {
    logout();
    onAuthChange(null);
    navigate('/');
  }

  return (
    <header className="topbar">
      <Brand />
      <NavMenu user={user} />
      <div className="nav-user">
        <UserMenu user={user} onLogout={handleLogout} />
      </div>
    </header>
  );
}
