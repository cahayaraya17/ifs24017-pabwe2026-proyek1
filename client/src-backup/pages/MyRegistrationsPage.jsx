import { useEffect,useState } from 'react';
import { CalendarDays, MapPin, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function MyRegistrationsPage(){
  const [items,setItems]=useState([]);const [error,setError]=useState('');
  async function load(){try{const d=await api('/registrations/me');setItems(d.registrations||[]);setError('');}catch(e){setError(e.message);}}
  useEffect(()=>{load();},[]);
  async function cancel(id){if(!window.confirm('Batalkan pendaftaran acara ini?'))return;try{await api(`/registrations/${id}`,{method:'DELETE'});await load();}catch(e){setError(e.message);}}
  return <main className="container page-pad"><div className="section-heading"><div><span className="eyebrow">YOUR CAMPUS JOURNEY</span><h1>My <span className="gradient-text">events.</span></h1><p className="muted">Semua acara yang kamu ikuti ada di sini.</p></div></div>{error&&<div className="form-error">{error}</div>}{items.length===0&&!error?<div className="state-panel">Kamu belum mendaftar acara. <Link to="/">Jelajahi acara</Link></div>:<div className="registration-list">{items.map(r=><article className="registration-item" key={r.id}><div className="registration-icon"><CalendarDays/></div><div className="registration-copy"><strong>{r.title}</strong><span><CalendarDays size={14}/>{new Date(r.start_at).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'})}</span><span><MapPin size={14}/>{r.location}</span></div><span className={`status-badge status-${r.status}`}>{r.status}</span>{r.status==='registered'&&<button className="button button-ghost button-small" onClick={()=>cancel(r.id)}><XCircle size={15}/> Cancel</button>}</article>)}</div>}</main>;
}
