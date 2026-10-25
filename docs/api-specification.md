# CampusPulse API (MVP)

Base URL: `/api`

## Public

- `GET /health`
- `GET /categories`
- `GET /events?q=&category=&page=&limit=` — token opsional; pengelola yang login dapat menambah `includeDrafts=true`
- `GET /events/:id`
- `POST /auth/register` — dibatasi rate limit
- `POST /auth/login` — dibatasi rate limit

## Authenticated

- `GET /auth/me`
- `POST /events/:id/register` — student only
- `GET /registrations/me` — student only
- `DELETE /registrations/:id` — registration owner or admin
- `GET /dashboard/stats` — organizer/admin
- `GET /events/:id/registrations` — event owner/admin

## Organizer/Admin

- `POST /events`
- `PATCH /events/:id`
- `DELETE /events/:id` — acara dengan peserta aktif diarsipkan (status `cancelled`), bukan dihapus

## Status dan error

| Status | Arti                                                        |
| ------ | ----------------------------------------------------------- |
| 400    | Input tidak valid                                           |
| 401    | Belum login atau token tidak valid                          |
| 403    | Peran atau kepemilikan tidak mencukupi                      |
| 404    | Data atau endpoint tidak ditemukan                          |
| 409    | Konflik (email terdaftar, sudah mendaftar, kuota penuh)     |
| 429    | Terlalu banyak percobaan login/registrasi                   |
| 500    | Kesalahan server (detail teknis tidak ditampilkan ke klien) |

Semua error dikembalikan sebagai JSON: `{ "error": "Pesan yang mudah dipahami" }`.
