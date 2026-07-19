<div align="center">

# 🍽️ restaurant-menu

**A restaurant menu web app with a Supabase-backed order layer.**

[![Stack](https://img.shields.io/badge/stack-React%20%2B%20Supabase-8b5cf6?style=for-the-badge)](https://supabase.com)
[![DB](https://img.shields.io/badge/db-Supabase-8b5cf6?style=for-the-badge)](SUPABASE_SETUP.md)
[![PRs](https://img.shields.io/badge/PRs-welcome-8b5cf6?style=for-the-badge)](#contributing)

</div>

---

<div align="center">

| | |
|---|---|
| 🎯 **Purpose** | Browse & order from a restaurant menu |
| 🧩 **Stack** | React (client) · Node (server) · Supabase |
| 🌑 **Theme** | Dark / rich |
| 📦 **Status** | In development |

</div>

---

## ✨ Features

- 📋 **Menu UI** — clean client to browse dishes
- 🗄️ **Supabase** persistence (setup in `SUPABASE_SETUP.md`)
- 🔌 **Server** layer for orders / data

## 🚀 Quick start

```bash
cp SUPABASE_SETUP.md ./ && follow its steps
cd client && npm install && npm run dev
cd ../server && npm install && npm run dev
```

## 📁 Structure

```
restaurant-menu/
├── client/              # React front end
├── server/              # API
└── SUPABASE_SETUP.md    # db wiring
```

## 🤝 Contributing

PRs welcome — match the dark/rich README style.

## 📜 License

MIT © Yugank Rathore
