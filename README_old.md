# Moon-Math.online

A Bitcoin blog and content platform built with a **Node.js + Express backend** using **TypeScript** and a **React + Vite frontend**, backed by **MongoDB**. Features article publishing, a memes gallery, a merch store, user authentication, and an admin panel.

![Homepage](docs/screenshot.png)

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Development](#development)
5. [Production Build & Run](#production-build--run)
6. [Environment Variables](#environment-variables)
7. [Backend API](#backend-api)
8. [Notes](#notes)

---

## Project Structure

```
MyBlog/
├─ server/
│  ├─ src/
│  │  ├─ server.ts           # Express app + all API routes
│  │  ├─ simpleHasher.ts
│  │  ├─ seedMongoDB.ts
│  │  ├─ models/
│  │  │  ├─ Articles.ts
│  │  │  ├─ Products.ts
│  │  │  ├─ Users.ts
│  │  │  ├─ Settings.ts
│  │  │  └─ Contacts.ts
│  │  └─ services/
│  │      └─ email.ts        # Resend email integration
│  ├─ uploads/               # User-uploaded images (articles, products)
│  ├─ dist/                  # Compiled TS output
│  ├─ package.json
│  └─ tsconfig.json
├─ client/
│  ├─ src/
│  │  ├─ App.tsx             # Router + route definitions
│  │  ├─ Home.tsx            # Homepage (articles + memes/merch)
│  │  ├─ state/
│  │  │  └─ useStore.ts      # Zustand global state
│  │  ├─ data/
│  │  │  └─ useData.ts       # Data fetching hooks
│  │  ├─ pages/
│  │  │  ├─ Articles/        # Article list, detail, new, edit
│  │  │  ├─ Products/        # Product pages, cart, checkout
│  │  │  ├─ About.tsx
│  │  │  ├─ Resources.tsx
│  │  │  ├─ MemesPage.tsx
│  │  │  ├─ Login.tsx
│  │  │  ├─ CreateAccount.tsx
│  │  │  ├─ EditUserPage.tsx
│  │  │  └─ AdminPage.tsx
│  │  ├─ components/
│  │  │  ├─ banner-nav.tsx
│  │  │  ├─ footer.tsx
│  │  │  ├─ MemeThumbnails.tsx
│  │  │  └─ image-modal.tsx
│  │  ├─ admin/              # Admin panel components
│  │  └─ assets/             # Images, logos, SVGs
│  ├─ dist/                  # Vite build output
│  ├─ package.json
│  └─ tsconfig.json
├─ docs/
│  └─ screenshot.png
└─ package.json              # Root scripts (dev, build, start)
```

---

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local or Atlas)

---

## Installation

```bash
git clone <repo-url>
cd MyBlog
npm install
npm install --prefix server
npm install --prefix client
```

---

## Development

Run both backend and frontend concurrently from the root:

```bash
npm run dev
```

Or separately:

```bash
# Backend — Express + TypeScript
npm run dev --prefix server
# → http://localhost:3000

# Frontend — React + Vite
npm run dev --prefix client
# → http://localhost:5173 (with hot reload)
```

---

## Production Build & Run

```bash
# Build both
npm run build

# Start server (serves React build at port 3000)
npm start
```

---

## Environment Variables

Create a `.env` file in `server/`:

```
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret>
JWT_EXPIRES_IN=2h
RESEND_API_KEY=<your Resend API key>
MONGO_DUMP_PATH=<path to mongodump binary>
PORT=3000
```

---

## Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/articles` | Fetch all articles |
| `POST` | `/api/articles` | Create article (multipart, with image) |
| `PATCH` | `/api/articles/:id` | Update article |
| `DELETE` | `/api/articles/:id` | Delete article |
| `GET` | `/api/products` | Fetch all products |
| `POST` | `/api/products` | Create product (multipart, with images) |
| `PATCH` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `GET` | `/api/users` | Fetch all users |
| `POST` | `/api/users` | Create user |
| `PATCH` | `/api/user/:id` | Update user |
| `POST` | `/api/login` | Login — returns JWT |
| `GET` | `/api/settings` | Fetch app settings |
| `POST` | `/api/toggleMerch` | Toggle merch/memes display on homepage |
| `POST` | `/api/contact` | Submit contact form (sends email via Resend) |
| `POST` | `/api/backup` | Trigger MongoDB backup (admin) |
| `POST` | `/api/wipe` | Drop database (admin) |

Uploaded files are served statically at `/uploads/`.

---

## Notes

- Keep `node_modules`, `.env`, and `dist/` out of Git
- Development ports: backend `3000`, frontend `5173`
- Production: Express serves the React `dist/` at port `3000`
- JWT auth is used for protected admin/author actions
- The homepage toggles between a memes gallery and a merch store based on the `showMerch` setting
