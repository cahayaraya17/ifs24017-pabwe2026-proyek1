import { Activity, CalendarDays, Compass, LayoutDashboard, LogIn, LogOut, UserRound } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { setToken } from '../services/api';

export default function Navbar({ user, onAuthChange }) {
  const navigate = useNavigate();
  function logout() {
    setToken(null);
    onAuthChange(null);
    navigate('/');
  }
  return <header className="topbar">
    <Link to="/" className="brand"><span className="brand-mark"><Activity size={21}/></span><span>Campus<span className="brand-accent">Pulse</span><small>YOUR CAMPUS, IN ONE PLACE</small></span></Link>
    <nav className="nav-links">
      <NavLink to="/" end><Compass size={16}/> Explore</NavLink>
      <NavLink to="/map"><Compass size={16}/> Campus map</NavLink>
      {user && <NavLink to="/my-registrations"><CalendarDays size={16}/> My events</NavLink>}
      {user && ['admin','organizer'].includes(user.role) && <NavLink to="/dashboard"><LayoutDashboard size={16}/> Dashboard</NavLink>}
    </nav>
    <div className="nav-user">
      {user ? <><span className="avatar"><UserRound size={17}/></span><span className="user-name">{user.name}</span><button className="icon-button" onClick={logout} title="Logout"><LogOut size={17}/></button></> : <Link className="button button-small" to="/login"><LogIn size={16}/> Sign in</Link>}
    </div>
  </header>;
}
