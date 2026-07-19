<div align="center">

# restaurant-menu

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)](#architecture)
[![Supabase](https://img.shields.io/badge/db-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/license-MIT-8b5cf6)](#license)

</div>

`restaurant-menu` is a restaurant menu and ordering web app. A React (Vite)
client talks to an Express API that persists menus, items, and orders in
Supabase. A seed script populates the catalog so the app is runnable from a
clean database.

## Why

The interesting part is the data boundary: the Express layer is a thin,
layered API (routes → controllers → models) over Supabase's Postgres/SDK, so
the client never touches the database directly and the schema lives in one
place. `SUPABASE_SETUP.md` documents the tables and the wiring.

## Architecture

```
restaurant-menu/
├── client/              # Vite + React front end (src/, index.html)
├── server/              # Express API
│   ├── server.js        # app bootstrap
│   ├── routes/          # HTTP route definitions
│   ├── controllers/     # request handlers
│   ├── models/          # Supabase-backed data access
│   ├── config/          # env / client config
│   └── seed.js          # populate catalog
└── SUPABASE_SETUP.md    # schema + connection steps
```

- **Server** — `express` + `@supabase/supabase-js` + `cors` + `dotenv`;
  `npm run seed` fills the catalog from `seed.js`.
- **Client** — Vite + React SPA in `client/src` calling the API.

## Getting started

```bash
# 1. database
cp SUPABASE_SETUP.md ./ && follow it to create tables + keys

# 2. server
cd server && cp .env.example .env
npm install && npm run seed && npm run dev

# 3. client
cd ../client && npm install && npm run dev
```

## License

MIT
