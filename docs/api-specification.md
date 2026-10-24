# CampusPulse API (MVP)

Base URL: `/api`

## Public
- `GET /health`
- `GET /categories`
- `GET /events?q=&category=&page=&limit=`
- `GET /events/:id`
- `POST /auth/register`
- `POST /auth/login`

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
- `DELETE /events/:id`

Errors are returned as JSON: `{ "error": "Human-readable message" }`.
