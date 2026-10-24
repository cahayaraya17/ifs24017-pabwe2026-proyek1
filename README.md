# CampusPulse

Platform informasi dan pendaftaran acara untuk satu kampus. Starter MVP dengan React + Vite, Express.js, dan SQLite.

## Fitur
- Registrasi/login mahasiswa dan role `admin` / `organizer`
- Daftar, pencarian, filter kategori, dan detail acara
- Pengelola membuat/mengubah/menghapus acara
- Pendaftaran acara, pembatalan, dan pengecekan kuota
- Dashboard ringkas untuk pengelola
- Dark mode premium ungu-biru
- API REST dan skema SQLite

## Prasyarat
- Node.js 20+ dan npm
- Git (untuk clone repository)

## Menjalankan lokal

### 1. Clone repository
```bash
git clone <URL_REPOSITORY_KAMU>
cd campuspulse
```

### 2. Install dependencies
```bash
npm install
npm run install:all
```

### 3. Konfigurasi backend
Salin `server/.env.example` menjadi `server/.env`, lalu ubah `JWT_SECRET` menjadi string acak yang panjang.

### 4. Siapkan database dan data demo
```bash
npm run db:seed
```

Akun demo yang dibuat oleh seed:
- Admin: `admin@campuspulse.local` / `CampusPulse123!`
- Organizer: `organizer@campuspulse.local` / `CampusPulse123!`
- Mahasiswa: `student@campuspulse.local` / `CampusPulse123!`

**Ganti password demo sebelum deployment publik.** Seed hanya untuk pengembangan/demo.

### 5. Jalankan aplikasi
```bash
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:4000/api
- Health check: http://localhost:4000/api/health

## Scripts
- `npm run dev` - jalankan frontend dan backend
- `npm run build` - build frontend
- `npm test` - jalankan tes API dasar
- `npm run db:seed` - buat skema dan data demo
- `npm start` dari folder `server` - jalankan API

## Catatan deployment
SQLite membutuhkan filesystem persisten. Jangan gunakan filesystem sementara yang menghapus file database saat restart. Set `DB_PATH` ke lokasi persistent volume dan `CLIENT_ORIGIN` ke URL frontend. Atur `JWT_SECRET` melalui environment variables platform. Deploy frontend sebagai static site dan backend sebagai Node service. Jenkinsfile contoh menjalankan install, build, test, dan menyediakan placeholder deployment yang perlu disesuaikan dengan hosting yang dipakai.

## Struktur
- `client/` React frontend
- `server/` Express REST API dan SQLite
- `docs/` catatan API dan database

Ini adalah starter proyek akademik; sebelum dipakai untuk produksi, lakukan audit keamanan, tambah rate limiting, logging, backup database, dan kebijakan privasi.


## Campus map update
The client now includes an interactive OpenStreetMap/Leaflet campus map at `/map`, with the nine requested campus points and demo account role shortcuts on login. Pin coordinates are approximate starter values and should be verified against exact on-campus locations before public deployment. Install updated client dependencies with `npm run install:all`.
