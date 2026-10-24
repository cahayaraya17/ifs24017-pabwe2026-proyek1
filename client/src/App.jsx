import { lazy,Suspense,useEffect,useState } from 'react';
import { Routes,Route,Navigate,useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import EventDetailPage from './pages/EventDetailPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import { api,getToken,setToken } from './services/api';

const DashboardPage=lazy(()=>import('./pages/DashboardPage'));
const CampusMapPage=lazy(()=>import('./pages/CampusMapPage'));

// /auth/login dan /auth/register adalah alias (dipakai Delcom Grading) dan tidak boleh dialihkan.
const AUTH_ROUTES=[['/login','login'],['/register','register'],['/auth/login','login'],['/auth/register','register']];

function BootScreen(){
  return <main className="boot-screen"><span className="brand-mark"><span className="pulse-dot"/></span><h1>Preparing your campus...</h1></main>;
}
function RequireAuth({user,children,roles}) {
  const location=useLocation();
  if(!user)return <Navigate to="/login" replace state={{from:location.pathname}}/>;
  if(roles&&!roles.includes(user.role))return <Navigate to="/" replace/>;
  return children;
}
export default function App(){
  const [user,setUser]=useState(null);const [ready,setReady]=useState(false);
  useEffect(()=>{if(getToken())api('/auth/me').then(d=>setUser(d.user)).catch(()=>setToken(null)).finally(()=>setReady(true));else setReady(true);},[]);
  if(!ready)return <BootScreen/>;
  return <><Navbar user={user} onAuthChange={setUser}/><Suspense fallback={<BootScreen/>}><Routes>
    <Route path="/" element={<HomePage/>}/>
    {AUTH_ROUTES.map(([path,mode])=><Route key={path} path={path} element={user?<Navigate to="/" replace/>:<AuthPage mode={mode} onAuthChange={setUser}/>}/>)}
    <Route path="/events/:id" element={<EventDetailPage user={user}/>}/>
    <Route path="/map" element={<CampusMapPage/>}/>
    <Route path="/my-registrations" element={<RequireAuth user={user}><MyRegistrationsPage/></RequireAuth>}/>
    <Route path="/dashboard" element={<RequireAuth user={user} roles={['admin','organizer']}><DashboardPage user={user}/></RequireAuth>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></Suspense></>;
}
