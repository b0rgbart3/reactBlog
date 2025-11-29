# b0rgBlog

A full-stack web application with a **Node.js + Express backend** using **TypeScript** and a **React frontend** using **Vite**, with MongoDB as the database. This setup supports development and production environments, with separate dev servers for backend and frontend, and proper build pipelines.

---

## Table of Contents

1. [Project Structure](#project-structure)  
2. [Prerequisites](#prerequisites)  
3. [Installation](#installation)  
4. [Development](#development)  
5. [Production Build & Run](#production-build--run)  
6. [Backend API](#backend-api)  
7. [React Frontend](#react-frontend)  
8. [TypeScript Configurations](#typescript-configurations)  
9. [Notes](#notes)  

---

## Project Structure

```
MyBlog/
├─ server/
│  ├─ src/
│  │  ├─ server.ts
│  │  └─ models/
│  │      └─ Data.ts
│  ├─ dist/               # compiled TS output
│  ├─ package.json
│  └─ tsconfig.json
├─ client/
│  ├─ src/
│  │  ├─ App.tsx
│  │  └─ components/
│  │      └─ Home.tsx
│  ├─ dist/               # Vite build output
│  ├─ package.json
│  └─ tsconfig.json
└─ package.json           # root-level scripts
```

---

## Prerequisites

- Node.js >= 18.x  
- npm >= 9.x  
- MongoDB (locally or hosted)  

Optional global installs:  
```bash
npm install -g typescript ts-node
```

---

## Installation

Clone the repository:

```bash
git clone <repo-url>
cd MyBlog
```

Install dependencies for **server** and **client**:

```bash
npm install --prefix server
npm install --prefix client
```

---

## Development

### Backend

Run the Express + TypeScript backend in development:

```bash
npm run dev --prefix server
```

- Runs `ts-node src/server.ts`  
- API routes are served at: `http://localhost:3000/api/...`

### Frontend

Run React + Vite frontend:

```bash
npm run dev --prefix client
```

- Runs Vite dev server at: `http://localhost:5173`  
- Supports hot reload and fast iteration.

> **Tip:** Keep dev servers separate — frontend and backend run on different ports. Use Axios or fetch to hit backend APIs.

---

## Production Build & Run

### Build both server and client

```bash
npm run build --prefix server
npm run build --prefix client
```

### Start server with production React build

```bash
NODE_ENV=production npm start --prefix server
```

- Express serves the React `dist/` folder  
- All other paths route to `index.html`  

---

## Backend API

Example endpoints:

```ts
GET /api/myData       # Retrieve all data
POST /api/myData      # Add new data (JSON body)
```

Data schema example (`Data.ts`):

```ts
interface IData {
  id: string;
  message: string;
}
```

---

## React Frontend

- Developed with **React + Vite**  
- TypeScript enabled (`.tsx` files)  
- Axios used to call backend APIs:

```ts
const response = await axios.get("/api/myData");
```

- No `.js` extensions needed in imports — Vite handles module resolution.

---

## TypeScript Configurations

### Server (`server/tsconfig.json`)
- `module: NodeNext` → full ESM support  
- `rootDir: ./src`, `outDir: ./dist` → compiled output isolated  
- `esModuleInterop` + `allowSyntheticDefaultImports` for smooth imports  

### Client (`client/tsconfig.json`)
- `moduleResolution: bundler` → allows extension-less imports  
- `jsx: react-jsx` → modern React JSX transform  
- `strict: true` → TypeScript strict mode  

---

## Notes

- Keep **`node_modules`**, environment and compiled output (`dist/`) out of Git  
- Development ports:  
  - Backend: 3000  
  - Frontend (Vite): 5173  
- Production: serve React through Express at port 3000  

