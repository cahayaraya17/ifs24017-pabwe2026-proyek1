import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, CalendarDays, MapPin, Search, ExternalLink, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

// Coordinates are starter estimates around Institut Teknologi Del; refine each pin on-site before production.
const places = [
  {id:'library',name:'Perpustakaan',lat:2.38465,lng:99.14720,kind:'Fasilitas'},
  {id:'na70',name:'Lapangan NA70',lat:2.38420,lng:99.14615,kind:'Lapangan'},
  {id:'green',name:'Lapangan Hijau',lat:2.38505,lng:99.14595,kind:'Lapangan'},
  {id:'ot',name:'Open Theater (OT)',lat:2.38542,lng:99.14710,kind:'Kegiatan'},
  {id:'eh',name:'Entrance Hall (EH)',lat:2.38390,lng:99.14772,kind:'Fasilitas'},
  {id:'pniel',name:'Lapangan Pniel',lat:2.38345,lng:99.14660,kind:'Lapangan'},
  {id:'old-canteen',name:'Kantin Lama',lat:2.38472,lng:99.14802,kind:'Kuliner'},
  {id:'new-canteen',name:'Kantin Baru',lat:2.38512,lng:99.14812,kind:'Kuliner'},
  {id:'auditorium',name:'Auditorium',lat:2.38555,lng:99.14635,kind:'Fasilitas'},
];
const campusCenter=[2.38465,99.14695];
function MapRecenter({place}) { const map=useMap(); if(place) map.flyTo([place.lat,place.lng],18,{duration:.5}); return null; }
export default function CampusMapPage(){
 const [query,setQuery]=useState(''); const [selected,setSelected]=useState(null); const [filter,setFilter]=useState('Semua');
 const filtered=useMemo(()=>places.filter(p=>(p.name.toLowerCase().includes(query.toLowerCase()))&&(filter==='Semua'||p.kind===filter)),[query,filter]);
 const openCampusMap='https://www.google.com/maps/search/?api=1&query=Institut+Teknologi+Del+Sitoluama+Balige';
 return <main className="campus-map-page container">
  <div className="map-page-heading"><div><Link to="/" className="back-link"><ArrowLeft size={16}/> Kembali</Link><div className="eyebrow"><Radio size={13}/> CAMPUS LIVE MAP</div><h1>Explore your <span className="gradient-text">campus.</span></h1><p className="muted">Temukan lokasi penting dan lihat titik kegiatan di Institut Teknologi Del.</p></div><a className="button button-ghost" href={openCampusMap} target="_blank" rel="noreferrer"><ExternalLink size={16}/> Google Maps</a></div>
  <div className="map-layout"><aside className="map-sidebar"><div className="map-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari lokasi kampus..."/></div><div className="map-filter-row">{['Semua','Fasilitas','Lapangan','Kegiatan','Kuliner'].map(f=><button key={f} onClick={()=>setFilter(f)} className={filter===f?'filter-chip active':'filter-chip'}>{f}</button>)}</div><div className="map-location-heading"><strong>Lokasi utama</strong><span>{filtered.length} lokasi</span></div><div className="map-place-list">{filtered.map(p=><button key={p.id} className={selected?.id===p.id?'map-place selected':'map-place'} onClick={()=>setSelected(p)}><span className="map-place-marker"><MapPin size={17}/></span><span><strong>{p.name}</strong><small>{p.kind}</small></span><span className="place-chevron">›</span></button>)}</div><div className="map-note"><strong>Catatan lokasi</strong><p>Posisi pin adalah perkiraan awal dan perlu dicocokkan dengan lokasi bangunan/lapangan yang tepat. Penanda kegiatan akan muncul di sini setelah acara memiliki lokasi dan jadwal.</p></div></aside>
  <div className="map-canvas-wrap"><MapContainer center={campusCenter} zoom={17} scrollWheelZoom className="campus-leaflet-map"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><MapRecenter place={selected}/>{places.map(p=><Marker key={p.id} position={[p.lat,p.lng]} eventHandlers={{click:()=>setSelected(p)}}><Popup><strong>{p.name}</strong><br/>{p.kind}<br/><a href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`} target="_blank" rel="noreferrer">Buka petunjuk arah</a></Popup></Marker>)}</MapContainer><div className="map-legend"><span><i className="legend-dot place-dot"/> Lokasi kampus</span><span><i className="legend-dot event-dot"/> Kegiatan kampus</span></div>{selected&&<div className="map-selected-card"><button className="map-close" onClick={()=>setSelected(null)} aria-label="Tutup">×</button><span className="eyebrow">LOKASI DIPILIH</span><h3>{selected.name}</h3><p>{selected.kind} · Institut Teknologi Del</p><a href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`} target="_blank" rel="noreferrer"><MapPin size={14}/> Buka lokasi di Google Maps</a></div>}</div></div>
  <section className="map-events-hint"><CalendarDays size={19}/><div><strong>Acara di sekitar kampus</strong><p>Berikutnya: hubungkan lokasi acara dari dashboard organizer agar acara yang sedang berlangsung atau akan datang tampil sebagai penanda di peta.</p></div></section>
 </main>;
}
