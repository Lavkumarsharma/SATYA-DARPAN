# सत्यदर्पण (SatyaDarpan) — Political Research & Evidence Publishing Platform

> "Mirror of Truth" — A premium investigative journalism and political evidence publishing platform.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue.svg)](https://tailwindcss.com/)

---

## 📁 Project Structure

```
सत्यदर्पण/
├── backend/          # Node.js + Express REST API (Port 5000)
├── frontend/         # Next.js 15 Public Site (Port 3000)
├── admin/            # Next.js 15 Admin Dashboard (Port 3001)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (Atlas or local)
- Cloudinary account
- npm or yarn

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your MongoDB URI, JWT secrets, and Cloudinary credentials
npm install
npm run dev
```

### 2. Admin Panel Setup

```bash
cd admin
cp .env.local.example .env.local
npm install
npm run dev
# Open http://localhost:3001
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `FRONTEND_URL` | Frontend origin for CORS |
| `ADMIN_URL` | Admin origin for CORS |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |

### Admin (`admin/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Public Users                    │
│         (frontend: Next.js SSR)             │
└──────────────────┬──────────────────────────┘
                   │ REST API calls
┌──────────────────▼──────────────────────────┐
│           Backend API (Express)              │
│   Auth │ Articles │ Media │ Search │ SEO     │
└──┬─────────────────────────┬────────────────┘
   │                         │
┌──▼───────┐          ┌──────▼──────┐
│ MongoDB  │          │  Cloudinary │
│ (Data)   │          │  (Media)    │
└──────────┘          └─────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Admin Dashboard (Next.js)           │
│   Editor │ Media Lib │ Analytics │ Users     │
└─────────────────────────────────────────────┘
```

---

## ✨ Features

### Public Frontend
- 🏠 Editorial homepage with hero, trending, featured sections
- 📰 Rich article pages with block renderer
- 📊 Statistics, timelines, fact boxes, comparison tables
- 🔍 Powerful faceted search
- 🌙 Dark/Light mode
- 📱 Fully responsive
- ⚡ SSR + ISR for performance
- 🗺️ Dynamic sitemap + robots.txt + RSS feed
- 💬 Nested comments system

### Admin Dashboard
- 📝 Notion-like block editor (Tiptap)
- 🎨 50+ block types (text, media, embeds, custom)
- 🖼️ Media library with drag-and-drop
- 📈 Analytics dashboard
- 👥 User & role management
- 🔒 JWT auth with refresh tokens
- 📋 Revision history
- 🤖 Auto-save

### Security
- 🔐 JWT + Refresh tokens (httpOnly cookies)
- 🛡️ Helmet, CORS, Rate limiting
- 🧹 XSS protection, MongoDB sanitization
- 📝 Audit logs
- 🔑 bcrypt password hashing

---

## 📦 Tech Stack

| Category | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript |
| Admin | Next.js 14, Tiptap v2, Recharts |
| Backend | Node.js 20, Express 4, JavaScript |
| Database | MongoDB 7, Mongoose |
| Auth | JWT, bcryptjs |
| Media | Cloudinary |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| Icons | Lucide React |

---

## 🚢 Deployment

### Vercel (Frontend + Admin)

```bash
# Frontend
vercel --cwd frontend

# Admin
vercel --cwd admin
```

### VPS (Backend)

```bash
cd backend
npm install --production
pm2 start src/app.js --name satyadarpan-api
```

Or use Docker:

```bash
docker build -t satyadarpan-backend .
docker run -p 5000:5000 --env-file .env satyadarpan-backend
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ for truth, transparency, and accountability.
