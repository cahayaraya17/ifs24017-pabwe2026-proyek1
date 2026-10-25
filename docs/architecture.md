# Arsitektur CampusPulse

CampusPulse memisahkan tanggung jawab ke dalam lapisan yang jelas, baik di backend maupun frontend.
Aturan utamanya: **lapisan atas boleh memanggil lapisan di bawahnya, tidak sebaliknya.**

## Backend (`server/src`)

```
routes → controllers → services → repositories → database
              │            │
         middleware    validators / policies
```

| Folder          | Tanggung jawab                                                                        |
| --------------- | ------------------------------------------------------------------------------------- |
| `config/`       | Pembacaan environment (`env.js`), koneksi SQLite (`database.js`), skema (`schema.js`) |
| `constants/`    | Nilai tetap bersama: peran (`roles.js`) dan status (`statuses.js`)                    |
| `routes/`       | Pemetaan URL ke controller beserta middleware-nya (auth, peran, rate limit)           |
| `controllers/`  | Lapisan HTTP tipis: membaca `req`, memanggil service, menulis `res`                   |
| `services/`     | Aturan bisnis (pendaftaran, kuota, kepemilikan acara) dan orkestrasi transaksi        |
| `validators/`   | Validasi dan normalisasi input (fungsi murni, tanpa akses database)                   |
| `policies/`     | Aturan otorisasi, mis. siapa boleh mengelola sebuah acara                             |
| `repositories/` | Satu-satunya tempat SQL; mengembalikan data mentah                                    |
| `middleware/`   | Autentikasi JWT, pembatasan peran, rate limit, header keamanan, error handler         |
| `utils/`        | `HttpError`, parser angka/teks, penandatanganan token                                 |

Penanganan error bersifat terpusat: service melempar `HttpError`, dan `errorHandler` mengubahnya menjadi
`{ "error": "pesan" }`. Error tak terduga hanya dicatat di log dan dibalas dengan pesan generik, sehingga
detail internal tidak bocor ke klien.

## Frontend (`client/src`)

```
pages → components → hooks → services → api.js
              └──── utils / constants / data
```

| Folder        | Tanggung jawab                                                                           |
| ------------- | ---------------------------------------------------------------------------------------- |
| `pages/`      | Halaman per route; merangkai hook dan komponen, tanpa detail tampilan yang rumit         |
| `components/` | Komponen UI per fitur (`auth`, `dashboard`, `events`, `home`, `layout`, `map`, `common`) |
| `hooks/`      | Logika stateful dan pengambilan data (`useSession`, `useEventList`, dst.)                |
| `services/`   | Pemanggilan API per domain; `api.js` adalah klien HTTP tunggal                           |
| `utils/`      | Fungsi murni: format tanggal, pembentukan payload form, URL peta                         |
| `constants/`  | Route, peran, status, kunci penyimpanan                                                  |
| `data/`       | Data statis (titik lokasi kampus)                                                        |
| `styles/`     | CSS dipecah per area, digabung lewat `index.css`                                         |

## Konvensi

- Nama berkas: komponen dan halaman `PascalCase.jsx`; hook `useXxx.js`; selain itu `camelCase.js`.
- Format kode memakai Prettier (`npm run format`), pengaturan editor di `.editorconfig`.
- Tes diletakkan di samping berkas yang diuji (client) atau di `server/tests` (server).
