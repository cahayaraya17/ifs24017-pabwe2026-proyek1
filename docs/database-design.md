# Database

Tables:

- `users`: account and role (`student`, `organizer`, `admin`)
- `categories`: event categories
- `events`: event data, category and organizer foreign keys
- `registrations`: user-event relation; unique `(event_id, user_id)`

SQLite foreign keys are enabled. Registration uses a transaction and checks capacity before inserting. For public production use, replace demo credentials, use HTTPS, configure secure secrets and persistent storage.
