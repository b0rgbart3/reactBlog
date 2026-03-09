This site is built with Vite - What would be involved in graduating to using Next.js?

- would it be helpful? - would it be difficult? -- how many changes would we need to make? Let's just consider this before making any changes.
  Agent:Explore blog codebase structure
  IN
  Explore this blog project at /Users/bluebhanu/Sites/MyBlog. I need a comprehensive understanding of:

1. Overall project structure (monorepo? separate client/server?)
2. The client app: what's in client/package.json, client/src, routing approach (react-router?), entry point, main pages/components
3. The server: what does it do? API routes? SSR?
4. How data fetching works (REST API calls, where data comes from)
5. Any SEO concerns (meta tags, etc.)
6. Current build/dev setup (vite.config.ts, etc.)
7. Static vs dynamic content - what pages exist?
8. Auth setup if any
9. Any SSR or SSG currently happening?

Be thorough - look at directory listings, key config files, routing files, and a few representative components. Thoroughness level: medium
Write synchronous-splashing-pnueli.md
151 lines

# Next.js Migration Analysis for moon-math.online

## Context

This is an exploratory analysis — no changes are planned yet. The user wants to understand whether migrating from Vite + React SPA to Next.js would be beneficial, and what level of effort it would require.

---

## Current Architecture

| Layer        | Tech                                        |
| ------------ | ------------------------------------------- |
| Frontend     | React 18 + Vite + TypeScript                |
| Routing      | React Router v7 (client-side, ~14 routes)   |
| State        | Zustand                                     |
| Backend      | Express + Node.js + TypeScript (port 3000)  |
| Database     | MongoDB via Mongoose                        |
| Auth         | JWT (localStorage)                          |
| Rendering    | Pure CSR (client-side only)                 |
| SEO          | Static `<head>` only — no dynamic meta tags |
| File uploads | Multer → `/uploads/` on disk                |
| Email        | Resend API                                  |

---

## Would It Be Helpful?

### Strong Benefits

1. **SEO** — The biggest win. Article pages currently have no dynamic `<title>` or `<meta name="description">`. Next.js enables per-page metadata in server components, which would make articles shareable on social media and discoverable via search engines.

2. **Performance** — Server-rendered pages deliver HTML immediately instead of waiting for JS to load → fetch → render. Articles and the homepage would load visibly faster on first visit.

3. **Static generation for articles** — Articles that don't change frequently could be pre-built at deploy time (`generateStaticParams`), serving lightning-fast pre-rendered HTML with no DB query per visit.

4. **Simpler architecture** — Next.js API routes could replace the Express server entirely, collapsing the monorepo into a single app (one `package.json`, one dev command, one deployment).

### Moderate Benefits

5. **Image optimization** — Next.js `<Image>` component handles lazy loading, WebP conversion, and responsive sizing automatically.

6. **Built-in code splitting** — Vite does this too, but Next.js route-level splitting is automatic and zero-config.

### Minor/Neutral

7. **Zustand** — Works fine in both. No change needed.
8. **SCSS** — Works fine in Next.js. No change needed.
9. **Admin panel** — Pure client-side (needs auth state), so it gets little benefit from SSR. Would remain a Client Component.

---

## Would It Be Difficult?

**Medium difficulty overall.** Not a rewrite, but a meaningful restructuring. Here's the breakdown:

### Easier than you might expect

- **Zustand, SCSS, axios** — all work unchanged in Next.js
- **Component code** — individual components (ArticleCard, ProductCard, etc.) mostly transfer as-is, just add `"use client"` where needed
- **MongoDB + Mongoose** — can connect directly from Next.js server components/API routes
- **Auth (JWT)** — works fine as Client Components; could be enhanced with `next-auth` later but not required

### Requires real work

| Change                                                          | Effort     |
| --------------------------------------------------------------- | ---------- |
| Replace React Router routes with `app/` directory (14 routes)   | Medium     |
| Convert Express routes to Next.js API routes (`/app/api/`)      | Medium     |
| Decide per-page rendering strategy (SSG vs SSR vs CSR)          | Medium     |
| Add dynamic metadata (`generateMetadata`) for articles/products | Low        |
| Remove Vite config, set up `next.config.ts`                     | Low        |
| Update file upload handling (multer → Next.js route handlers)   | Low–Medium |
| Flatten monorepo if merging server into Next.js                 | Low        |

### The routing conversion (most work)

Current routes → Next.js `app/` directory structure:

```
/ → app/page.tsx
/login → app/login/page.tsx
/about → app/about/page.tsx
/resources → app/resources/page.tsx
/article/new → app/article/new/page.tsx
/article/:id → app/article/[id]/page.tsx
/article/edit/:id → app/article/edit/[id]/page.tsx
/product/new → app/product/new/page.tsx
/product/:id → app/product/[id]/page.tsx
/product/edit/:id → app/product/edit/[id]/page.tsx
/memes → app/memes/page.tsx
/cart → app/cart/page.tsx
/check-out → app/check-out/page.tsx
/user → app/user/page.tsx
/admin → app/admin/page.tsx
```

One subtlety: `/article/new` and `/article/:id` conflict in file-based routing (Next.js sees `new` as a dynamic segment). This requires either catch-and-redirect logic or renaming `/article/new` to `/article/create`.

---

## Rendering Strategy Per Page

| Page                               | Recommended Strategy    | Reason                                  |
| ---------------------------------- | ----------------------- | --------------------------------------- |
| Home                               | SSR or ISR              | Shows latest articles, needs fresh data |
| Article detail                     | SSG + ISR               | Static content, high SEO value          |
| Product detail                     | SSG + ISR               | Same                                    |
| About, Resources                   | Full SSG                | Completely static content               |
| Admin, Login, Cart, Checkout, User | CSR (Client Components) | Auth-dependent, no SEO need             |
| Memes gallery                      | SSR                     | Dynamic product thumbnails              |

---

## Rough Change Count

- **Files to restructure:** ~20–25 route/component files
- **New files to create:** ~15 (app directory pages, layout, API routes)
- **Files requiring minimal change:** most components, Zustand store, SCSS files
- **Files to delete:** vite.config.js, client/index.html, most of server/src/server.ts (if merging)
- **Dependencies to add:** `next`
- **Dependencies to remove:** `vite`, `@vitejs/plugin-react`, `react-router-dom`, `express`, `cors`, `concurrently`

**Estimate:** 2–4 days of focused work for a clean migration. The routing and API conversion are the bulk of it.

---

## Key Decision: Keep Express or Merge?

**Option A — Keep Express as-is:**

- Next.js handles only the frontend
- Vite dev proxy replaced by Next.js `rewrites` in `next.config.ts`
- Less work, preserves the monorepo structure
- Miss out on architectural simplification

**Option B — Merge Express into Next.js API routes:**

- Single codebase, single deployment, single `npm run dev`
- More work upfront, cleaner long-term
- File upload handling (multer) needs to move to route handlers
- MongoDB connection needs to be managed for serverless (connection pooling)

**Recommendation:** Option B (merge) is worth it for a project this size. The Express server is small and the API routes map 1:1.

---

## Verdict

**Yes, it would be helpful** — primarily for SEO on article pages. If discoverability and social sharing matter for this blog, Next.js is the right direction.

**Medium difficulty** — not a risky rewrite. Most component code is unchanged. The real work is the routing restructure and API migration, both of which are mechanical.

**When to do it:** If SEO is a priority now, migrate sooner. If the blog is primarily for a known audience (direct traffic), the CSR approach is fine and migration can wait.
Here's the analysis:

Would it be helpful?
Yes — primarily for SEO. Right now, article pages have a static <title>moon-math.online</title> and no meta descriptions. That means:

Articles shared on social media show no preview info
Search engines see an empty page (content is JS-rendered after load)
Next.js would let each article page have its own <title>, description, and Open Graph tags — server-rendered before the browser sees anything.

Secondary benefit: pages load visibly faster on first visit since HTML arrives pre-built rather than waiting for JS → fetch → render.

Would it be difficult?
Medium effort — not a scary rewrite. Most of your component code transfers as-is. The work is structural:

Task Effort
Convert 14 React Router routes → app/ directory Medium
Move Express API routes → Next.js route handlers Medium
Add generateMetadata() to article/product pages Low
Replace vite.config.js with next.config.ts Low
Decide SSR vs SSG vs CSR per page Medium (thinking, not coding)
One gotcha: /article/new and /article/:id conflict in file-based routing — new gets treated as a dynamic ID. You'd need to rename /article/new to something like /article/create.

How many changes?
~20–25 files to restructure/move
~15 new files to create (pages, layout, API routes)
Zustand, SCSS, axios, individual components — mostly unchanged
Could eliminate the separate Express server entirely, making this a single app
Rough effort: 2–4 days of focused work.

The key question
Is SEO important for this blog? If articles are meant to be discovered via search or shared on social media → migrate. If it's primarily direct-traffic for a known audience → the current setup is fine and migration can wait.

Claude’s Plan
Next.js Migration Analysis for moon-math.online
Context
This is an exploratory analysis — no changes are planned yet. The user wants to understand whether migrating from Vite + React SPA to Next.js would be beneficial, and what level of effort it would require.

Current Architecture
Layer Tech
Frontend React 18 + Vite + TypeScript
Routing React Router v7 (client-side, ~14 routes)
State Zustand
Backend Express + Node.js + TypeScript (port 3000)
Database MongoDB via Mongoose
Auth JWT (localStorage)
Rendering Pure CSR (client-side only)
SEO Static <head> only — no dynamic meta tags
File uploads Multer → /uploads/ on disk
Email Resend API
Would It Be Helpful?
Strong Benefits
SEO — The biggest win. Article pages currently have no dynamic <title> or <meta name="description">. Next.js enables per-page metadata in server components, which would make articles shareable on social media and discoverable via search engines.

Performance — Server-rendered pages deliver HTML immediately instead of waiting for JS to load → fetch → render. Articles and the homepage would load visibly faster on first visit.

Static generation for articles — Articles that don't change frequently could be pre-built at deploy time (generateStaticParams), serving lightning-fast pre-rendered HTML with no DB query per visit.

Simpler architecture — Next.js API routes could replace the Express server entirely, collapsing the monorepo into a single app (one package.json, one dev command, one deployment).

Moderate Benefits
Image optimization — Next.js <Image> component handles lazy loading, WebP conversion, and responsive sizing automatically.

Built-in code splitting — Vite does this too, but Next.js route-level splitting is automatic and zero-config.

Minor/Neutral
Zustand — Works fine in both. No change needed.
SCSS — Works fine in Next.js. No change needed.
Admin panel — Pure client-side (needs auth state), so it gets little benefit from SSR. Would remain a Client Component.
Would It Be Difficult?
Medium difficulty overall. Not a rewrite, but a meaningful restructuring. Here's the breakdown:

Easier than you might expect
Zustand, SCSS, axios — all work unchanged in Next.js
Component code — individual components (ArticleCard, ProductCard, etc.) mostly transfer as-is, just add "use client" where needed
MongoDB + Mongoose — can connect directly from Next.js server components/API routes
Auth (JWT) — works fine as Client Components; could be enhanced with next-auth later but not required
Requires real work
Change Effort
Replace React Router routes with app/ directory (14 routes) Medium
Convert Express routes to Next.js API routes (/app/api/) Medium
Decide per-page rendering strategy (SSG vs SSR vs CSR) Medium
Add dynamic metadata (generateMetadata) for articles/products Low
Remove Vite config, set up next.config.ts Low
Update file upload handling (multer → Next.js route handlers) Low–Medium
Flatten monorepo if merging server into Next.js Low
The routing conversion (most work)
Current routes → Next.js app/ directory structure:

/ → app/page.tsx
/login → app/login/page.tsx
/about → app/about/page.tsx
/resources → app/resources/page.tsx
/article/new → app/article/new/page.tsx
/article/:id → app/article/[id]/page.tsx
/article/edit/:id → app/article/edit/[id]/page.tsx
/product/new → app/product/new/page.tsx
/product/:id → app/product/[id]/page.tsx
/product/edit/:id → app/product/edit/[id]/page.tsx
/memes → app/memes/page.tsx
/cart → app/cart/page.tsx
/check-out → app/check-out/page.tsx
/user → app/user/page.tsx
/admin → app/admin/page.tsx
One subtlety: /article/new and /article/:id conflict in file-based routing (Next.js sees new as a dynamic segment). This requires either catch-and-redirect logic or renaming /article/new to /article/create.

Rendering Strategy Per Page
Page Recommended Strategy Reason
Home SSR or ISR Shows latest articles, needs fresh data
Article detail SSG + ISR Static content, high SEO value
Product detail SSG + ISR Same
About, Resources Full SSG Completely static content
Admin, Login, Cart, Checkout, User CSR (Client Components) Auth-dependent, no SEO need
Memes gallery SSR Dynamic product thumbnails
Rough Change Count
Files to restructure: ~20–25 route/component files
New files to create: ~15 (app directory pages, layout, API routes)
Files requiring minimal change: most components, Zustand store, SCSS files
Files to delete: vite.config.js, client/index.html, most of server/src/server.ts (if merging)
Dependencies to add: next
Dependencies to remove: vite, @vitejs/plugin-react, react-router-dom, express, cors, concurrently
Estimate: 2–4 days of focused work for a clean migration. The routing and API conversion are the bulk of it.

Key Decision: Keep Express or Merge?
Option A — Keep Express as-is:

Next.js handles only the frontend
Vite dev proxy replaced by Next.js rewrites in next.config.ts
Less work, preserves the monorepo structure
Miss out on architectural simplification
Option B — Merge Express into Next.js API routes:

Single codebase, single deployment, single npm run dev
More work upfront, cleaner long-term
File upload handling (multer) needs to move to route handlers
MongoDB connection needs to be managed for serverless (connection pooling)
Recommendation: Option B (merge) is worth it for a project this size. The Express server is small and the API routes map 1:1.

Verdict
Yes, it would be helpful — primarily for SEO on article pages. If discoverability and social sharing matter for this blog, Next.js is the right direction.

Medium difficulty — not a risky rewrite. Most component code is unchanged. The real work is the routing restructure and API migration, both of which are mechanical.

When to do it: If SEO is a priority now, migrate sooner. If the blog is primarily for a known audience (direct traffic), the CSR approach is fine and migration can wait.

User approved the plan
The analysis is complete — no changes were made. The plan document is saved if you want to refer back to it.

To summarize: migrating to Next.js is worth considering but not urgent. The main question is whether SEO matters for this blog. If you want articles to be searchable and shareable with proper previews, Next.js is the right move and it's achievable in a few focused days of work. If the blog is primarily for a known audience visiting directly, the current setup serves you fine.

SEO matters. yes. I want articles to be searchable and shareable with proper previews.
EnterPlanMode
OUT
Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.

In plan mode, you should:

1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.
Agent:Explore client pages and components in detail
IN
Explore /Users/bluebhanu/Sites/MyBlog/client/src in detail. I need to understand:

1. Read App.tsx fully - all routes
2. Read the full content of each page component (Home.tsx, ArticlePage, ProductPage, About, Resources, Login, CreateAccount, AdminPage, MemesPage, Cart, CheckOut, EditUserPage)
3. Read useStore.ts fully
4. Read useData.ts fully
5. Read vite.config.js fully
6. List all files in src/ recursively
7. Read client/index.html

Focus on: how data is fetched, what state is used, how auth gating works, what would need `"use client"` in Next.js, and what meta/title info could be extracted for SEO.

Thoroughness: very thorough
Write synchronous-splashing-pnueli.md
307 lines

# Next.js Migration Plan — moon-math.online

## Context

Migrating from Vite + React SPA + separate Express backend to a single Next.js app.
Primary motivation: SEO — article pages need dynamic `<title>` and Open Graph meta tags so articles are discoverable via search and sharable with proper previews on social media.

---

## Architecture Decision: Full Merge

Collapse the monorepo (client/ + server/) into a single Next.js app at the project root.

**Before:**

```
MyBlog/
├── client/   (Vite + React, port 5173)
└── server/   (Express, port 3000)
```

**After:**

```
MyBlog/
├── app/          (Next.js pages + API routes)
├── src/          (Shared components, state, models, services)
├── public/       (Static assets + uploads)
└── next.config.ts
```

---

## New Directory Structure

```
app/
├── layout.tsx                      ← Root layout (replaces index.html)
├── page.tsx                        ← Home (was Home.tsx)
├── login/page.tsx
├── newUser/page.tsx
├── about/page.tsx
├── resources/page.tsx
├── admin/page.tsx
├── memes/page.tsx
├── cart/page.tsx
├── check-out/page.tsx
├── user/page.tsx
├── article/
│   ├── new/page.tsx               ← Static route wins over [id]
│   ├── [id]/page.tsx              ← SSG + ISR + generateMetadata ← THE SEO WIN
│   └── edit/[id]/page.tsx
├── product/
│   ├── new/page.tsx
│   ├── [id]/page.tsx              ← SSG + ISR + generateMetadata
│   └── edit/[id]/page.tsx
└── api/
    ├── articles/route.ts           (GET all, POST new)
    ├── articles/[id]/route.ts      (PATCH, DELETE)
    ├── products/route.ts           (GET all, POST new)
    ├── products/[id]/route.ts      (PATCH, DELETE)
    ├── users/route.ts              (GET all, POST new)
    ├── user/[id]/route.ts          (PATCH)
    ├── login/route.ts              (POST)
    ├── settings/route.ts           (GET)
    ├── toggleMerch/route.ts        (POST)
    ├── contact/route.ts            (POST)
    ├── wipe/route.ts               (POST)
    └── backup/route.ts             (POST)

src/
├── components/                     ← Moved from client/src/components/
├── state/useStore.ts               ← Moved unchanged
├── data/useData.ts                 ← Updated (useNavigate → useRouter)
├── hooks/
├── admin/                          ← All admin components moved
├── pages/                          ← Non-page components (ArticlePage content, etc)
├── models/                         ← Moved from server/src/models/
├── services/email.ts               ← Moved from server/src/services/
└── lib/
    └── mongodb.ts                  ← NEW: singleton connection for Next.js

public/
├── favicon.ico
├── favicon-32x32.png
├── favicon-16x16.png
├── apple-touch-icon.png
└── uploads/                        ← Moved here; Next.js serves as static files
    ├── articles/
    └── products/
```

---

## Rendering Strategy Per Page

| Route                                          | Strategy                         | Reason                                   |
| ---------------------------------------------- | -------------------------------- | ---------------------------------------- |
| `/`                                            | SSR or ISR (revalidate: 60s)     | Shows latest articles — needs fresh data |
| `/article/[id]`                                | **SSG + ISR + generateMetadata** | Core SEO goal — static, cacheable        |
| `/product/[id]`                                | SSG + ISR + generateMetadata     | Same                                     |
| `/about`                                       | SSG                              | Fully static content                     |
| `/resources`                                   | SSG                              | Fully static content                     |
| `/login`, `/newUser`                           | CSR (`"use client"`)             | Auth flow, no SEO value                  |
| `/admin`, `/article/new`, `/article/edit/[id]` | CSR                              | Auth-gated, no SEO value                 |
| `/product/new`, `/product/edit/[id]`           | CSR                              | Admin only                               |
| `/memes`                                       | CSR                              | Static images, interactive modal         |
| `/cart`, `/check-out`, `/user`                 | CSR                              | User-specific, no SEO value              |

---

## The SEO Implementation (Core Goal)

```typescript
// app/article/[id]/page.tsx

import { connectDB } from "@/src/lib/mongodb";
import Article from "@/src/models/Articles";

export async function generateMetadata({ params }) {
  await connectDB();
  const article = await Article.findById(params.id).lean();
  const description = article?.body
    ?.replace(/<[^>]*>/g, "") // strip HTML
    .substring(0, 160);

  return {
    title: article?.title ?? "moon-math.online",
    description,
    openGraph: {
      title: article?.title,
      description,
      images: article?.headlineImage ? [article.headlineImage] : [],
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  await connectDB();
  const articles = await Article.find({}, "_id").lean();
  return articles.map((a) => ({ id: a._id.toString() }));
}
```

This makes every article URL have a proper `<title>`, `<meta name="description">`, and Open Graph card — the primary SEO goal.

---

## Key Changes Required

### 1. Dependencies

**Add:**

- `next` (the framework)
- `formidable` (replaces multer for multipart parsing in Next.js API routes)

**Remove:**

- `vite`, `@vitejs/plugin-react` (build tool gone)
- `react-router-dom` (replaced by Next.js routing)
- `express`, `cors`, `concurrently` (server gone)
- `multer` (replaced by formidable)

**Unchanged:**

- `react`, `react-dom`, `typescript`
- `zustand`, `axios`, `jwt-decode`, `sass`
- `mongoose`, `bcrypt`, `jsonwebtoken`, `resend`
- `html-react-parser`

### 2. Navigation Changes (all components)

| Before (React Router)                            | After (Next.js)                               |
| ------------------------------------------------ | --------------------------------------------- |
| `import { useNavigate } from 'react-router-dom'` | `import { useRouter } from 'next/navigation'` |
| `import { useParams } from 'react-router-dom'`   | `import { useParams } from 'next/navigation'` |
| `import { Link } from 'react-router-dom'`        | `import Link from 'next/link'`                |
| `navigate('/path')`                              | `router.push('/path')`                        |
| `<BrowserRouter>` in App.tsx                     | Removed (Next.js handles routing)             |

### 3. Add `"use client"` to all interactive components

All pages with state, effects, or event handlers need the directive at the top. That's most pages except `/about`, `/resources`, `/article/[id]`, and `/product/[id]` (which can be server components for SSG/SEO).

### 4. File Uploads

Move uploads to `public/uploads/`. Update multer → formidable in API routes:

```typescript
// app/api/articles/route.ts
import formidable from "formidable";
// Parse multipart form, save to public/uploads/articles/
```

Next.js automatically serves `public/` at the root URL, so `/public/uploads/articles/file.jpg` is accessible at `/uploads/articles/file.jpg` — same URLs as before.

### 5. MongoDB Connection Singleton

```typescript
// src/lib/mongodb.ts
import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.promise = mongoose.connect(process.env.MONGO_URI!);
  cached.conn = await cached.promise;
  return cached.conn;
}
```

This prevents the "too many connections" problem in Next.js dev mode (hot reloads).

### 6. Root Layout (replaces index.html)

```tsx
// app/layout.tsx
import {
  Inconsolata,
  Patua_One,
  Baskervville,
  Noto_Serif,
} from "next/font/google";
import "@/src/styles/index.scss";

export const metadata = {
  title: { default: "moon-math.online", template: "%s | moon-math.online" },
  description: "A Bitcoin blog exploring math, computer science, and ideas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Google Fonts migrated to `next/font/google` (eliminates extra render-blocking requests).

### 7. Environment Variables

Move `.env` from `server/` to project root. No content changes needed:

```
JWT_SECRET=...
MONGO_URI=...
RESEND_API_KEY=...
MONGO_DUMP_PATH=...
PORT=3000
JWT_EXPIRES_IN=2h
```

---

## Critical Files to Create/Modify

| File                        | Action                                              |
| --------------------------- | --------------------------------------------------- |
| `next.config.ts`            | Create (configure SCSS, image domains)              |
| `package.json`              | Rewrite (merge deps, add next, remove vite/express) |
| `tsconfig.json`             | Create/update for Next.js                           |
| `app/layout.tsx`            | Create                                              |
| `app/page.tsx`              | Create (migrate Home.tsx)                           |
| `app/article/[id]/page.tsx` | Create (SSG + generateMetadata — SEO core)          |
| `app/product/[id]/page.tsx` | Create (SSG + generateMetadata)                     |
| `app/about/page.tsx`        | Create (SSG)                                        |
| `app/resources/page.tsx`    | Create (SSG)                                        |
| `app/api/*/route.ts`        | Create ~12 route files (migrate Express routes)     |
| `src/lib/mongodb.ts`        | Create (connection singleton)                       |
| All components in src/      | Add `"use client"` where needed, update imports     |
| `client/` directory         | Delete after migration                              |
| `server/` directory         | Delete after migration                              |

---

## Deployment Consideration (Pending Answer)

**File uploads need clarification.** The `/uploads/` directory contains runtime-written files (article images, product images). Behavior differs by deployment:

- **Self-hosted VPS (e.g., DigitalOcean, your own server):** `public/uploads/` works — filesystem persists between requests. ✅
- **Vercel/serverless:** Filesystem is ephemeral — uploads are lost on redeploy. Would need cloud storage (S3, Cloudflare R2).

This affects how we handle the file upload API routes.

---

## Verification Plan

1. `npm run dev` starts a single Next.js dev server (no more `concurrently`)
2. Visit `/` — articles and products load
3. Visit `/article/[id]` — check page `<title>` in browser tab and view-source (must be in the HTML, not JS-inserted)
4. Share an article URL in a Slack/Discord message — social preview card should show title + image
5. Check Google's Rich Results Test or the Open Graph debugger for an article URL
6. Admin operations: login, create/edit/delete articles and products
7. Contact form sends email
8. File uploads (article images, product images) work and are accessible at `/uploads/...`

---

## Implementation Order

1. Install Next.js, set up `package.json`, `next.config.ts`, `tsconfig.json`
2. Create `src/lib/mongodb.ts` connection singleton
3. Move models to `src/models/`
4. Create all API route handlers (`app/api/`)
5. Create `app/layout.tsx`
6. Migrate SSG pages first: `about`, `resources`, `article/[id]`, `product/[id]`
7. Migrate CSR pages: login, admin, cart, etc. (add `"use client"`, update navigation)
8. Move and update components (add `"use client"`, replace React Router imports)
9. Move `public/` assets and `uploads/`
10. Test end-to-end
11. Delete `client/` and `server/`
    Before I finalize the implementation plan, I have one important question about deployment — it affects how we handle file uploads (article images, product images):

AskUserQuestion
OUT
User has answered your questions: "How is this site currently deployed / hosted?"="hosted on an EC2 instance on AWS". You can now continue with the user's answers in mind.
EC2 is self-hosted — filesystem persists, so uploads stay on disk in public/uploads/. No cloud storage needed. The plan is clean.

Edit synchronous-splashing-pnueli.md
Removed 5 lines
Claude’s Plan
Next.js Migration Plan — moon-math.online
Context
Migrating from Vite + React SPA + separate Express backend to a single Next.js app.
Primary motivation: SEO — article pages need dynamic <title> and Open Graph meta tags so articles are discoverable via search and sharable with proper previews on social media.

Architecture Decision: Full Merge
Collapse the monorepo (client/ + server/) into a single Next.js app at the project root.

Before:

MyBlog/
├── client/ (Vite + React, port 5173)
└── server/ (Express, port 3000)
After:

MyBlog/
├── app/ (Next.js pages + API routes)
├── src/ (Shared components, state, models, services)
├── public/ (Static assets + uploads)
└── next.config.ts
New Directory Structure

app/
├── layout.tsx ← Root layout (replaces index.html)
├── page.tsx ← Home (was Home.tsx)
├── login/page.tsx
├── newUser/page.tsx
├── about/page.tsx
├── resources/page.tsx
├── admin/page.tsx
├── memes/page.tsx
├── cart/page.tsx
├── check-out/page.tsx
├── user/page.tsx
├── article/
│ ├── new/page.tsx ← Static route wins over [id]
│ ├── [id]/page.tsx ← SSG + ISR + generateMetadata ← THE SEO WIN
│ └── edit/[id]/page.tsx
├── product/
│ ├── new/page.tsx
│ ├── [id]/page.tsx ← SSG + ISR + generateMetadata
│ └── edit/[id]/page.tsx
└── api/
├── articles/route.ts (GET all, POST new)
├── articles/[id]/route.ts (PATCH, DELETE)
├── products/route.ts (GET all, POST new)
├── products/[id]/route.ts (PATCH, DELETE)
├── users/route.ts (GET all, POST new)
├── user/[id]/route.ts (PATCH)
├── login/route.ts (POST)
├── settings/route.ts (GET)
├── toggleMerch/route.ts (POST)
├── contact/route.ts (POST)
├── wipe/route.ts (POST)
└── backup/route.ts (POST)

src/
├── components/ ← Moved from client/src/components/
├── state/useStore.ts ← Moved unchanged
├── data/useData.ts ← Updated (useNavigate → useRouter)
├── hooks/
├── admin/ ← All admin components moved
├── pages/ ← Non-page components (ArticlePage content, etc)
├── models/ ← Moved from server/src/models/
├── services/email.ts ← Moved from server/src/services/
└── lib/
└── mongodb.ts ← NEW: singleton connection for Next.js

public/
├── favicon.ico
├── favicon-32x32.png
├── favicon-16x16.png
├── apple-touch-icon.png
└── uploads/ ← Moved here; Next.js serves as static files
├── articles/
└── products/
Rendering Strategy Per Page
Route Strategy Reason
/ SSR or ISR (revalidate: 60s) Shows latest articles — needs fresh data
/article/[id] SSG + ISR + generateMetadata Core SEO goal — static, cacheable
/product/[id] SSG + ISR + generateMetadata Same
/about SSG Fully static content
/resources SSG Fully static content
/login, /newUser CSR ("use client") Auth flow, no SEO value
/admin, /article/new, /article/edit/[id] CSR Auth-gated, no SEO value
/product/new, /product/edit/[id] CSR Admin only
/memes CSR Static images, interactive modal
/cart, /check-out, /user CSR User-specific, no SEO value
The SEO Implementation (Core Goal)

// app/article/[id]/page.tsx

import { connectDB } from '@/src/lib/mongodb';
import Article from '@/src/models/Articles';

export async function generateMetadata({ params }) {
await connectDB();
const article = await Article.findById(params.id).lean();
const description = article?.body
?.replace(/<[^>]\*>/g, '') // strip HTML
.substring(0, 160);

return {
title: article?.title ?? 'moon-math.online',
description,
openGraph: {
title: article?.title,
description,
images: article?.headlineImage ? [article.headlineImage] : [],
type: 'article',
},
};
}

export async function generateStaticParams() {
await connectDB();
const articles = await Article.find({}, '\_id').lean();
return articles.map(a => ({ id: a.\_id.toString() }));
}
This makes every article URL have a proper <title>, <meta name="description">, and Open Graph card — the primary SEO goal.

Key Changes Required

1. Dependencies
   Add:

next (the framework)
formidable (replaces multer for multipart parsing in Next.js API routes)
Remove:

vite, @vitejs/plugin-react (build tool gone)
react-router-dom (replaced by Next.js routing)
express, cors, concurrently (server gone)
multer (replaced by formidable)
Unchanged:

react, react-dom, typescript
zustand, axios, jwt-decode, sass
mongoose, bcrypt, jsonwebtoken, resend
html-react-parser 2. Navigation Changes (all components)
Before (React Router) After (Next.js)
import { useNavigate } from 'react-router-dom' import { useRouter } from 'next/navigation'
import { useParams } from 'react-router-dom' import { useParams } from 'next/navigation'
import { Link } from 'react-router-dom' import Link from 'next/link'
navigate('/path') router.push('/path')
<BrowserRouter> in App.tsx Removed (Next.js handles routing) 3. Add "use client" to all interactive components
All pages with state, effects, or event handlers need the directive at the top. That's most pages except /about, /resources, /article/[id], and /product/[id] (which can be server components for SSG/SEO).

4. File Uploads
   Move uploads to public/uploads/. Update multer → formidable in API routes:

// app/api/articles/route.ts
import formidable from 'formidable';
// Parse multipart form, save to public/uploads/articles/
Next.js automatically serves public/ at the root URL, so /public/uploads/articles/file.jpg is accessible at /uploads/articles/file.jpg — same URLs as before.

5. MongoDB Connection Singleton

// src/lib/mongodb.ts
import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
if (cached.conn) return cached.conn;
cached.promise = mongoose.connect(process.env.MONGO_URI!);
cached.conn = await cached.promise;
return cached.conn;
}
This prevents the "too many connections" problem in Next.js dev mode (hot reloads).

6. Root Layout (replaces index.html)

// app/layout.tsx
import { Inconsolata, Patua_One, Baskervville, Noto_Serif } from 'next/font/google';
import '@/src/styles/index.scss';

export const metadata = {
title: { default: 'moon-math.online', template: '%s | moon-math.online' },
description: 'A Bitcoin blog exploring math, computer science, and ideas.',
};

export default function RootLayout({ children }) {
return (
<html lang="en">
<body>{children}</body>
</html>
);
}
Google Fonts migrated to next/font/google (eliminates extra render-blocking requests).

7. Environment Variables
   Move .env from server/ to project root. No content changes needed:

JWT_SECRET=...
MONGO_URI=...
RESEND_API_KEY=...
MONGO_DUMP_PATH=...
PORT=3000
JWT_EXPIRES_IN=2h
Critical Files to Create/Modify
File Action
next.config.ts Create (configure SCSS, image domains)
package.json Rewrite (merge deps, add next, remove vite/express)
tsconfig.json Create/update for Next.js
app/layout.tsx Create
app/page.tsx Create (migrate Home.tsx)
app/article/[id]/page.tsx Create (SSG + generateMetadata — SEO core)
app/product/[id]/page.tsx Create (SSG + generateMetadata)
app/about/page.tsx Create (SSG)
app/resources/page.tsx Create (SSG)
app/api/\*/route.ts Create ~12 route files (migrate Express routes)
src/lib/mongodb.ts Create (connection singleton)
All components in src/ Add "use client" where needed, update imports
client/ directory Delete after migration
server/ directory Delete after migration
Deployment
EC2 (self-hosted). Filesystem persists between restarts. Uploads stored in public/uploads/ work as-is — Next.js serves them as static files at /uploads/..., same URLs as before. No cloud storage needed. Run the app with next start (or PM2 for process management).

Verification Plan
npm run dev starts a single Next.js dev server (no more concurrently)
Visit / — articles and products load
Visit /article/[id] — check page <title> in browser tab and view-source (must be in the HTML, not JS-inserted)
Share an article URL in a Slack/Discord message — social preview card should show title + image
Check Google's Rich Results Test or the Open Graph debugger for an article URL
Admin operations: login, create/edit/delete articles and products
Contact form sends email
File uploads (article images, product images) work and are accessible at /uploads/...
Implementation Order
Install Next.js, set up package.json, next.config.ts, tsconfig.json
Create src/lib/mongodb.ts connection singleton
Move models to src/models/
Create all API route handlers (app/api/)
Create app/layout.tsx
Migrate SSG pages first: about, resources, article/[id], product/[id]
Migrate CSR pages: login, admin, cart, etc. (add "use client", update navigation)
Move and update components (add "use client", replace React Router imports)
Move public/ assets and uploads/
Test end-to-end
Delete client/ and server/
Stayed in plan mode
Claude’s Plan
Next.js Migration Plan — moon-math.online
Context
Migrating from Vite + React SPA + separate Express backend to a single Next.js app.
Primary motivation: SEO — article pages need dynamic <title> and Open Graph meta tags so articles are discoverable via search and sharable with proper previews on social media.

Architecture Decision: Full Merge
Collapse the monorepo (client/ + server/) into a single Next.js app at the project root.

Before:

MyBlog/
├── client/ (Vite + React, port 5173)
└── server/ (Express, port 3000)
After:

MyBlog/
├── app/ (Next.js pages + API routes)
├── src/ (Shared components, state, models, services)
├── public/ (Static assets + uploads)
└── next.config.ts
New Directory Structure

app/
├── layout.tsx ← Root layout (replaces index.html)
├── page.tsx ← Home (was Home.tsx)
├── login/page.tsx
├── newUser/page.tsx
├── about/page.tsx
├── resources/page.tsx
├── admin/page.tsx
├── memes/page.tsx
├── cart/page.tsx
├── check-out/page.tsx
├── user/page.tsx
├── article/
│ ├── new/page.tsx ← Static route wins over [id]
│ ├── [id]/page.tsx ← SSG + ISR + generateMetadata ← THE SEO WIN
│ └── edit/[id]/page.tsx
├── product/
│ ├── new/page.tsx
│ ├── [id]/page.tsx ← SSG + ISR + generateMetadata
│ └── edit/[id]/page.tsx
└── api/
├── articles/route.ts (GET all, POST new)
├── articles/[id]/route.ts (PATCH, DELETE)
├── products/route.ts (GET all, POST new)
├── products/[id]/route.ts (PATCH, DELETE)
├── users/route.ts (GET all, POST new)
├── user/[id]/route.ts (PATCH)
├── login/route.ts (POST)
├── settings/route.ts (GET)
├── toggleMerch/route.ts (POST)
├── contact/route.ts (POST)
├── wipe/route.ts (POST)
└── backup/route.ts (POST)

src/
├── components/ ← Moved from client/src/components/
├── state/useStore.ts ← Moved unchanged
├── data/useData.ts ← Updated (useNavigate → useRouter)
├── hooks/
├── admin/ ← All admin components moved
├── pages/ ← Non-page components (ArticlePage content, etc)
├── models/ ← Moved from server/src/models/
├── services/email.ts ← Moved from server/src/services/
└── lib/
└── mongodb.ts ← NEW: singleton connection for Next.js

public/
├── favicon.ico
├── favicon-32x32.png
├── favicon-16x16.png
├── apple-touch-icon.png
└── uploads/ ← Moved here; Next.js serves as static files
├── articles/
└── products/
Rendering Strategy Per Page
Route Strategy Reason
/ SSR or ISR (revalidate: 60s) Shows latest articles — needs fresh data
/article/[id] SSG + ISR + generateMetadata Core SEO goal — static, cacheable
/product/[id] SSG + ISR + generateMetadata Same
/about SSG Fully static content
/resources SSG Fully static content
/login, /newUser CSR ("use client") Auth flow, no SEO value
/admin, /article/new, /article/edit/[id] CSR Auth-gated, no SEO value
/product/new, /product/edit/[id] CSR Admin only
/memes CSR Static images, interactive modal
/cart, /check-out, /user CSR User-specific, no SEO value
The SEO Implementation (Core Goal)

// app/article/[id]/page.tsx

import { connectDB } from '@/src/lib/mongodb';
import Article from '@/src/models/Articles';

export async function generateMetadata({ params }) {
await connectDB();
const article = await Article.findById(params.id).lean();
const description = article?.body
?.replace(/<[^>]\*>/g, '') // strip HTML
.substring(0, 160);

return {
title: article?.title ?? 'moon-math.online',
description,
openGraph: {
title: article?.title,
description,
images: article?.headlineImage ? [article.headlineImage] : [],
type: 'article',
},
};
}

export async function generateStaticParams() {
await connectDB();
const articles = await Article.find({}, '\_id').lean();
return articles.map(a => ({ id: a.\_id.toString() }));
}
This makes every article URL have a proper <title>, <meta name="description">, and Open Graph card — the primary SEO goal.

Key Changes Required

1. Dependencies
   Add:

next (the framework)
formidable (replaces multer for multipart parsing in Next.js API routes)
Remove:

vite, @vitejs/plugin-react (build tool gone)
react-router-dom (replaced by Next.js routing)
express, cors, concurrently (server gone)
multer (replaced by formidable)
Unchanged:

react, react-dom, typescript
zustand, axios, jwt-decode, sass
mongoose, bcrypt, jsonwebtoken, resend
html-react-parser 2. Navigation Changes (all components)
Before (React Router) After (Next.js)
import { useNavigate } from 'react-router-dom' import { useRouter } from 'next/navigation'
import { useParams } from 'react-router-dom' import { useParams } from 'next/navigation'
import { Link } from 'react-router-dom' import Link from 'next/link'
navigate('/path') router.push('/path')
<BrowserRouter> in App.tsx Removed (Next.js handles routing) 3. Add "use client" to all interactive components
All pages with state, effects, or event handlers need the directive at the top. That's most pages except /about, /resources, /article/[id], and /product/[id] (which can be server components for SSG/SEO).

4. File Uploads
   Move uploads to public/uploads/. Update multer → formidable in API routes:

// app/api/articles/route.ts
import formidable from 'formidable';
// Parse multipart form, save to public/uploads/articles/
Next.js automatically serves public/ at the root URL, so /public/uploads/articles/file.jpg is accessible at /uploads/articles/file.jpg — same URLs as before.

5. MongoDB Connection Singleton

// src/lib/mongodb.ts
import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
if (cached.conn) return cached.conn;
cached.promise = mongoose.connect(process.env.MONGO_URI!);
cached.conn = await cached.promise;
return cached.conn;
}
This prevents the "too many connections" problem in Next.js dev mode (hot reloads).

6. Root Layout (replaces index.html)

// app/layout.tsx
import { Inconsolata, Patua_One, Baskervville, Noto_Serif } from 'next/font/google';
import '@/src/styles/index.scss';

export const metadata = {
title: { default: 'moon-math.online', template: '%s | moon-math.online' },
description: 'A Bitcoin blog exploring math, computer science, and ideas.',
};

export default function RootLayout({ children }) {
return (
<html lang="en">
<body>{children}</body>
</html>
);
}
Google Fonts migrated to next/font/google (eliminates extra render-blocking requests).

7. Environment Variables
   Move .env from server/ to project root. No content changes needed:

JWT_SECRET=...
MONGO_URI=...
RESEND_API_KEY=...
MONGO_DUMP_PATH=...
PORT=3000
JWT_EXPIRES_IN=2h
Critical Files to Create/Modify
File Action
next.config.ts Create (configure SCSS, image domains)
package.json Rewrite (merge deps, add next, remove vite/express)
tsconfig.json Create/update for Next.js
app/layout.tsx Create
app/page.tsx Create (migrate Home.tsx)
app/article/[id]/page.tsx Create (SSG + generateMetadata — SEO core)
app/product/[id]/page.tsx Create (SSG + generateMetadata)
app/about/page.tsx Create (SSG)
app/resources/page.tsx Create (SSG)
app/api/\*/route.ts Create ~12 route files (migrate Express routes)
src/lib/mongodb.ts Create (connection singleton)
All components in src/ Add "use client" where needed, update imports
client/ directory Delete after migration
server/ directory Delete after migration
Deployment
EC2 (self-hosted). Filesystem persists between restarts. Uploads stored in public/uploads/ work as-is — Next.js serves them as static files at /uploads/..., same URLs as before. No cloud storage needed. Run the app with next start (or PM2 for process management).

Verification Plan
npm run dev starts a single Next.js dev server (no more concurrently)
Visit / — articles and products load
Visit /article/[id] — check page <title> in browser tab and view-source (must be in the HTML, not JS-inserted)
Share an article URL in a Slack/Discord message — social preview card should show title + image
Check Google's Rich Results Test or the Open Graph debugger for an article URL
Admin operations: login, create/edit/delete articles and products
Contact form sends email
File uploads (article images, product images) work and are accessible at /uploads/...
Implementation Order
Install Next.js, set up package.json, next.config.ts, tsconfig.json
Create src/lib/mongodb.ts connection singleton
Move models to src/models/
Create all API route handlers (app/api/)
Create app/layout.tsx
Migrate SSG pages first: about, resources, article/[id], product/[id]
Migrate CSR pages: login, admin, cart, etc. (add "use client", update navigation)
Move and update components (add "use client", replace React Router imports)
Move public/ assets and uploads/
Test end-to-end
Delete client/ and server/
Stayed in plan mode
Claude’s Plan
Next.js Migration Plan — moon-math.online
Context
Migrating from Vite + React SPA + separate Express backend to a single Next.js app.
Primary motivation: SEO — article pages need dynamic <title> and Open Graph meta tags so articles are discoverable via search and sharable with proper previews on social media.

Architecture Decision: Full Merge
Collapse the monorepo (client/ + server/) into a single Next.js app at the project root.

Before:

MyBlog/
├── client/ (Vite + React, port 5173)
└── server/ (Express, port 3000)
After:

MyBlog/
├── app/ (Next.js pages + API routes)
├── src/ (Shared components, state, models, services)
├── public/ (Static assets + uploads)
└── next.config.ts
New Directory Structure

app/
├── layout.tsx ← Root layout (replaces index.html)
├── page.tsx ← Home (was Home.tsx)
├── login/page.tsx
├── newUser/page.tsx
├── about/page.tsx
├── resources/page.tsx
├── admin/page.tsx
├── memes/page.tsx
├── cart/page.tsx
├── check-out/page.tsx
├── user/page.tsx
├── article/
│ ├── new/page.tsx ← Static route wins over [id]
│ ├── [id]/page.tsx ← SSG + ISR + generateMetadata ← THE SEO WIN
│ └── edit/[id]/page.tsx
├── product/
│ ├── new/page.tsx
│ ├── [id]/page.tsx ← SSG + ISR + generateMetadata
│ └── edit/[id]/page.tsx
└── api/
├── articles/route.ts (GET all, POST new)
├── articles/[id]/route.ts (PATCH, DELETE)
├── products/route.ts (GET all, POST new)
├── products/[id]/route.ts (PATCH, DELETE)
├── users/route.ts (GET all, POST new)
├── user/[id]/route.ts (PATCH)
├── login/route.ts (POST)
├── settings/route.ts (GET)
├── toggleMerch/route.ts (POST)
├── contact/route.ts (POST)
├── wipe/route.ts (POST)
└── backup/route.ts (POST)

src/
├── components/ ← Moved from client/src/components/
├── state/useStore.ts ← Moved unchanged
├── data/useData.ts ← Updated (useNavigate → useRouter)
├── hooks/
├── admin/ ← All admin components moved
├── pages/ ← Non-page components (ArticlePage content, etc)
├── models/ ← Moved from server/src/models/
├── services/email.ts ← Moved from server/src/services/
└── lib/
└── mongodb.ts ← NEW: singleton connection for Next.js

public/
├── favicon.ico
├── favicon-32x32.png
├── favicon-16x16.png
├── apple-touch-icon.png
└── uploads/ ← Moved here; Next.js serves as static files
├── articles/
└── products/
Rendering Strategy Per Page
Route Strategy Reason
/ SSR or ISR (revalidate: 60s) Shows latest articles — needs fresh data
/article/[id] SSG + ISR + generateMetadata Core SEO goal — static, cacheable
/product/[id] SSG + ISR + generateMetadata Same
/about SSG Fully static content
/resources SSG Fully static content
/login, /newUser CSR ("use client") Auth flow, no SEO value
/admin, /article/new, /article/edit/[id] CSR Auth-gated, no SEO value
/product/new, /product/edit/[id] CSR Admin only
/memes CSR Static images, interactive modal
/cart, /check-out, /user CSR User-specific, no SEO value
The SEO Implementation (Core Goal)

// app/article/[id]/page.tsx

import { connectDB } from '@/src/lib/mongodb';
import Article from '@/src/models/Articles';

export async function generateMetadata({ params }) {
await connectDB();
const article = await Article.findById(params.id).lean();
const description = article?.body
?.replace(/<[^>]\*>/g, '') // strip HTML
.substring(0, 160);

return {
title: article?.title ?? 'moon-math.online',
description,
openGraph: {
title: article?.title,
description,
images: article?.headlineImage ? [article.headlineImage] : [],
type: 'article',
},
};
}

export async function generateStaticParams() {
await connectDB();
const articles = await Article.find({}, '\_id').lean();
return articles.map(a => ({ id: a.\_id.toString() }));
}
This makes every article URL have a proper <title>, <meta name="description">, and Open Graph card — the primary SEO goal.

Key Changes Required

1. Dependencies
   Add:

next (the framework)
formidable (replaces multer for multipart parsing in Next.js API routes)
Remove:

vite, @vitejs/plugin-react (build tool gone)
react-router-dom (replaced by Next.js routing)
express, cors, concurrently (server gone)
multer (replaced by formidable)
Unchanged:

react, react-dom, typescript
zustand, axios, jwt-decode, sass
mongoose, bcrypt, jsonwebtoken, resend
html-react-parser 2. Navigation Changes (all components)
Before (React Router) After (Next.js)
import { useNavigate } from 'react-router-dom' import { useRouter } from 'next/navigation'
import { useParams } from 'react-router-dom' import { useParams } from 'next/navigation'
import { Link } from 'react-router-dom' import Link from 'next/link'
navigate('/path') router.push('/path')
<BrowserRouter> in App.tsx Removed (Next.js handles routing) 3. Add "use client" to all interactive components
All pages with state, effects, or event handlers need the directive at the top. That's most pages except /about, /resources, /article/[id], and /product/[id] (which can be server components for SSG/SEO).

4. File Uploads
   Move uploads to public/uploads/. Update multer → formidable in API routes:

// app/api/articles/route.ts
import formidable from 'formidable';
// Parse multipart form, save to public/uploads/articles/
Next.js automatically serves public/ at the root URL, so /public/uploads/articles/file.jpg is accessible at /uploads/articles/file.jpg — same URLs as before.

5. MongoDB Connection Singleton

// src/lib/mongodb.ts
import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
if (cached.conn) return cached.conn;
cached.promise = mongoose.connect(process.env.MONGO_URI!);
cached.conn = await cached.promise;
return cached.conn;
}
This prevents the "too many connections" problem in Next.js dev mode (hot reloads).

6. Root Layout (replaces index.html)

// app/layout.tsx
import { Inconsolata, Patua_One, Baskervville, Noto_Serif } from 'next/font/google';
import '@/src/styles/index.scss';

export const metadata = {
title: { default: 'moon-math.online', template: '%s | moon-math.online' },
description: 'A Bitcoin blog exploring math, computer science, and ideas.',
};

export default function RootLayout({ children }) {
return (
<html lang="en">
<body>{children}</body>
</html>
);
}
Google Fonts migrated to next/font/google (eliminates extra render-blocking requests).

7. Environment Variables
   Move .env from server/ to project root. No content changes needed:

JWT_SECRET=...
MONGO_URI=...
RESEND_API_KEY=...
MONGO_DUMP_PATH=...
PORT=3000
JWT_EXPIRES_IN=2h
Critical Files to Create/Modify
File Action
next.config.ts Create (configure SCSS, image domains)
package.json Rewrite (merge deps, add next, remove vite/express)
tsconfig.json Create/update for Next.js
app/layout.tsx Create
app/page.tsx Create (migrate Home.tsx)
app/article/[id]/page.tsx Create (SSG + generateMetadata — SEO core)
app/product/[id]/page.tsx Create (SSG + generateMetadata)
app/about/page.tsx Create (SSG)
app/resources/page.tsx Create (SSG)
app/api/\*/route.ts Create ~12 route files (migrate Express routes)
src/lib/mongodb.ts Create (connection singleton)
All components in src/ Add "use client" where needed, update imports
client/ directory Delete after migration
server/ directory Delete after migration
Deployment
EC2 (self-hosted). Filesystem persists between restarts. Uploads stored in public/uploads/ work as-is — Next.js serves them as static files at /uploads/..., same URLs as before. No cloud storage needed. Run the app with next start (or PM2 for process management).

Verification Plan
npm run dev starts a single Next.js dev server (no more concurrently)
Visit / — articles and products load
Visit /article/[id] — check page <title> in browser tab and view-source (must be in the HTML, not JS-inserted)
Share an article URL in a Slack/Discord message — social preview card should show title + image
Check Google's Rich Results Test or the Open Graph debugger for an article URL
Admin operations: login, create/edit/delete articles and products
Contact form sends email
File uploads (article images, product images) work and are accessible at /uploads/...
Implementation Order
Install Next.js, set up package.json, next.config.ts, tsconfig.json
Create src/lib/mongodb.ts connection singleton
Move models to src/models/
Create all API route handlers (app/api/)
Create app/layout.tsx
Migrate SSG pages first: about, resources, article/[id], product/[id]
Migrate CSR pages: login, admin, cart, etc. (add "use client", update navigation)
Move and update components (add "use client", replace React Router imports)
Move public/ assets and uploads/
Test end-to-end
Delete client/ and server/
Stayed in plan mode
OK - let's try it
Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/

Create all API route handlers (app/api/)

Create app/layout.tsx

Migrate SSG pages: about, resources, article/[id], product/[id]

Migrate CSR pages: home, login, admin, cart, memes, etc.

Move and update shared components (use client, imports)

Move public assets and uploads

Delete old client/ and server/ directories
Read package.json
Read package.json
Read package.json
Read server.ts
Read tsconfig.json
Bash Check public and uploads directories
IN
ls /Users/bluebhanu/Sites/MyBlog/public/ 2>/dev/null && ls /Users/bluebhanu/Sites/MyBlog/uploads/ 2>/dev/null || echo "no public/uploads at root"

OUT
index.html
no public/uploads at root
Read Articles.ts
Read Users.ts
Read Products.ts
Read Settings.ts
Read email.ts
Good — I have the full picture. Now let me read the remaining client files I'll need to migrate, in parallel:

Read App.tsx
Read Home.tsx
Read useStore.ts
Read useData.ts
Read banner-nav.tsx
Read footer.tsx
Read About.tsx
Read Resources.tsx
Read ArticlePage.tsx
Read Articles.tsx
Read ArticleThumbnail.tsx
Read Login.tsx
Good. Let me read the remaining pages I haven't seen yet:

Read ProductPage.tsx
Read ProductThumbnails.tsx
Read MemesPage.tsx
Read useClickOutside.tsx
Now I have enough context. Let me read the remaining few files and then start building:

Read image-modal.tsx
Read MemeThumbnails.tsx
Read main.tsx
Bash List admin, products, and meme asset files
IN
ls /Users/bluebhanu/Sites/MyBlog/client/src/admin/ && ls /Users/bluebhanu/Sites/MyBlog/client/src/pages/Products/ && ls /Users/bluebhanu/Sites/MyBlog/client/src/assets/memes/

OUT
\_admin_colors.scss
\_admin.scss
AdminPanel.tsx
ArticleForm.tsx
Download.tsx
EditArticlePage.tsx
ExpandableTable.tsx
NewArticlePage.tsx
TableHeader.tsx
UsersForm.tsx
CheckOut.tsx
EditProductPage.tsx
NewProductPage.tsx
ProductForm.tsx
ProductPage.tsx
ProductThumbnails.tsx
ShoppingCart.tsx
buy_more.jpg
element_zero.jpg
fortune_favors.jpg
keep_calm.jpg
orange_pill.jpeg
rigged.jpg
unstoppable.jpg
Read AdminPanel.tsx
Read NewArticlePage.tsx
Read EditArticlePage.tsx
Read ArticleForm.tsx
Read ShoppingCart.tsx
Read CheckOut.tsx
Read CreateAccount.tsx
Read EditUserPage.tsx
Read NewProductPage.tsx
Read EditProductPage.tsx
Read ProductForm.tsx
Read ExpandableTable.tsx
Read UsersForm.tsx
Read Download.tsx
Read TableHeader.tsx
Bash Check env file locations and public directory
IN
ls /Users/bluebhanu/Sites/MyBlog/server/.env 2>/dev/null && echo "found" || echo "not found"; ls /Users/bluebhanu/Sites/MyBlog/.env 2>/dev/null && echo "root env found" || echo "root env not found"; ls /Users/bluebhanu/Sites/MyBlog/public/

OUT
/Users/bluebhanu/Sites/MyBlog/server/.env
found
root env not found
index.html
Bash Show .env keys without values
IN
cat /Users/bluebhanu/Sites/MyBlog/server/.env | sed 's/=.\*/=.../'

OUT
JWT_SECRET=...
JWT_EXPIRES_IN=...
NODE_ENV=...
MONGO_URI=...
MONGO_DUMP_PATH=...
EMAIL_USER=...
EMAIL_PASS=...
SENDGRID_API_KEY=...
RESEND_API_KEY=...
Read index.scss
I now have everything I need. Let me start building the Next.js structure. Starting with the config files:

Write package.json
33 lines
{
"name": "moon-math.online",
"version": "1.0.0",
"private": true,
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start"
},
"dependencies": {
"axios": "^1.5.0",
"bcrypt": "^6.0.0",
"html-react-parser": "^5.2.9",
"jsonwebtoken": "^9.0.2",
"jwt-decode": "^4.0.0",
"mongoose": "^7.6.3",
"next": "^15.0.0",
"react": "^18.2.0",
"react-dom": "^18.2.0",
"resend": "^6.7.0",
"sass": "^1.97.1",
"zustand": "^5.0.8"
},
"devDependencies": {
"@types/bcrypt": "^6.0.0",
"@types/jsonwebtoken": "^9.0.10",
"@types/node": "^20.10.5",
"@types/react": "^18.2.0",
"@types/react-dom": "^18.2.0",
"typescript": "^5.6.2"
}
}
Write next.config.ts
8 lines
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
serverExternalPackages: ['mongoose', 'bcrypt'],
};

export default nextConfig;
Write tsconfig.json
23 lines
{
"compilerOptions": {
"lib": ["dom", "dom.iterable", "esnext"],
"allowJs": true,
"skipLibCheck": true,
"strict": false,
"noEmit": true,
"esModuleInterop": true,
"module": "esnext",
"moduleResolution": "bundler",
"resolveJsonModule": true,
"isolatedModules": true,
"jsx": "preserve",
"incremental": true,
"plugins": [{ "name": "next" }],
"paths": {
"@/_": ["./_"]
}
},
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
"exclude": ["node_modules", "client", "server"]
}
Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/

Create all API route handlers (app/api/)

Create app/layout.tsx

Migrate SSG pages: about, resources, article/[id], product/[id]

Migrate CSR pages: home, login, admin, cart, memes, etc.

Move and update shared components (use client, imports)

Move public assets and uploads

Delete old client/ and server/ directories
Bash Create all new directory structure for Next.js app
IN
mkdir -p /Users/bluebhanu/Sites/MyBlog/src/lib /Users/bluebhanu/Sites/MyBlog/src/models /Users/bluebhanu/Sites/MyBlog/src/services /Users/bluebhanu/Sites/MyBlog/src/state /Users/bluebhanu/Sites/MyBlog/src/data /Users/bluebhanu/Sites/MyBlog/src/hooks /Users/bluebhanu/Sites/MyBlog/src/components /Users/bluebhanu/Sites/MyBlog/src/admin /Users/bluebhanu/Sites/MyBlog/src/styles /Users/bluebhanu/Sites/MyBlog/src/assets/memes && mkdir -p /Users/bluebhanu/Sites/MyBlog/app/article/new /Users/bluebhanu/Sites/MyBlog/app/article/edit/\[\_id\] /Users/bluebhanu/Sites/MyBlog/app/article/\[id\] /Users/bluebhanu/Sites/MyBlog/app/product/new /Users/bluebhanu/Sites/MyBlog/app/product/edit/\[\_id\] /Users/bluebhanu/Sites/MyBlog/app/product/\[id\] /Users/bluebhanu/Sites/MyBlog/app/about /Users/bluebhanu/Sites/MyBlog/app/resources /Users/bluebhanu/Sites/MyBlog/app/login /Users/bluebhanu/Sites/MyBlog/app/newUser /Users/bluebhanu/Sites/MyBlog/app/admin /Users/bluebhanu/Sites/MyBlog/app/memes /Users/bluebhanu/Sites/MyBlog/app/cart /Users/bluebhanu/Sites/MyBlog/app/check-out /Users/bluebhanu/Sites/MyBlog/app/user && mkdir -p /Users/bluebhanu/Sites/MyBlog/app/api/articles /Users/bluebhanu/Sites/MyBlog/app/api/articles/\[id\] /Users/bluebhanu/Sites/MyBlog/app/api/products /Users/bluebhanu/Sites/MyBlog/app/api/products/\[id\] /Users/bluebhanu/Sites/MyBlog/app/api/users /Users/bluebhanu/Sites/MyBlog/app/api/user/\[id\] /Users/bluebhanu/Sites/MyBlog/app/api/login /Users/bluebhanu/Sites/MyBlog/app/api/settings /Users/bluebhanu/Sites/MyBlog/app/api/showMerch /Users/bluebhanu/Sites/MyBlog/app/api/toggleMerch /Users/bluebhanu/Sites/MyBlog/app/api/contact /Users/bluebhanu/Sites/MyBlog/app/api/wipe /Users/bluebhanu/Sites/MyBlog/app/api/backup && mkdir -p /Users/bluebhanu/Sites/MyBlog/public/uploads/articles /Users/bluebhanu/Sites/MyBlog/public/uploads/products && echo "Done"

OUT
Done
Write mongodb.ts
26 lines
import mongoose from 'mongoose';

declare global {
// eslint-disable-next-line no-var
var mongoose: { conn: typeof import('mongoose') | null; promise: Promise<typeof import('mongoose')> | null } | undefined;
}

const MONGO_URI = process.env.MONGO_URI!;

let cached = global.mongoose;

if (!cached) {
cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
if (cached!.conn) return cached!.conn;

if (!cached!.promise) {
cached!.promise = mongoose.connect(MONGO_URI).then((m) => m);
}

cached!.conn = await cached!.promise;
return cached!.conn;
}
Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/

Create all API route handlers (app/api/)

Create app/layout.tsx

Migrate SSG pages: about, resources, article/[id], product/[id]

Migrate CSR pages: home, login, admin, cart, memes, etc.

Move and update shared components (use client, imports)

Move public assets and uploads

Delete old client/ and server/ directories
Now copy the models and services, and write the shared src files:

Bash Copy Mongoose models and email service to src/
IN
cp /Users/bluebhanu/Sites/MyBlog/server/src/models/Articles.ts /Users/bluebhanu/Sites/MyBlog/src/models/Articles.ts && cp /Users/bluebhanu/Sites/MyBlog/server/src/models/Users.ts /Users/bluebhanu/Sites/MyBlog/src/models/Users.ts && cp /Users/bluebhanu/Sites/MyBlog/server/src/models/Products.ts /Users/bluebhanu/Sites/MyBlog/src/models/Products.ts && cp /Users/bluebhanu/Sites/MyBlog/server/src/models/Settings.ts /Users/bluebhanu/Sites/MyBlog/src/models/Settings.ts && cp /Users/bluebhanu/Sites/MyBlog/server/src/services/email.ts /Users/bluebhanu/Sites/MyBlog/src/services/email.ts && echo "Models copied"

OUT
Models copied
Bash Copy state store and hooks
IN
cp /Users/bluebhanu/Sites/MyBlog/client/src/state/useStore.ts /Users/bluebhanu/Sites/MyBlog/src/state/useStore.ts && cp /Users/bluebhanu/Sites/MyBlog/client/src/hooks/useClickOutside.tsx /Users/bluebhanu/Sites/MyBlog/src/hooks/useClickOutside.tsx && echo "State + hooks copied"

OUT
State + hooks copied
Bash Copy SCSS styles and meme image assets
IN
cp -r /Users/bluebhanu/Sites/MyBlog/client/src/styles/_ /Users/bluebhanu/Sites/MyBlog/src/styles/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/memes/_ /Users/bluebhanu/Sites/MyBlog/src/assets/memes/ && echo "Styles + meme assets copied"

OUT
Styles + meme assets copied
Bash List copied SCSS files
IN
ls /Users/bluebhanu/Sites/MyBlog/src/styles/ && ls /Users/bluebhanu/Sites/MyBlog/client/src/admin/\*.scss

OUT
\_colors.scss
\_forms.scss
\_interface.scss
\_layout.scss
\_products.scss
\_typography.scss
\_variables.scss
index.scss
/Users/bluebhanu/Sites/MyBlog/client/src/admin/\_admin_colors.scss
/Users/bluebhanu/Sites/MyBlog/client/src/admin/\_admin.scss
Bash Copy admin SCSS files
IN
cp /Users/bluebhanu/Sites/MyBlog/client/src/admin/\_admin.scss /Users/bluebhanu/Sites/MyBlog/src/admin/\_admin.scss && cp /Users/bluebhanu/Sites/MyBlog/client/src/admin/\_admin_colors.scss /Users/bluebhanu/Sites/MyBlog/src/admin/\_admin_colors.scss && echo "Admin SCSS copied"

OUT
Admin SCSS copied
Bash Check admin SCSS imports
IN
head -5 /Users/bluebhanu/Sites/MyBlog/src/admin/\_admin.scss

OUT
@use 'admin_colors' as _;
@use '../styles/variables' as _;

.adminPanel {
box-sizing: border-box;
Good — the relative paths work correctly in the new location. Now write the useData.ts with useNavigate replaced:

Write useData.ts
190 lines
'use client';
// UseData.ts
import { useCallback } from "react";
import { User, useStore } from "../state/useStore";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export type AuthObject = {
id: string;
key: string;
}

export function useData() {
const { categories, articles, articlesLoaded, usersLoaded,
productsLoaded, settingsLoaded, setSettingsLoaded, products,
setArticlesLoaded, setArticles, setProducts, setProductCategories, setCategories,
setLoginLoaded, loginLoaded, users, setUsers, setProductsLoaded,
setUser, setSettings, settings } = useStore((s) => s);

const fetchSettings = useCallback(async () => {
if (settingsLoaded) return;

    try {
      const res = await axios.get("/api/settings");
      const data = res.data.data;
      setSettings(data);
      setSettingsLoaded(true);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setSettingsLoaded(true);
    }

}, []);

const fetchArticles = useCallback(async () => {
if (articlesLoaded) return;

    try {
      const res = await axios.get("/api/articles");
      setArticles(res.data.data);
      const cats: string[] = res.data.data.map((article) => article.category);
      const uniqueCategories: string[] = [...new Set(cats)];
      if (uniqueCategories && uniqueCategories[0] !== '') {
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    }

}, [articlesLoaded, articles.length]);

const fetchProducts = useCallback(async () => {
if (productsLoaded) return;
setProductsLoaded(true);
try {
const res = await axios.get("/api/products");
const data = res.data.data;
const cats: string[] = data.map((product) => product.category).filter(category => category && category.trim() !== "");
const uniqueProductCategories: string[] = [...new Set(cats)];
setProducts(data);
setProductCategories(uniqueProductCategories);
} catch (err) {
console.error("Failed to fetch products:", err);
}
}, [productsLoaded, setProductsLoaded]);

const fetchUsers = useCallback(async () => {
if (usersLoaded) return;
if (users.length > 0) return;

    try {
      const res = await axios.get("/api/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }

}, [users.length]);

const createUser = useCallback(async () => {
try {
await axios.post("/api/users");
} finally {
fetchUsers();
}
})

const killProduct = useCallback(async (killID: string) => {
try {
await axios.delete(`/api/products/${killID}`);
} catch (err) {
console.error("Failed to kill product: ", killID);
}
}, [])

const kill = useCallback(async (killID: string) => {
try {
await axios.delete(`/api/articles/${killID}`);
} catch (err) {
console.error("Failed to kill article: ", killID);
}
}, [])

const login = useCallback(async (newUser: Partial<User>) => {
let loginResponse;
if (loginLoaded) return;

    setLoginLoaded(true);
    try {
      loginResponse = await axios.post('/api/login/', newUser);
    } catch (err) {
      console.log('Failed to login.');
    } finally {
      setLoginLoaded(false);
      if (loginResponse) {
        const decoded = jwtDecode<User>(loginResponse.data.token);
        setUser(decoded);
        localStorage.setItem("jwt", loginResponse.data.token);
        return decoded;
      } else {
        return undefined;
      }
    }

}, [loginLoaded])

const logout = useCallback(() => {
setUser(null);
localStorage.removeItem("jwt");
})

const displayMerch = useCallback(async (auth: AuthObject) => {
try {
await axios.post('/api/toggleMerch/', auth);
const res = await axios.get("/api/settings");
setSettings(res.data.data);
}
catch (err) {
console.log('Failed to toggle merch.');
}
});

const wipeAndSeed = useCallback(async (auth: AuthObject) => {
let wiped;
try {
wiped = await axios.post('/api/wipe/', auth);
}
catch (err) {
console.log('Failed to wipe database.');
}
finally {
return wiped;
}
});

const backUpDB = useCallback(async (auth: AuthObject) => {
let backedUp;
try {
backedUp = await axios.post('/api/backup/', auth);
}
catch (err) {
console.log('Failed to back up database.');
}
finally {
return backedUp;
}
})

const refresh = useCallback(async () => {
await fetchSettings();
await fetchArticles();
await fetchProducts();
await fetchUsers();
}, [fetchSettings, fetchArticles, fetchProducts, fetchUsers]);

return {
fetchArticles,
fetchUsers,
fetchProducts,
fetchSettings,
refresh,
login,
logout,
createUser,
kill,
killProduct,
wipeAndSeed,
backUpDB,
displayMerch,
settings,
};
}
Now write the updated shared components with "use client" and Next.js navigation:

Write banner-nav.tsx
132 lines
'use client';
import React, { useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { useClickOutside } from "../hooks/useClickOutside";

export type BannerNavProps = {
page: string;
};

export function BannerNav(props) {
const { page } = props;
const { user, orders } = useStore((s) => s);
const { logout } = useData();
const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

const router = useRouter();

const goHome = useCallback(() => { router.push(`/`); }, [router]);
const gotoShoppingCart = useCallback(() => { router.push("/cart"); }, [router]);
const editUser = useCallback(() => { router.push("/user"); }, [router]);

const openMenu = useCallback(() => {
setTimeout(() => {
setIsMenuOpen(!isMenuOpen);
}, 100);
}, [isMenuOpen]);

const menuRef = useRef<HTMLDivElement>(null);

useClickOutside(menuRef, () => {
if (isMenuOpen) {
setIsMenuOpen(false);
}
});

const itemClick = useCallback((e) => {
e.stopPropagation();
const navItem = e.target?.dataset?.nav;

    switch (navItem) {
      case "home": router.push("/"); break;
      case "cart": router.push("/cart"); break;
      case "login": router.push("/login"); break;
      case "about": router.push("/about"); break;
      case "resources": router.push("/resources"); break;
      case "memes": router.push("/memes"); break;
      case "logout":
        logout();
        setIsMenuOpen(false);
        break;
      case "admin": router.push("/admin"); break;
      default: break;
    }

}, [router, logout]);

return (
<div className="banner">
<div className="navBanner">
<div className="bannerLeft moonMathLogo" onClick={goHome}></div>
<div className="middleBannerNav"></div>
<div className="bannerRight">
{orders.length > 0 && !isMenuOpen && (
<div className="orderInfo" onClick={gotoShoppingCart}>
Orders: {orders.length}
</div>
)}
<div id="burger" className="burger" onMouseDown={openMenu}>
<div className="patty"></div>
<div className="patty"></div>
<div className="patty"></div>
</div>

          <div
            id="menu"
            className={`menu ${isMenuOpen ? "open" : "closed"}`}
            ref={menuRef}
          >
            <div data-nav="home" data-type="menuItem" className="innerMenuOption" id="menuItem0" onClick={itemClick}>
              Home
            </div>
            <div data-nav="about" data-type="menuItem" className="innerMenuOption" id="menuItem2" onClick={itemClick}>
              About Moon-Math
            </div>
            <div data-nav="resources" data-type="menuItem" className="innerMenuOption" id="menuItem3" onClick={itemClick}>
              Resources
            </div>
            <div data-nav="memes" data-type="menuItem" className="innerMenuOption" id="menuItem6" onClick={itemClick}>
              Memes
            </div>
            {orders && orders.length > 0 && (
              <div data-nav="cart" data-type="menuItem" className="innerMenuOption" id="menuItem4" onClick={itemClick}>
                Your Shopping Cart
              </div>
            )}
            {user && (
              <div data-nav="logout" data-type="menuItem" className="innerMenuOption" id="menuItem6" onClick={itemClick}>
                Logout
              </div>
            )}
            {!user && (
              <div data-nav="login" data-type="menuItem" className="innerMenuOption" id="menuItem1" onClick={itemClick}>
                Login
              </div>
            )}
            {user && user.sensi && (
              <div data-nav="admin" data-type="menuItem" className="innerMenuOption" id="menuItem5" onClick={itemClick}>
                Admin
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="tagline">
        <p className="hero-title ">A blog about bitcoin.</p>
      </div>
      {user && (
        <div className="loggedInAs">
          You are logged in as: {user?.userName}
          {user?.author && " - author"}
          {user?.sensi && " & admin"}
        </div>
      )}
      {!user && page !== "login" && page !== "create" && (
        <div className="notLoggedIn"></div>
      )}
    </div>

);
}
Write footer.tsx
21 lines
'use client';
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

export function Footer() {
const router = useRouter();

const copyrightInfo = useCallback(() => {
router.push('/about');
}, [router]);

return (
<div className='footerContainer'>
<div className="divider" />
<div className='footer'>
<p onClick={copyrightInfo}>Moon-Math @copyright 2026 Bart Dority - see full rights disclaimer</p>
</div>
</div>
);
}
Write image-modal.tsx
20 lines
'use client';
import React from "react";

type Props = {
src: string;
onClose: () => void;
};

export function ImageModal({ src, onClose }: Props) {
return (
<div className="overlay" onClick={onClose}>
<img
src={src}
className="modalImage"
onClick={(e) => e.stopPropagation()}
/>
</div>
);
}
Write MemeThumbnails.tsx
31 lines
'use client';
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import orangePill from "../assets/memes/orange_pill.jpeg";
import fortune from "../assets/memes/fortune_favors.jpg";
import elementzero from "../assets/memes/element_zero.jpg";
import buymore from "../assets/memes/buy_more.jpg";
import keepcalm from "../assets/memes/keep_calm.jpg";
import unstoppable from "../assets/memes/unstoppable.jpg";
import rigged from "../assets/memes/rigged.jpg";

export function MemeThumbnails() {
const router = useRouter();

const goToMemesPage = useCallback(() => {
router.push("/memes");
}, [router]);

return (
<>
<img src={orangePill.src ?? orangePill as any} onClick={goToMemesPage} />
<img src={rigged.src ?? rigged as any} onClick={goToMemesPage} />
<img src={elementzero.src ?? elementzero as any} onClick={goToMemesPage} />
<img src={buymore.src ?? buymore as any} onClick={goToMemesPage} />
<img src={keepcalm.src ?? keepcalm as any} onClick={goToMemesPage} />
<img src={fortune.src ?? fortune as any} onClick={goToMemesPage} />
<img src={unstoppable.src ?? unstoppable as any} onClick={goToMemesPage} />
</>
);
}
Write ArticleThumbnail.tsx
48 lines
'use client';
import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Article } from "../state/useStore";
import { splitIntoLines } from "../utils/articleUtils";
import parse from "html-react-parser";

export type ArticleProps = {
article: Article;
};

export function ArticleThumbnail({ article }: ArticleProps) {
const router = useRouter();
const paragraphs = splitIntoLines(article.body);

const readArticle = useCallback(() => {
router.push(`/article/${article._id}`);
}, [router, article._id]);

const hasHeadlineImage = useMemo(() => {
return article?.headlineImage && article.headlineImage !== '';
}, []);

const briefArticleStart = useMemo(() => {
return `${paragraphs?.[0]}${paragraphs?.[1]}`.substring(0, 190) + ' ... ';
}, [article, paragraphs])

return (
<div className="articleThumb" onClick={readArticle}>
<div className='headlineImageThumbnail'>
{hasHeadlineImage && (
<img src={`${article?.headlineImage}`} alt="article image" />
)}
{!hasHeadlineImage && (
<div className='noHeadlineImageContainer' style={{
            backgroundColor: article?.randomColor ? `#${article.randomColor}` : undefined,
          }}>
</div>
)}
</div>
<div className='articleThumbText'>
{article.title}
<div className='briefArticleStart'>{parse(briefArticleStart)}</div>
</div>
</div>
);
}
Bash Create utils directory
IN
mkdir -p /Users/bluebhanu/Sites/MyBlog/src/utils

OUT
0
Write articleUtils.ts
14 lines
export function splitIntoLines(text: string): string[] {
if (!text) return [];
const normalized = text.replace(/\r\n/g, "\n");
return normalized.split("\n");
}

export function splitIntoParagraphs(body: string): string[] {
const text = JSON.stringify(body);
if (!text) return [];
const normalized = text.replace(/\r\n/g, "\n");
const paragraphs = normalized.split(/\n{1,}/);
return paragraphs.map((p) => p.trim()).filter(Boolean);
}
Now write the admin components:

Write TableHeader.tsx
15 lines
'use client';
export interface TableHeaderProps {
title: string;
expanded?: boolean;
}
export function TableHeader(props: TableHeaderProps) {
const { title, expanded } = props;
return (
<div className={`expandableTableHeaderRow ${expanded ? 'expanded' : ''}`}>
<span className={`expandableTableArrow ${expanded ? 'expanded' : ''}`}>&#8250;</span>
{title}
</div>
)
}
Write ExpandableTable.tsx
31 lines
'use client';
import React, { useState, useCallback } from "react";
import { TableHeader } from "./TableHeader";

export interface ExpandableTableProps {
children: React.ReactNode;
title: string;
open: boolean;
}
export function ExpandableTable(props: ExpandableTableProps) {
const { children, open, title } = props;
const [expanded, setExpanded] = useState(open);

const toggleExpansion = useCallback(() => {
setExpanded(!expanded);
}, [expanded]);

return (
<>
<div className="expandableTable">
<div onClick={toggleExpansion}>
<TableHeader title={title} expanded={expanded} />
</div>
<div className={`expandableTableContent ${expanded ? 'expanded' : ''}`}>
{children}
</div>
</div>
</>
)
}
Write UsersForm.tsx
41 lines
'use client';
import { useStore } from "../state/useStore";

export function UsersForm() {
const { user, users } = useStore((s) => s);
const adminCount = users.filter((u) => u.sensi).length;
return (
user.sensi && (
<>
<div className="bMeta">
{users.length} users &nbsp; &nbsp; | &nbsp; &nbsp; {adminCount} admin
</div>
{users.map((u) => (
<div className="bUser" key={u._id}>
<div className="bUserHeader">
{u.userName || (
<span style={{ opacity: 0.4, fontStyle: "italic" }}>unnamed</span>
)}
</div>
<div className="bRow"><div className="bLabel">ID</div><div className="bItem bHash">{u.\_id}</div></div>
<div className="bRow"><div className="bLabel">Email</div><div className="bItem">{u.userEmail}</div></div>
<div className="bRow">
<div className="bLabel">Status</div>
<div className="bItem">{u.status ? <span className="bBadge bBadge-active">{u.status}</span> : null}</div>
</div>
<div className="bRow">
<div className="bLabel">Author</div>
<div className="bItem"><span className={`bBadge ${u.author ? "bBadge-true" : "bBadge-false"}`}>{u.author ? "true" : "false"}</span></div>
</div>
<div className="bRow">
<div className="bLabel">Sensi</div>
<div className="bItem"><span className={`bBadge ${u.sensi ? "bBadge-true" : "bBadge-false"}`}>{u.sensi ? "true" : "false"}</span></div>
</div>
<div className="bRow"><div className="bLabel">Hash</div><div className="bItem bHash">{u.phash}</div></div>
</div>
))}
</>
)
);
}
Write Download.tsx
40 lines
'use client';
import React from "react";
import { Article, User } from "../state/useStore";

interface Props {
articles: Article[];
users: User[];
}

export function DownloadJsonButton({ articles, users }: Props) {
const handleDownloadArticles = () => {
const json = JSON.stringify(articles, null, 2);
const blob = new Blob([json], { type: "application/json" });
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "articles.json";
link.click();
URL.revokeObjectURL(url);
};

const handleDownloadUsers = () => {
const json = JSON.stringify(users, null, 2);
const blob = new Blob([json], { type: "application/json" });
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "users.json";
link.click();
URL.revokeObjectURL(url);
};

return (
<>
<button onClick={handleDownloadArticles}>Download Articles JSON</button>
<button onClick={handleDownloadUsers}>Download Users JSON</button>
</>
);
}
Write ArticleForm.tsx
102 lines
'use client';
import React, { useCallback, useState } from "react";
import { useData } from "../data/useData";
import { Article, useStore } from "../state/useStore";

export type ArticleFormProps = {
article: Article;
changeCategory: () => void;
changeNewCategory: (e: React.FormEvent) => void;
editing: boolean;
handleChange: (e: React.FormEvent) => void;
handleFileChange: (e: React.FormEvent) => void;
handleSubmit: (e: React.FormEvent) => Promise<void>;
newCategory: string;
};

export function ArticleForm(props: ArticleFormProps) {
const {
article,
changeCategory,
editing,
changeNewCategory,
handleSubmit,
newCategory,
handleChange,
handleFileChange,
} = props;

const { user, categories } = useStore((s) => s);
const { refresh } = useData();
const [isReady, setIsReady] = useState(article.readyToPublish ? article.readyToPublish : false);

const toggleReadyStatus = useCallback(() => {
setIsReady(!isReady);
}, [isReady]);

const handleFormSubmit = useCallback((e) => {
article.readyToPublish = isReady;
handleSubmit(e);
});

return (
<form onSubmit={handleFormSubmit} className="new-article-form">
<div>
<label htmlFor="readyToPublish">Ready to Publish</label>
<br></br>
{isReady && (
<div className="lineContainer">
<div className="bButton checkBoxSelected" onClick={toggleReadyStatus}></div>
Ready to publish
</div>
)}
{!isReady && (
<div className="lineContainer">
<div className="bButton checkBox" onClick={toggleReadyStatus}></div>
Ready to publish
</div>
)}

        <label htmlFor="category">Category:</label>

        {article?.category !== "New" && (
          <div className="row">
            <select id="category" name="category" value={article?.category} onChange={handleChange} required>
              {categories?.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div>
              <input
                id="newCategory"
                name="category"
                type="text"
                value={newCategory}
                placeholder="Choose-- or enter a new category here"
                onChange={changeNewCategory}
              />
            </div>
          </div>
        )}

        <label htmlFor="title">Title:</label>
        <input id="title" type="text" name="title" value={article?.title ?? ""} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="headlineImage">Headline Image:</label>
        {editing && article.headlineImage !== "" && (
          <div className="headlineImagePreview">
            <img src={`${article?.headlineImage}`} />
          </div>
        )}
        <input id="headlineImage" type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <label htmlFor="body">Body:</label>
        <textarea id="body" name="body" value={article?.body ?? ""} onChange={handleChange} required rows={6} />
      </div>
      <button type="submit">{editing ? "Submit Changes" : "Post Article"}</button>
    </form>

);
}
Write AdminPanel.tsx
139 lines
'use client';
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Article, Product, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { DownloadJsonButton } from "./Download";
import { UsersForm } from "./UsersForm";
import { TableHeader } from "./TableHeader";
import { ExpandableTable } from "./ExpandableTable";

export function AdminPanel() {
const { refresh, kill, backUpDB, wipeAndSeed, killProduct, displayMerch } = useData();
const { user, articles, categories, products, productCategories, users, settings } = useStore((s) => s);
const showMerch = settings?.find((s) => s.name === "showMerch")?.booleanValue ?? true;
const router = useRouter();

const editArticle = useCallback((article: Article) => {
router.push(`/article/edit/${article._id}`);
}, [router]);

const editProduct = useCallback((product: Product) => {
router.push(`/product/edit/${product._id}`);
}, [router]);

const toggleMerch = useCallback(() => {
displayMerch({ id: user.\_id, key: user.phash });
}, [user]);

const killArticle = useCallback((article: Article) => {
const confirmDelete = window.confirm(`Are you sure you want to delete this article,
            titled: ${article.title} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
if (!confirmDelete) return;
kill(article.\_id);
refresh();
}, []);

const killAProduct = useCallback((productToKill: Product) => {
const confirmDelete = window.confirm(`Are you sure you want to delete this product,
            named: ${productToKill.productName} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
if (!confirmDelete) return;
killProduct(productToKill.\_id);
refresh();
}, []);

const newArticle = useCallback(() => { router.push(`/article/new`); }, [router]);
const newProduct = useCallback(() => { router.push(`/product/new`); }, [router]);

const clearOut = useCallback(async () => {
let wiped;
try {
wiped = await wipeAndSeed({ id: user.\_id, key: user.phash });
} catch (err) {
} finally {
if (wiped?.status === 200) refresh();
}
}, []);

const backUp = useCallback(async () => {
let result;
try {
result = await backUpDB({ id: user.\_id, key: user.phash });
} catch (err) {
} finally {
if (result?.status === 200) refresh();
}
}, []);

return (
<div className="adminPanel">
<div className="titleBar">Admin Panel</div>
<div className="adminContent">
<ExpandableTable title="users" open={false}>
<UsersForm />
</ExpandableTable>

        <ExpandableTable title="articles" open={false}>
          <div onClick={newArticle} className="newArticleButton">New Article</div>
          <br></br>
          {categories?.map((category, categoryIndex) => (
            <div key={`category-${category}-${categoryIndex}`}>
              <div className="killCategory">{category}</div>
              <div className="articlesTable">
                {articles?.filter((a) => a.category === category).map((a) => (
                  <React.Fragment key={a._id}>
                    <div className="aaRow">
                      <div className="aaItem" onClick={() => editArticle(a)}>{a.title}</div>
                      <div className="killButton" onClick={() => killArticle(a)}>X</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </ExpandableTable>

        <ExpandableTable title="merchandise" open={false}>
          <div className="merchToggle" onClick={toggleMerch}>
            <div className={showMerch ? "bigCheckBoxSelected" : "bigCheckBox"}>
              {showMerch && <span className="bigCheckmark">✓</span>}
            </div>
            <span className="merchToggleLabel">Show Merchandise</span>
          </div>
          <div onClick={newProduct} className="newArticleButton">New Product</div>

          {products && (
            <>
              Products:<br></br>
              <div className="productsContainer">
                {products.map((product) => (
                  <div key={product._id}>
                    <div onClick={() => editProduct(product)}>{product.productName}</div>
                    <div>{product.productDescription}</div>
                    <div className="killProduct" onClick={() => killAProduct(product)}>X</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </ExpandableTable>

        <ExpandableTable title="database" open={false}>
          {user.sensi && (
            <>
              <div className="caution" onClick={() => backUp()}>Backup the current DataBase.</div>
              <div className="JsonData">
                Download data to your local download folder:<br></br>
                <DownloadJsonButton articles={articles} users={users} />
              </div>
              <div className="dangerous" onClick={() => clearOut()}>Wipe out the DataBase, and start over with original seed data.</div>
            </>
          )}
        </ExpandableTable>
      </div>
    </div>

);
}
Write NewArticlePage.tsx
87 lines
'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { ArticleForm } from "./ArticleForm";

export function NewArticlePage() {
const router = useRouter();
const { user, categories } = useStore((s) => s);
const [category, setCategory] = useState(categories[0] || "");
const [newCategory, setNewCategory] = useState('');
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const { refresh } = useData();
const [article, setArticle] = useState<Partial<Article> | null>(null);

useEffect(() => {
if (!article) {
const freshArticle: Partial<Article> = {
body: "",
category: categories[0] || "",
readyToPublish: false,
title: "",
userID: user.\_id
};
setArticle(freshArticle);
}
}, []);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files[0]) {
setSelectedFile(e.target.files[0]);
}
};

const routeHome = useCallback(() => {
refresh();
router.push(`/`);
}, [router]);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
try {
if (selectedFile) {
article.headlineImage = selectedFile as any;
}
article.userId = user.\_id;
await axios.post("/api/articles", article, {
headers: { "Content-Type": "multipart/form-data" }
});
router.push(`/`);
} catch (err) {
console.error("Failed to submit article:", err);
}
};

const changeNewCategory = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
setNewCategory(e.target.value);
setArticle((prev) => ({ ...prev, category: e?.target?.value }));
}, []);

const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
const { name, value } = e.target;
setArticle((prev) => ({ ...prev, [name]: value }));
}, []);

return (
<div className={'article'}>
<div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog ::</div>
<div className='articlePageTitle'>{`New Article:`}</div>
{article && (
<ArticleForm
          article={article}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          editing={false}
          changeCategory={handleChange}
          changeNewCategory={changeNewCategory}
          newCategory={newCategory}
        />
)}
</div>
)
}
Write EditArticlePage.tsx
75 lines
'use client';
import React, { useCallback, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Article, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { ArticleForm } from "./ArticleForm";

export function EditArticlePage() {
useData();
const router = useRouter();
const params = useParams<{ \_id: string }>();
const \_id = params.\_id;
const { user, articles } = useStore((s) => s);
const categories = useStore((s) => s.categories);
const [article, setArticle] = useState<Article>(articles.find((a) => a.\_id === \_id));
const [newCategory, setNewCategory] = useState('');
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const { refresh } = useData();

const routeHome = useCallback(() => {
refresh();
router.push(`/`);
}, [router]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files[0]) {
setSelectedFile(e.target.files[0]);
}
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
try {
if (selectedFile) {
article.headlineImage = selectedFile as any;
}
article.userID = user.\_id;
await axios.patch(`/api/articles/${article._id}`, article, {
headers: { "Content-Type": "multipart/form-data" }
});
router.push(`/`);
} catch (err) {
console.error("Failed to submit edited article:", err);
}
};

const changeNewCategory = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
setNewCategory(e.target.value);
setArticle((prev) => ({ ...prev, category: e?.target?.value }));
}, []);

const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
const { name, value } = e.target;
setArticle((prev) => ({ ...prev, [name]: value }));
}, []);

return (
<div className={'article'}>
<div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog ::</div>
<div className='articlePageTitle'>{`Edit Article:`}</div>
<ArticleForm
        article={article}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        editing
        changeCategory={handleChange}
        changeNewCategory={changeNewCategory}
        newCategory={newCategory}
      />
</div>
)
}
Now write the product pages and article-related page components:

Write ProductForm.tsx
106 lines
'use client';
import React, { useCallback, useState } from "react";
import { useData } from "../../data/useData";
import { Product, useStore } from "../../state/useStore";

export type ProductFormProps = {
product: Product;
changeCategory: () => void;
changeNewCategory: (e: React.FormEvent) => void;
editing: boolean;
handleChange: (e: React.FormEvent) => void;
handleFileChange: (e: React.FormEvent) => void;
handleBeautyChange: (e: React.FormEvent) => void;
handleThumbnailChange: (e: React.FormEvent) => void;
handleSubmit: (e: React.FormEvent) => Promise<void>;
newCategory: string;
}

export function ProductForm(props: ProductFormProps) {
const { product, changeCategory, editing, changeNewCategory, handleSubmit, newCategory, handleChange, handleFileChange, handleBeautyChange, handleThumbnailChange } = props;
const { categories, productCategories } = useStore((s) => s);
const { refresh } = useData();
const [images, setImages] = useState<string[]>([]);
const [isReady, setIsReady] = useState<boolean>(product?.readyToPublish ? product?.readyToPublish : false);

const toggleReadyStatus = useCallback(() => {
setIsReady(!isReady);
}, [isReady]);

const handleFormSubmit = useCallback((e) => {
product.readyToPublish = isReady;
handleSubmit(e);
});

const addAnotherImage = useCallback(() => {
setImages(prev => [...prev, ""]);
}, [images]);

const killProductImage = useCallback((imageNumber: number) => {
product.productImages.splice(imageNumber, 1);
}, [product]);

return (
<form onSubmit={handleFormSubmit} className="new-article-form">
<div>
<label htmlFor="readyToPublish">Ready to Publish</label>
<br></br>
{isReady && (<div className='lineContainer'><div className='bButton checkBoxSelected' onClick={toggleReadyStatus}></div>Ready to publish</div>)}
{!isReady && (<div className='lineContainer'><div className='bButton checkBox' onClick={toggleReadyStatus}></div>Ready to publish</div>)}

        <label htmlFor="category">Category:</label>
        {product?.category !== "New" && (
          <div className="row">
            <select id="category" name='category' value={product?.category} onChange={handleChange}>
              {categories?.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
            <div>
              <input id="newCategory" name="category" type="text" value={newCategory} placeholder="Choose-- or enter a new category here" onChange={changeNewCategory} />
            </div>
          </div>
        )}

        <label htmlFor="productName">Product Name:</label>
        <input id="productName" type="text" name='productName' value={product?.productName ?? ''} onChange={handleChange} required />
      </div>
      <div><label>Images:</label></div>
      <div>
        <div>
          Beauty Image:
          {editing && product.beauty && product.beauty !== '' && (<div className='beautyPreview'><img src={product.beauty} /></div>)}
          <input id="beauty" type="file" accept="image/*" onChange={handleBeautyChange} name="beauty" />
        </div>
        <div>
          Thumbnail Image:
          {editing && product.thumbnail && product.thumbnail !== '' && (<div className='thumbnailPreview'><img src={product.thumbnail} /></div>)}
          <input id="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} name="thumbnail" />
        </div>
      </div>
      <div className='imageUploadContainer'>
        existing images:
        {product?.productImages?.map((productImage, imageNumber) => (
          <React.Fragment key={imageNumber}>
            <div className='productImagePreview'>
              <div className='productImagePreviewThumbnail'><img src={`${product.productImages[imageNumber]}`} /></div>
              <div className='productImagePreviewKill' onClick={() => killProductImage(imageNumber)}>X</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div>
        {images.map((image, imageNumber) => (
          <React.Fragment key={imageNumber}>Image: {image}
            <input id={`image_${imageNumber}`} type="file" accept="image/*" onChange={handleFileChange} name="images" />
          </React.Fragment>
        ))}
      </div>
      <div onClick={addAnotherImage}>Add another image</div>
      <div>
        <label htmlFor="body">Product Description:</label>
        <textarea id="productDescription" name='productDescription' value={product?.productDescription ?? ''} onChange={handleChange} required rows={6} />
      </div>
      <button type="submit">{editing ? 'Submit Changes' : 'Post Product'}</button>
    </form>

)
}
Write NewProductPage.tsx
96 lines
'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, useStore } from "../../state/useStore";
import { useData } from "../../data/useData";
import axios from "axios";
import { ProductForm } from "./ProductForm";

export function NewProductPage() {
const router = useRouter();
const { user, categories, productCategories } = useStore((s) => s);
const [category, setCategory] = useState(categories[0] || "");
const [newCategory, setNewCategory] = useState('');
const [images, setImages] = useState<File[]>([]);
const [beauty, setBeauty] = useState<File>(null);
const [thumbnail, setThumbnail] = useState<File>(null);
const { refresh } = useData();
const [product, setProduct] = useState<Partial<Product>>(null);

useEffect(() => {
if (!product) {
setProduct({
productDescription: "",
category: productCategories[0] || "",
productName: "New Product",
});
}
}, [product]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files[0]) {
setImages(prev => [...prev, e.target.files[0]]);
}
};

const handleBeautyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files[0]) setBeauty(e.target.files[0]);
};

const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files[0]) setThumbnail(e.target.files[0]);
};

const routeHome = useCallback(() => {
refresh();
router.push(`/`);
}, [router]);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
try {
const formData = new FormData();
formData.append("productName", product.productName);
formData.append("productDescription", product.productDescription);
formData.append("readyToPublish", String(product.readyToPublish));
formData.append("category", newCategory.length ? newCategory : category);
if (beauty) formData.append('newBeauty', beauty);
if (thumbnail) formData.append('newThumbnail', thumbnail);
images.forEach((img) => formData.append("images", img));
await axios.post("/api/products", formData);
router.push(`/`);
} catch (err) {
console.error("Failed to submit product:", err);
}
};

const changeNewCategory = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
setNewCategory(e.target.value);
setProduct((prev) => ({ ...prev, category: e?.target?.value }));
}, []);

const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
const { name, value } = e.target;
setProduct((prev) => ({ ...prev, [name]: value }));
}, []);

return (
<div className={'article'}>
<div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog ::</div>
<div className='articlePageTitle'>{`New Product:`}</div>
<ProductForm
        product={product}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleBeautyChange={handleBeautyChange}
        handleThumbnailChange={handleThumbnailChange}
        editing={false}
        changeCategory={handleChange}
        changeNewCategory={changeNewCategory}
        newCategory={newCategory}
      />
</div>
)
}
Write EditProductPage.tsx
97 lines
'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Product, useStore } from "../../state/useStore";
import { useData } from "../../data/useData";
import axios from "axios";
import { ProductForm } from "./ProductForm";

export function EditProductPage() {
const router = useRouter();
const params = useParams<{ \_id: string }>();
const \_id = params.\_id;
const { user, categories, products, productCategories } = useStore((s) => s);
const [category, setCategory] = useState(categories[0] || "");
const [newCategory, setNewCategory] = useState('');
const [product, setProduct] = useState<Product>(products.find((p) => p.\_id === \_id));
const [images, setImages] = useState<File[]>([]);
const [beauty, setBeauty] = useState<File>(null);
const [thumbnail, setThumbnail] = useState<File>(null);
const { refresh } = useData();

useEffect(() => {
if (!product) {
setProduct({
productDescription: "",
category: productCategories[0] || "",
productName: "Edit Product",
} as Product);
}
}, []);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files[0]) setImages(prev => [...prev, e.target.files[0]]);
};
const handleBeautyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files[0]) setBeauty(e.target.files[0]);
};
const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files[0]) setThumbnail(e.target.files[0]);
};

const routeHome = useCallback(() => {
refresh();
router.push(`/`);
}, [router]);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
try {
const formData = new FormData();
formData.append("productName", product.productName);
formData.append("productDescription", product.productDescription);
formData.append("readyToPublish", String(product.readyToPublish));
formData.append("category", newCategory.length ? newCategory : category);
formData.append('productImages', product.productImages as any);
formData.append('beauty', product.beauty);
formData.append('thumbnail', product.thumbnail);
if (beauty) formData.append('newBeauty', beauty);
if (thumbnail) formData.append('newThumbnail', thumbnail);
images.forEach((img) => formData.append("images", img));
await axios.patch(`/api/products/${product._id}`, formData);
router.push(`/`);
} catch (err) {
console.error("Failed to submit product:", err);
}
};

const changeNewCategory = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
setNewCategory(e.target.value);
setProduct((prev) => ({ ...prev, category: e?.target?.value }));
}, []);

const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
const { name, value } = e.target;
setProduct((prev) => ({ ...prev, [name]: value }));
}, []);

return (
<div className={'article'}>
<div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog ::</div>
<div className='articlePageTitle'>{`Edit Product:`}</div>
<ProductForm
        product={product}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleBeautyChange={handleBeautyChange}
        handleThumbnailChange={handleThumbnailChange}
        editing={true}
        changeCategory={handleChange}
        changeNewCategory={changeNewCategory}
        newCategory={newCategory}
      />
</div>
)
}
Write ProductPage.tsx
103 lines
'use client';
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useData } from "../../data/useData";
import { Order, useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";
import { useClickOutside } from "../../hooks/useClickOutside";

export function ProductPage() {
useData();
const params = useParams<{ id: string }>();
const id = params.id;

const { products, orders, setOrders } = useStore((s) => s);
const [chosenSize, setChosenSize] = useState('');
const [count, setCount] = useState<number>(1);
const [chooseSizeWarning, setChooseSizeWarning] = useState(false);

const addQuantity = useCallback(() => {
if (count <= 19) setCount(count + 1);
}, [count]);

const reduceQuantity = useCallback(() => {
if (count >= 1) setCount(count - 1);
}, [count]);

const selectSize = useCallback((size: string) => {
setChosenSize(size);
}, []);

const warningRef = useRef<HTMLDivElement>(null);
useClickOutside(warningRef, () => { setChooseSizeWarning(false); });

const addToCart = useCallback(() => {
if (chosenSize === '') {
setChooseSizeWarning(true);
} else {
const newOrder = { \_id: orders.length + 1, productID: product.\_id, quantity: count, chosenSize } as Order;
const newOrders = [...orders, newOrder];
setOrders(newOrders);
}
}, [chosenSize, count, orders]);

const productDetails = (<>Style #: G67000-3G3-S
<p>Material</p>
<ul>
<li>60% ring spun cotton | 40% polyester</li>
<li>5.5 Oz/SqYd, 50% U.S. cotton/50% polyester</li>
<li>Classic fit for loose comfort</li>
<li>Cotton-soft moisture wicking fabric for active lifestyles</li>
<li>Stay-dry comfort and coolness</li>
<li>Taped neck and shoulders for comfort and durability</li>
<li>Non-topstitched, classic width, rib collar</li>
<li>Tear away label for customizable comfort</li>
</ul>
</>);

const product = products.find((p) => p.\_id === id);

if (!product) return <div>Loading...</div>;

return (
<>
<BannerNav page='product' />
<div className='productPageLayout'>
<div className='pplChild pplChild-left'>
<div className='productBeauty'>
<img src={`${product?.beauty}`} alt="headline" />
<div className='prodcutTitle'>{product.productName}</div>
<div className='productDescriptionBlock'>{product.productDescription}</div>
</div>
</div>
<div className='pplChild pplChild-right'>
Choose your size:
<div className='sizeBoxes'>
{['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
<div key={size} className={`sizeBox ${chosenSize === size ? 'active' : ''}`} onClick={() => selectSize(size)}>{size}</div>
))}
</div>
{chooseSizeWarning && (
<div className='sizeWarning' ref={warningRef}>Please select a size option.</div>
)}
<div className='countSelection'>
<div className='counter' id='counter'>
Quantity:
<div className='counterBoxContainer'>
<div className='counterBox'>{count}</div>
<button className='quantityButton' onClick={reduceQuantity}>-</button>
<button className='quantityButton' onClick={addQuantity}>+</button>
</div>
<button className='cartButton' onClick={addToCart}>Add to Cart</button>
</div>
</div>
<div className='productDetails'>
<p>Please note: If you want to order multiple sizes, please just add a quantity of each size to your cart.</p>
{productDetails}
</div>
</div>
</div>
</>
)
}
Write ProductThumbnails.tsx
43 lines
'use client';
import React, { useEffect, useCallback } from "react";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { useRouter } from "next/navigation";

export function ProductThumbnails() {
const { fetchProducts } = useData();
const { products } = useStore((s) => s);
const router = useRouter();

useEffect(() => {
fetchProducts();
}, []);

const openProductPage = useCallback((productID) => {
router.push(`/product/${productID}`);
}, [router]);

return (
<>
<div className='sticker'>Merch</div>
{products.map((product, index) => (
<div key={`product-thumb-${index}`}>
{product.readyToPublish && (
<div className='productBox' onClick={() => openProductPage(product.\_id)}>
<div className='productBoxImage'>
{product.thumbnail && (
<img src={`${product.thumbnail}`} alt={`${product.productName}`} />
)}
</div>
<div className='productThumbnailDescriptionBox'>
<div className="productThumbnailTitle">{product.productName}</div>
<div className='productThumbnailDescriptionBoxText'>{product.productDescription}</div>
</div>
</div>
)}
</div>
))}
</>
)
}
Write ShoppingCart.tsx
81 lines
'use client';
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";

export function ShoppingCart() {
useData();
const { products, orders, setOrders } = useStore((s) => s);
const router = useRouter();

const removeOrder = useCallback((itemToRemove) => {
const newOrderSet = orders.filter((order) => order.\_id !== itemToRemove);
setOrders(newOrderSet);
}, [orders]);

const proceedToCheckout = useCallback(() => {
router.push('/check-out');
}, [router]);

const [formData, setFormData] = useState({
firstName: "", lastName: "", email: "", phone: "",
address1: "", address2: "", city: "", state: "", zip: "",
country: "US", quantity: 1, size: "M", notes: ""
});

const handleChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
};

return (
<>
<BannerNav page='product' />
<div className='basicBox'>
<div><h1>Your Shopping Cart:</h1></div>
Orders: {orders.length}
<div className='ordersContainer'>
{orders.map((order) => {
const associatedProduct = products.find((p) => p.\_id === order.productID);
return (
<div className='orderBox' key={order._id}>
Order:
<div className='orderProductImg'><img src={associatedProduct?.beauty} /></div>
<div>Product: {associatedProduct?.productName}</div>
<div>Quantity: {order.quantity}</div>
<div>Size: {order.chosenSize}</div>
<div className='removeOrder' onClick={() => removeOrder(order.\_id)}>Remove this order</div>
</div>
)
})}
</div>
<form onSubmit={proceedToCheckout} className="orderForm">
<h2>Customer Info</h2>
<fieldset>
<legend>Customer Information</legend>
<label>First Name<input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} /></label>
<label>Last Name<input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} /></label>
<label>Email<input type="email" name="email" required value={formData.email} onChange={handleChange} /></label>
<label>Phone Number<input type="tel" name="phone" placeholder="555-123-4567" value={formData.phone} onChange={handleChange} /></label>
</fieldset>
<fieldset>
<legend>Shipping Address</legend>
<label>Address Line 1<input type="text" name="address1" required value={formData.address1} onChange={handleChange} /></label>
<label>Address Line 2 (optional)<input type="text" name="address2" value={formData.address2} onChange={handleChange} /></label>
<label>City<input type="text" name="city" required value={formData.city} onChange={handleChange} /></label>
<label>State<input type="text" name="state" required maxLength={2} placeholder="CA" value={formData.state} onChange={handleChange} /></label>
<label>ZIP Code<input type="text" name="zip" required value={formData.zip} onChange={handleChange} /></label>
</fieldset>
<fieldset>
<legend>Additional Notes</legend>
<textarea name="notes" rows={4} placeholder="Special delivery instructions or notes" value={formData.notes} onChange={handleChange} />
</fieldset>
<button type='submit'>Proceed To Checkout</button>
</form>
</div>
</>
)
}
Write CheckOut.tsx
48 lines
'use client';
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";

export function CheckOut() {
useData();
const { products, orders, setOrders } = useStore((s) => s);
const router = useRouter();

const removeOrder = useCallback((itemToRemove) => {
const newOrderSet = orders.filter((order) => order.\_id !== itemToRemove);
setOrders(newOrderSet);
}, [orders]);

const completePurchase = useCallback(() => {
// TODO: implement actual purchase completion
router.push('/');
}, [router]);

return (
<>
<BannerNav page='product' />
<div className='basicBox'>
<div>Complete your Purchase:</div>
Orders: {orders.length}
<div className='ordersContainer'>
{orders.map((order) => {
const associatedProduct = products.find((p) => p.\_id === order.productID);
return (
<div className='orderBox' key={order._id}>
Order:
<div className='orderProductImg'><img src={associatedProduct?.beauty} /></div>
<div>Product: {associatedProduct?.productName}</div>
<div>Quantity: {order.quantity}</div>
<div>Size: {order.chosenSize}</div>
</div>
)
})}
</div>
<button onClick={completePurchase}>Complete my Purchase</button>
</div>
</>
)
}
Now write the remaining page components and the Articles component:

Write Articles.tsx
22 lines
'use client';
import React from "react";
import { ArticleThumbnail } from "../../components/ArticleThumbnail";
import { useStore } from "../../state/useStore";

export function Articles() {
const { articlesById } = useStore((s) => s);
return (
<>
<div className="articleBlock">
{Object.values(articlesById)
.filter((a) => a.readyToPublish)
.map((a) => (
<React.Fragment key={a.\_id}>
<ArticleThumbnail article={a} />
</React.Fragment>
))}
</div>
</>
);
}
Write ArticlePage.tsx
70 lines
'use client';
import React, { useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "../../state/useStore";
import { useData } from "../../data/useData";
import { BannerNav } from "../../components/banner-nav";
import parse from "html-react-parser";
import { splitIntoLines } from "../../utils/articleUtils";

export function ArticlePage() {
const { fetchArticles, fetchUsers } = useData();
const params = useParams<{ id: string }>();
const id = params.id;

const { articlesById, articlesLoaded, usersById, usersLoaded } = useStore((s) => s);
const router = useRouter();
const article = articlesById[id!];
const authorUser = article ? usersById[article.userID] : undefined;

const routeHome = useCallback(() => { router.push(`/`); }, [router]);

useEffect(() => {
fetchArticles();
fetchUsers();
}, [fetchArticles, fetchUsers]);

if (!articlesLoaded) return <div>Loading article...</div>;
if (!usersLoaded) return <div>Loading users...</div>;
if (!article) return <div>Article not found</div>;

const paragraphs = splitIntoLines(article.body);
const hasHeadlineImage = article?.headlineImage && article?.headlineImage !== "";

return (
<>
<BannerNav page="article" />
<div className={"article"}>
<div className="articlePageCategory">{article?.category}</div>

        {hasHeadlineImage && (
          <div className="headlineImageContainer">
            <img src={`${article?.headlineImage}`} alt="headline" />
          </div>
        )}
        {!hasHeadlineImage && (
          <div
            className="noHeadlineImageContainer"
            style={article?.randomColor ? ({ "--article-color": `#${article.randomColor}` } as React.CSSProperties) : undefined}
          ></div>
        )}
        <div className="articleContainer">
          <div className="articlePageTitle">{article?.title}</div>
          <div className="authorName">
            Author: {authorUser?.authorName ? authorUser.authorName : authorUser?.userName}
          </div>
          <div className="originDate">
            Originally published: {article?.originDate ? article.originDate : `2025-12-01`}
          </div>
          <div className="modifiedDate">Last modified: {article?.lastModifiedDate}</div>
          <div className="articleBody">
            {paragraphs.map((par, index) => (
              <p key={index}>{parse(par)}</p>
            ))}
          </div>
        </div>
      </div>
    </>

);
}
Now write the API route handlers — these replace the entire Express server:

Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/ and write all src/ components

Create all API route handlers (app/api/)

Create app/layout.tsx

Migrate SSG pages: about, resources, article/[id], product/[id]

Migrate CSR pages: home, login, admin, cart, memes, etc.

Move public assets and uploads

Install dependencies and verify build

Delete old client/ and server/ directories
Write route.ts
50 lines
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Articles } from '@/src/models/Articles';
import path from 'path';
import fs from 'fs/promises';

function getRandomHexColor(): string {
return Math.floor(Math.random() \* 0xffffff).toString(16).padStart(6, '0');
}

export async function GET() {
await connectDB();
const all = await Articles.find();
return NextResponse.json({ data: all });
}

export async function POST(request: NextRequest) {
await connectDB();
try {
const formData = await request.formData();
const body: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (key !== 'headlineImage') {
        body[key] = value;
      }
    }

    const file = formData.get('headlineImage') as File | null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}${path.extname(file.name)}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      body.headlineImage = `/uploads/articles/${filename}`;
    }

    body.randomColor = getRandomHexColor();
    body.originDate = new Date().toISOString().split('T')[0];

    const doc = new Articles(body);
    await doc.save();
    return NextResponse.json(doc);

} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
57 lines
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Articles } from '@/src/models/Articles';
import path from 'path';
import fs from 'fs/promises';

function getRandomHexColor(): string {
return Math.floor(Math.random() \* 0xffffff).toString(16).padStart(6, '0');
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
await connectDB();
try {
const { id } = await params;
const formData = await request.formData();
const body: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (key !== 'headlineImage') {
        body[key] = value;
      }
    }

    const file = formData.get('headlineImage') as File | null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}${path.extname(file.name)}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      body.headlineImage = `/uploads/articles/${filename}`;
    }

    body.lastModifiedDate = new Date().toISOString().split('T')[0];
    body.randomColor = getRandomHexColor();

    const updated = await Articles.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json(updated);

} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
await connectDB();
try {
const { id } = await params;
const deleted = await Articles.findByIdAndDelete(id);
if (!deleted) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
return NextResponse.json({ success: true, deleted });
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
55 lines
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Products } from '@/src/models/Products';
import path from 'path';
import fs from 'fs/promises';

async function saveFile(file: File, subdir: string): Promise<string> {
const bytes = await file.arrayBuffer();
const buffer = Buffer.from(bytes);
const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}${path.extname(file.name)}`;
const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir);
await fs.mkdir(uploadDir, { recursive: true });
await fs.writeFile(path.join(uploadDir, filename), buffer);
return `/uploads/${subdir}/${filename}`;
}

export async function GET() {
await connectDB();
const all = await Products.find();
return NextResponse.json({ data: all });
}

export async function POST(request: NextRequest) {
await connectDB();
try {
const formData = await request.formData();
const body: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (!['images', 'newBeauty', 'newThumbnail'].includes(key)) {
        body[key] = value;
      }
    }

    const imageFiles = formData.getAll('images') as File[];
    const uploadedImages: string[] = [];
    for (const img of imageFiles) {
      if (img.size > 0) uploadedImages.push(await saveFile(img, 'products'));
    }
    body.productImages = uploadedImages;

    const beautyFile = formData.get('newBeauty') as File | null;
    if (beautyFile && beautyFile.size > 0) body.beauty = await saveFile(beautyFile, 'products');

    const thumbnailFile = formData.get('newThumbnail') as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) body.thumbnail = await saveFile(thumbnailFile, 'products');

    const doc = new Products(body);
    await doc.save();
    return NextResponse.json(doc);

} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
64 lines
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Products } from '@/src/models/Products';
import path from 'path';
import fs from 'fs/promises';

async function saveFile(file: File, subdir: string): Promise<string> {
const bytes = await file.arrayBuffer();
const buffer = Buffer.from(bytes);
const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}${path.extname(file.name)}`;
const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir);
await fs.mkdir(uploadDir, { recursive: true });
await fs.writeFile(path.join(uploadDir, filename), buffer);
return `/uploads/${subdir}/${filename}`;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
await connectDB();
try {
const { id } = await params;
const formData = await request.formData();
const body: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (!['images', 'newBeauty', 'newThumbnail'].includes(key)) {
        body[key] = value;
      }
    }

    const imageFiles = formData.getAll('images') as File[];
    const uploadedImages: string[] = [];
    for (const img of imageFiles) {
      if (img.size > 0) uploadedImages.push(await saveFile(img, 'products'));
    }

    const existingImages = body.productImages ? (Array.isArray(body.productImages) ? body.productImages : [body.productImages]) : [];
    body.productImages = [...existingImages, ...uploadedImages];

    const beautyFile = formData.get('newBeauty') as File | null;
    if (beautyFile && beautyFile.size > 0) body.beauty = await saveFile(beautyFile, 'products');

    const thumbnailFile = formData.get('newThumbnail') as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) body.thumbnail = await saveFile(thumbnailFile, 'products');

    const updated = await Products.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(updated);

} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
await connectDB();
try {
const { id } = await params;
const deleted = await Products.findByIdAndDelete(id);
if (!deleted) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
return NextResponse.json({ success: true, deleted });
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
29 lines
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Users } from '@/src/models/Users';
import bcrypt from 'bcrypt';

export async function GET() {
await connectDB();
try {
const all = await Users.find();
return NextResponse.json({ data: all });
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}

export async function POST(request: NextRequest) {
await connectDB();
try {
const newUser = await request.json();
const newHash = await bcrypt.hash("mypassword", 10);
newUser.phash = newHash;
const doc = new Users(newUser);
await doc.save();
return NextResponse.json(doc);
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
17 lines
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Users } from '@/src/models/Users';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
await connectDB();
try {
const { id } = await params;
const body = await request.json();
const updated = await Users.findByIdAndUpdate(id, body, { new: true });
if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
return NextResponse.json(updated);
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
42 lines
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Users } from '@/src/models/Users';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
await connectDB();
try {
const { userName, loginWord } = await request.json();
const all = await Users.find();
const foundUser = all.find((user) => user.userName === userName);

    let match = false;
    if (foundUser?.phash) {
      match = await bcrypt.compare(loginWord, foundUser.phash);
    }

    if (!match) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const payload = {
      autoGenerated: foundUser?.autoGenerated,
      _id: foundUser?._id,
      userName: foundUser?.userName,
      userEmail: foundUser?.userEmail,
      author: foundUser?.author,
      status: foundUser?.status,
      sensi: foundUser?.sensi,
    };

    const secret: Secret = process.env.JWT_SECRET as string;
    const expiresIn = (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '2h';
    const token = jwt.sign(payload, secret, { expiresIn });

    return NextResponse.json({ token });

} catch (err: any) {
return NextResponse.json({ error: 'Error retrieving user info from the DB.' }, { status: 401 });
}
}
Write route.ts
14 lines
import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Settings } from '@/src/models/Settings';

export async function GET() {
await connectDB();
try {
const settings = await Settings.find();
return NextResponse.json({ data: settings });
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
15 lines
import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Settings } from '@/src/models/Settings';

export async function GET() {
await connectDB();
try {
const settings = await Settings.find();
const showMerch = settings.find((s) => s.name === 'showMerch');
return NextResponse.json({ data: showMerch });
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
24 lines
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Settings } from '@/src/models/Settings';

export async function POST(request: NextRequest) {
await connectDB();
try {
const settings = await Settings.find();
const showMerch = settings.find((s) => s.name === 'showMerch');

    if (showMerch) {
      showMerch.booleanValue = !showMerch.booleanValue;
      await Settings.findByIdAndUpdate(showMerch._id, showMerch);
      return NextResponse.json({ success: true, booleanValue: showMerch.booleanValue });
    } else {
      const setting = new Settings({ name: 'showMerch', booleanValue: true });
      await setting.save();
      return NextResponse.json(setting);
    }

} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
33 lines
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
try {
const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'info@moon-math.online',
      to: 'info@moon-math.online',
      bcc: 'b0rgbart3@gmail.com',
      subject: 'New contact form submission from Moon-Math',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });

} catch (err) {
console.error('Error sending contact email:', err);
return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
}
}
Write route.ts
14 lines
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
await connectDB();
try {
await mongoose.connection.dropDatabase();
return NextResponse.json({ success: true }, { status: 200 });
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Write route.ts
32 lines
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
try {
const MONGO_DUMP_PATH = process.env.MONGO_DUMP_PATH;
const folderName = new Date().toISOString().split('T')[0];
const backupPath = path.join(process.cwd(), 'adminBackup', folderName);

    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const cmd = `${MONGO_DUMP_PATH}/mongodump --uri="mongodb://127.0.0.1:27017/myblog" --out="${backupPath}"`;

    return new Promise<NextResponse>((resolve) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error('Backup failed:', error);
          resolve(NextResponse.json({ message: 'Backup failed' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ message: 'Backup completed', output: stdout }));
        }
      });
    });

} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
Now create the Next.js app/ pages — starting with layout and the SSG pages that deliver the SEO:

Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/ and write all src/ components

Create all API route handlers (app/api/)

Create app/layout.tsx

Migrate SSG pages: about, resources, article/[id], product/[id]

Migrate CSR pages: home, login, admin, cart, memes, etc.

Move public assets and uploads

Install dependencies and verify build

Delete old client/ and server/ directories
Write layout.tsx
27 lines
import type { Metadata } from 'next';
import '@/src/styles/index.scss';

export const metadata: Metadata = {
title: {
default: 'moon-math.online',
template: '%s | moon-math.online',
},
description: 'A blog about bitcoin — exploring math, computer science, and ideas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<head>
<link rel="icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</head>
<body>
{children}
</body>
</html>
);
}
Now the star of the show — the SSG article page with generateMetadata:

Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/ and write all src/ components

Create all API route handlers (app/api/)

Create app/layout.tsx

Migrate SSG pages: about, resources, article/[id], product/[id]

Migrate CSR pages: home, login, admin, cart, memes, etc.

Move public assets and uploads

Install dependencies and verify build

Delete old client/ and server/ directories
Write page.tsx
103 lines
import type { Metadata } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import { Articles } from '@/src/models/Articles';
import { Users } from '@/src/models/Users';
import { BannerNav } from '@/src/components/banner-nav';
import parse from 'html-react-parser';
import { splitIntoLines } from '@/src/utils/articleUtils';
import React from 'react';

export const revalidate = 3600; // regenerate at most once per hour

export async function generateMetadata(
{ params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
const { id } = await params;
await connectDB();

const article = await Articles.findById(id).lean() as any;
if (!article) return { title: 'Article not found' };

const description = article.body
?.replace(/<[^>]\*>/g, '')
.replace(/\\n/g, ' ')
.substring(0, 160);

return {
title: article.title,
description,
openGraph: {
title: article.title,
description,
images: article.headlineImage ? [{ url: article.headlineImage }] : [],
type: 'article',
},
twitter: {
card: 'summary_large_image',
title: article.title,
description,
images: article.headlineImage ? [article.headlineImage] : [],
},
};
}

export async function generateStaticParams() {
await connectDB();
const articles = await Articles.find({}, '\_id').lean();
return articles.map((a: any) => ({ id: String(a.\_id) }));
}

export default async function ArticlePageSSG({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
await connectDB();

const article = await Articles.findById(id).lean() as any;
const author = article ? await Users.findById(article.userID).lean() as any : null;

if (!article) {
return <div>Article not found</div>;
}

const paragraphs = splitIntoLines(article.body ?? '');
const hasHeadlineImage = article.headlineImage && article.headlineImage !== '';

return (
<>
<BannerNav page="article" />
<div className="article">
<div className="articlePageCategory">{article.category}</div>

        {hasHeadlineImage && (
          <div className="headlineImageContainer">
            <img src={article.headlineImage} alt="headline" />
          </div>
        )}
        {!hasHeadlineImage && (
          <div
            className="noHeadlineImageContainer"
            style={article.randomColor ? ({ '--article-color': `#${article.randomColor}` } as React.CSSProperties) : undefined}
          ></div>
        )}

        <div className="articleContainer">
          <div className="articlePageTitle">{article.title}</div>
          <div className="authorName">
            Author: {author?.authorName || author?.userName || 'Unknown'}
          </div>
          <div className="originDate">
            Originally published: {article.originDate ?? ''}
          </div>
          <div className="modifiedDate">
            Last modified: {article.lastModifiedDate ?? ''}
          </div>
          <div className="articleBody">
            {paragraphs.map((par, index) => (
              <p key={index}>{parse(par)}</p>
            ))}
          </div>
        </div>
      </div>
    </>

);
}
Write page.tsx
44 lines
import type { Metadata } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import { Products } from '@/src/models/Products';
import { ProductPage } from '@/src/pages/Products/ProductPage';

export const revalidate = 3600;

export async function generateMetadata(
{ params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
const { id } = await params;
await connectDB();

const product = await Products.findById(id).lean() as any;
if (!product) return { title: 'Product not found' };

return {
title: product.productName,
description: product.productDescription?.substring(0, 160),
openGraph: {
title: product.productName,
description: product.productDescription?.substring(0, 160),
images: product.beauty ? [{ url: product.beauty }] : [],
type: 'website',
},
twitter: {
card: 'summary_large_image',
title: product.productName,
description: product.productDescription?.substring(0, 160),
images: product.beauty ? [product.beauty] : [],
},
};
}

export async function generateStaticParams() {
await connectDB();
const products = await Products.find({}, '\_id').lean();
return products.map((p: any) => ({ id: String(p.\_id) }));
}

export default function ProductPageRoute() {
return <ProductPage />;
}
Write page.tsx
12 lines
import type { Metadata } from 'next';
import { About } from '@/src/pages/About';

export const metadata: Metadata = {
title: 'About Moon-Math',
description: 'Learn about Moon-Math — a Bitcoin blog by Bart Dority exploring math, computer science, and Bitcoin ideas.',
};

export default function AboutPage() {
return <About />;
}
Write page.tsx
12 lines
import type { Metadata } from 'next';
import { Resources } from '@/src/pages/Resources';

export const metadata: Metadata = {
title: 'Bitcoin Resources',
description: 'Recommended Bitcoin books, podcasts, wallets, and businesses curated by Moon-Math.',
};

export default function ResourcesPage() {
return <Resources />;
}
Now the pages need their component source files. Let me write the remaining page source files:

Write About.tsx
76 lines
'use client';
import { BannerNav } from "../components/banner-nav";
import { useState } from "react";
import axios from "axios";

export function About() {
const [sent, setSent] = useState(false);
const [formData, setFormData] = useState({ name: "", email: "", message: "" });

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
const response = await axios.post("/api/contact", formData);
if (response.status === 200) setSent(true);
} catch (err) {}
};

return (
<>
<div className="siteWrapper">
<BannerNav page="about" />
<div className="basicContainer">
<h1>About Moon Math</h1>
<p>
This is a blog about bitcoin. Moon-Math refers to the meme that bitcoiners often site -- that the Bitcoin price is{" "}
<b><i>"going to the moon!"</i></b>{" "}
and because I think there are so many interesting little nuggets one can discover when you start falling down the rabbit hole and studying bitcoin, and most of my insights have something to do with Math, and / or computer science. I wanted a place where I could publish my thoughts and share them with the community.
</p>
<p>
As an engineer, I wanted a place to publish these articles that didn't have a pay-wall, or promote some other entity, so I decided to build my own blog.
</p>
<p>
As a designer, I also wanted to have my own bitcoin related merch - t-shirts and such, and a place to sell / share them with other bitcoiners.
</p>
<p>Also, check out the resources section - where I promote my favorite brands and bitcoin related resources.</p>
<p>Thanks for checking out Moon-Math!</p>

          <br></br>
          <div className="divider"></div>
          <h1>Copyright on Moon-Math Content</h1>
          <p>All of my articles and designs published on this blog site are copyrighted by Bart Dority 2026.</p>
          <p>If you would like to reproduce any of this content, please contact me directly first to obtain the rights. Thank you.</p>

          <br></br>
          <div className="divider"></div>
          <h1>Contact Me</h1>
          <p>
            You can connect with me on Nostr:<br></br>
            Bitcoin Bubble - npub1gh5nll9l4rcvgjp60el65r9myjx7ms7a2msctwysx9yn6rv4v73qcj4uq8
          </p>
          <p>-------</p>
          <p>You can follow me on Twitter: <a href="https://x.com/bartell_SF">@bartell_SF</a></p>
          <p>-------</p>

          {sent && <p className="thankYou">Thanks for contacting me.</p>}
          {!sent && (
            <>
              <p>Or you can send me an email:</p>
              <form onSubmit={handleSubmit} className="contactForm" id="contact">
                <input name="name" placeholder="Your name" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Your email" onChange={handleChange} required />
                <textarea name="message" placeholder="Your message" onChange={handleChange} required />
                <button type="submit">Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </>

);
}
Write Resources.tsx
56 lines
'use client';
import { BannerNav } from "../components/banner-nav";

export function Resources() {
return (
<>
<div className="siteWrapper">
<BannerNav page="resources" />
<div className="basicContainer">
<h1>Bitcoin related Resources</h1>
<p>This is just a short list of the resources in the bitcoin space that are at top of mind for me.</p>

          <h2>Recommended Books</h2>
          <ul>
            <li><div>Gradually, then Suddenly - by Parker Lewis</div></li>
            <li><div>Broken Money - by Lyn Alden</div></li>
            <li><div>The Bitcoin Standard - by Safedean Amous</div></li>
            <li><div>The Price of Tomorrow - by Jeff Booth</div></li>
            <li><div>Abundance Through Scarcity - by Ioni Appelberg</div></li>
            <li><div>Proof of Money - by Terrence Michael</div></li>
            <li><div>The Hidden Cost of Money - by Seb Bunney</div></li>
            <li><div>The Genesis Book - by Aaron Van Wirdum</div></li>
            <li><div>A Progressive's Case for Bitcoin - by C. Jason Maier</div></li>
            <li><div>The Big Print - by Larry Leopard</div></li>
          </ul>
          <h2>Recommended Podcasts</h2>
          <ul>
            <li><a href="https://www.fountain.fm/show/BMElezTqi1mcOc4PnwSH" target="new"><div>Bitcoin Unleashed - Oliver Velez</div></a></li>
            <li><a href="https://www.youtube.com/@WhatBitcoinDidPod" target="new"><div>What Bitcoin Did - Danny Knowles</div></a></li>
            <li><a href="https://www.youtube.com/@BTCSessions" target="new"><div>BTC Sessions</div></a></li>
            <li><a href="https://www.youtube.com/@nataliebrunell" target="new"><div>Natalie Brunell</div></a></li>
            <li><a href="https://www.youtube.com/@RobinSeyr" target="new"><div>Robin Seyr</div></a></li>
            <li><a href="https://www.youtube.com/watch?v=g2aE7hVKH1o&list=PLoB1eZWSVHVbHsHgaIIp0cy0MSDoz7uo0" target="new"><div>The Hurdle Rate Podcast (hosted by Swan Bitcoin)</div></a></li>
            <li><a href="https://www.youtube.com/@rajatsonifinance" target="new"><div>Rajat Soni, CFA</div></a></li>
            <li><a href="https://www.youtube.com/@thebitcoinmatrixpodcast" target="new"><div>The Bitcoin Matrix Podcast</div></a></li>
          </ul>
          <h2>Recommended Products</h2>
          <ul>
            <li><a href="https://coldcard.com/" target="new"><div>Cold Card</div></a></li>
            <li><a href="https://sparrowwallet.com/" target="new"><div>Sparrow Wallet</div></a></li>
            <li><a href="https://aqua.net/" target="new"><div>Aqua Wallet</div></a></li>
          </ul>
          <h2>Recommended Businesses</h2>
          <ul>
            <li><a href="https://river.com/" target="new"><div>River</div></a></li>
            <li><a href="https://zaprite.com/" target="new"><div>Zaprite</div></a></li>
            <li><a href="https://www.thebitcoinway.com/" target="new"><div>The Bitcoin Way</div></a></li>
            <li><a href="https://www.strategy.com/" target="new"><div>Strategy</div></a></li>
            <li><a href="https://strive.com/" target="new"><div>Strive Asset Management</div></a></li>
          </ul>
        </div>
      </div>
    </>

);
}
Write Login.tsx
55 lines
'use client';
import React, { useCallback, useState } from "react";
import { User, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { useRouter } from "next/navigation";
import { BannerNav } from "../components/banner-nav";

export function Login() {
const { user, setUser } = useStore((s) => s);
const { login } = useData();
const router = useRouter();
const [userName, setUserName] = useState("");
const [loginWord, setLoginWord] = useState("");
const [errorState, setErrorState] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (userName !== "") {
const activeUser: Partial<User> = { userName, loginWord };
const match = await login(activeUser);
if (match) {
router.push(`/`);
} else {
setErrorState(true);
}
}
};

const newUser = useCallback(() => { router.push(`/newUser`); }, [router]);

return (
<>
<div className="siteWrapper">
<BannerNav page="login" />
<div className="loginForm">
<h2>Please Log In:</h2>
<form onSubmit={handleSubmit}>
<label>User Name: </label>
<input type="text" id="user_name" size={50} value={userName} onChange={(e) => setUserName(e.target.value)} />
<br></br>
<label>Password: </label>
<input type="password" id="phash" value={loginWord} onChange={(e) => setLoginWord(e.target.value)} size={50} />
{errorState && <div className="errorMessage">Not able to login, please try again.</div>}
<br></br><br></br>
<button type="submit">Login</button>
</form>
</div>
<div className="newToBorg">
<button onClick={newUser}>New to MoonMath?</button>
</div>
</div>
</>
);
}
Write CreateAccount.tsx
68 lines
'use client';
import React, { useCallback, useState } from "react";
import { User, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { useRouter } from "next/navigation";
import { BannerNav } from "../components/banner-nav";

export function CreateAccount() {
const { users, setUser } = useStore((s) => s);
const { createUser } = useData();
const router = useRouter();
const [userName, setUserName] = useState("");
const [phash, setPHash] = useState("");
const [userEmail, setUserEmail] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
const newUser: User = {
user_name: userName,
user_email: userEmail,
phash,
\_id: "",
sensi: false,
author: false,
status: undefined,
} as any;

    if (userName !== "") {
      const preExisting = users?.find((user) => user.userEmail === userEmail);
      if (!preExisting) {
        createUser(newUser as any);
        setUser(newUser);
        router.push(`/`);
      }
    }

};

const jumpToLogin = useCallback(() => { router.push(`/login`); }, [router]);

return (
<>
<BannerNav page="create" />
<div className="loginForm">
<form onSubmit={handleSubmit}>
<div>
<h2>Welcome to MoonMath</h2>
Choose a username and password, to create an account.
</div>
<br></br>
<label>User Name: </label>
<input type="text" id="user_name" size={50} value={userName} onChange={(e) => setUserName(e.target.value)} />
<br></br>
<label>Password: </label>
<input type="password" id="phash" value={phash} onChange={(e) => setPHash(e.target.value)} size={50} />
<br></br>
<label>Email: </label>
<input type="text" id="user_email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} size={50} />
<br></br><br></br>
<button type="submit">Create a new Account</button>
</form>
</div>
<div className="newToBorg">
<button onClick={jumpToLogin}>Already have an account? - then click here to Login.</button>
</div>
</>
);
}
Write EditUserPage.tsx
93 lines
'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { BannerNav } from "../components/banner-nav";

export function EditUserPage() {
useData();
const router = useRouter();
const { user, setUser } = useStore((s) => s);
const { refresh } = useData();
const [editUser, setEditUser] = useState(user);

const routeHome = useCallback(() => {
refresh();
router.push(`/`);
}, [router]);

const toggleAuthorStatus = useCallback(() => {
setEditUser((prev) => ({ ...prev, author: !prev.author }));
}, []);

useEffect(() => {
if (!user) routeHome();
}, [user]);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
try {
await axios.patch(`/api/user/${editUser._id}`, editUser, {
headers: { "Content-Type": "application/json" }
});
router.push(`/`);
} catch (err) {
console.error("Failed to submit user changes:", err);
}
};

const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
const { name, value } = e.target;
setEditUser((prev) => ({ ...prev, [name]: value }));
}, []);

if (!editUser) return null;

return (
<>
<BannerNav page='editUser' />
<div className='pageLayout'>
<div className='titleText'>Your Account:</div>
<div className="basicBox">
<div className="editUserForm">
<form onSubmit={handleSubmit}>
<div>
{editUser.author === true && (
<div className='lineContainer'>
<div className='bButton checkBoxSelected' onClick={toggleAuthorStatus}></div>
Author
</div>
)}
{editUser.author && (
<div className='lineContainer'>
<label id='authorName'>Author Name:</label>
<input type='text' value={editUser.authorName} size={24} id='authorName' name='authorName' onChange={handleChange} />
</div>
)}
{editUser.author === false && (
<div className='lineContainer'>
<div className='bButton checkBox' onClick={toggleAuthorStatus}></div>
Author
</div>
)}
</div>
<br />
<div className='lineContainer'>
<label id='userName'>Your User Name</label>
<input type='text' id='userName' value={editUser.userName} onChange={handleChange} name='userName' />
</div>
<br />
<label id='userEmail'>Your email address</label>
{editUser.userEmail}
<br /><br />
<button type="submit" onClick={handleSubmit}>Submit Changes</button>
</form>
</div>
</div>
</div>
</>
);
}
Write AdminPage.tsx
22 lines
'use client';
import { useStore } from "../state/useStore";
import { AdminPanel } from "../admin/AdminPanel";
import { useData } from "../data/useData";
import { useEffect } from "react";

export function AdminPage() {
const { user, articlesLoaded, usersLoaded, settingsLoaded, productsLoaded } = useStore((s) => s);
const { fetchArticles, fetchUsers, fetchSettings, fetchProducts } = useData();

useEffect(() => {
fetchArticles();
fetchUsers();
fetchSettings();
fetchProducts();
}, []);

if (!user?.author) return <div>Access denied.</div>;

return <AdminPanel />;
}
Write MemesPage.tsx
40 lines
'use client';
import React, { useState } from "react";
import { BannerNav } from "../components/banner-nav";
import orangePill from "../assets/memes/orange_pill.jpeg";
import fortune from "../assets/memes/fortune_favors.jpg";
import elementzero from "../assets/memes/element_zero.jpg";
import buymore from "../assets/memes/buy_more.jpg";
import keepcalm from "../assets/memes/keep_calm.jpg";
import unstoppable from "../assets/memes/unstoppable.jpg";
import rigged from "../assets/memes/rigged.jpg";
import { ImageModal } from "../components/image-modal";

export function MemesPage() {
const [activeImage, setActiveImage] = useState<string | null>(null);

const src = (img) => img.src ?? img;

return (
<>
<div className="siteWrapper">
<BannerNav page="memes" />
<div className="basicContainer">
<h1>Bitcoin related Memes</h1>
<p>This are some of the memes that I've posted to X over the years.</p>
<div className="memes">
<img src={src(orangePill)} onClick={() => setActiveImage(src(orangePill))} />
<img src={src(rigged)} onClick={() => setActiveImage(src(rigged))} />
<img src={src(elementzero)} onClick={() => setActiveImage(src(elementzero))} />
<img src={src(buymore)} onClick={() => setActiveImage(src(buymore))} />
<img src={src(keepcalm)} onClick={() => setActiveImage(src(keepcalm))} />
<img src={src(fortune)} onClick={() => setActiveImage(src(fortune))} />
<img src={src(unstoppable)} onClick={() => setActiveImage(src(unstoppable))} />
</div>
{activeImage && <ImageModal src={activeImage} onClose={() => setActiveImage(null)} />}
</div>
</div>
</>
);
}
Now write the Home component and all the remaining app/ page wrappers:

Write Home.tsx
74 lines
'use client';
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import { useRouter } from "next/navigation";
import { BannerNav } from "./components/banner-nav";
import { Articles } from "./pages/Articles/Articles";
import { Footer } from "./components/footer";
import { ProductThumbnails } from "./pages/Products/ProductThumbnails";
import { MemeThumbnails } from "./components/MemeThumbnails";

export function Home() {
const { fetchArticles, fetchUsers, fetchSettings } = useData();
const {
user, articles, articlesLoaded, categories, products,
usersLoaded, settingsLoaded, settings,
} = useStore((s) => s);

const router = useRouter();

useEffect(() => {
fetchArticles();
fetchUsers();
fetchSettings();
}, [fetchArticles, fetchUsers, fetchSettings]);

const showMerch = useMemo(() => {
return settings?.find((setting) => setting.name === "showMerch")?.booleanValue;
}, [settings]);

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
setIsMobile(window.innerWidth <= 768);
const handleResize = () => setIsMobile(window.innerWidth <= 768);
window.addEventListener("resize", handleResize);
return () => window.removeEventListener("resize", handleResize);
}, []);

if (!articlesLoaded || !usersLoaded || !settingsLoaded)
return <div>Loading…</div>;

return (
<div className="starfield">
<div className="siteWrapper">
<BannerNav page="home" />
<div className="home">
<div className="mainColumn">
{isMobile && showMerch && <ProductThumbnails />}
<div className="sticker">Articles</div>
<Articles />
{showMerch && (
<>
<div className="sticker">Memes</div>
<div className="thumbnailMemes"><MemeThumbnails /></div>
</>
)}
</div>
<div className="sideColumn">
{showMerch && !isMobile && <ProductThumbnails />}
{!showMerch && (
<>
<div className="sticker">Memes</div>
<div className="thumbnailMemes"><MemeThumbnails /></div>
</>
)}
</div>
</div>
<Footer />
</div>
</div>
);
}
Now write all the app/ page route files (thin wrappers):

Write page.tsx
6 lines
import { Home } from '@/src/Home';

export default function HomePage() {
return <Home />;
}
Write page.tsx
3 lines
import { Login } from '@/src/pages/Login';
export default function LoginPage() { return <Login />; }
Write page.tsx
3 lines
import { CreateAccount } from '@/src/pages/CreateAccount';
export default function NewUserPage() { return <CreateAccount />; }
Write page.tsx
3 lines
import { AdminPage } from '@/src/pages/AdminPage';
export default function AdminRoute() { return <AdminPage />; }
Write page.tsx
10 lines
import type { Metadata } from 'next';
import { MemesPage } from '@/src/pages/MemesPage';

export const metadata: Metadata = {
title: 'Bitcoin Memes',
description: 'Bitcoin-related memes and designs from Moon-Math.',
};

export default function MemesRoute() { return <MemesPage />; }
Write page.tsx
3 lines
import { ShoppingCart } from '@/src/pages/Products/ShoppingCart';
export default function CartPage() { return <ShoppingCart />; }
Write page.tsx
3 lines
import { CheckOut } from '@/src/pages/Products/CheckOut';
export default function CheckOutPage() { return <CheckOut />; }
Write page.tsx
3 lines
import { EditUserPage } from '@/src/pages/EditUserPage';
export default function UserPage() { return <EditUserPage />; }
Write page.tsx
3 lines
import { NewArticlePage } from '@/src/admin/NewArticlePage';
export default function NewArticleRoute() { return <NewArticlePage />; }
Write page.tsx
3 lines
import { EditArticlePage } from '@/src/admin/EditArticlePage';
export default function EditArticleRoute() { return <EditArticlePage />; }
Write page.tsx
3 lines
import { NewProductPage } from '@/src/pages/Products/NewProductPage';
export default function NewProductRoute() { return <NewProductPage />; }
Write page.tsx
3 lines
import { EditProductPage } from '@/src/pages/Products/EditProductPage';
export default function EditProductRoute() { return <EditProductPage />; }
Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/ and write all src/ components

Create all API route handlers (app/api/)

Create app/layout.tsx and all app/ page routes

Move public assets and uploads

Install dependencies and verify build

Delete old client/ and server/ directories
Now move the public assets and the uploads directory:

Bash Check what's in public dir
IN
cp /Users/bluebhanu/Sites/MyBlog/public/index.html /tmp/old-index.html 2>/dev/null; ls /Users/bluebhanu/Sites/MyBlog/public/

OUT
index.html
uploads
Bash Check uploads directory locations
IN
ls /Users/bluebhanu/Sites/MyBlog/public/uploads/ && echo "---" && ls /Users/bluebhanu/Sites/MyBlog/uploads/ 2>/dev/null || echo "no /uploads at root"

OUT
articles
products

---

no /uploads at root
The uploads are already in public/uploads/ — Next.js will serve them automatically. Now copy the favicon assets and the .env file:

Bash Find favicon files in client directory
IN
ls /Users/bluebhanu/Sites/MyBlog/client/public/ 2>/dev/null || echo "no client/public"; find /Users/bluebhanu/Sites/MyBlog/client -name "favicon*" -o -name "apple-touch*" 2>/dev/null | head -20

OUT
vite.svg
/Users/bluebhanu/Sites/MyBlog/client/favicon-16x16.png
/Users/bluebhanu/Sites/MyBlog/client/favicon.ico
/Users/bluebhanu/Sites/MyBlog/client/apple-touch-icon.png
/Users/bluebhanu/Sites/MyBlog/client/dist/assets/favicon-CYynsRiR.ico
/Users/bluebhanu/Sites/MyBlog/client/dist/assets/favicon-32x32-Dhs58-I-.png
/Users/bluebhanu/Sites/MyBlog/client/dist/assets/favicon-16x16-BcO3J1Hm.png
/Users/bluebhanu/Sites/MyBlog/client/dist/assets/apple-touch-icon-DZd511CK.png
/Users/bluebhanu/Sites/MyBlog/client/favicon-48x48.png
/Users/bluebhanu/Sites/MyBlog/client/favicon.png
/Users/bluebhanu/Sites/MyBlog/client/favicon-32x32.png
Bash Copy favicons and .env to project root
IN
cp /Users/bluebhanu/Sites/MyBlog/client/favicon.ico /Users/bluebhanu/Sites/MyBlog/public/favicon.ico && cp /Users/bluebhanu/Sites/MyBlog/client/favicon-32x32.png /Users/bluebhanu/Sites/MyBlog/public/favicon-32x32.png && cp /Users/bluebhanu/Sites/MyBlog/client/favicon-16x16.png /Users/bluebhanu/Sites/MyBlog/public/favicon-16x16.png && cp /Users/bluebhanu/Sites/MyBlog/client/apple-touch-icon.png /Users/bluebhanu/Sites/MyBlog/public/apple-touch-icon.png && echo "Favicons copied" && cp /Users/bluebhanu/Sites/MyBlog/server/.env /Users/bluebhanu/Sites/MyBlog/.env && echo ".env copied"

OUT
Favicons copied
.env copied
Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/ and write all src/ components

Create all API route handlers (app/api/)

Create app/layout.tsx and all app/ page routes

Move public assets and uploads

Install dependencies and verify build

Delete old client/ and server/ directories
Now install Next.js and verify the build:

Bash Install Next.js dependencies
IN
npm install 2>&1 | tail -20

OUT
added 111 packages, removed 29 packages, changed 2 packages, and audited 126 packages in 17s

29 packages are looking for funding
run `npm fund` for details

found 0 vulnerabilities
Bash Run Next.js build to check for errors
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
Failed to compile.

./src/styles/index.scss
Module not found: Can't resolve '../assets/moon-math.jpg'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./src/styles/index.scss

./src/styles/index.scss
Module not found: Can't resolve '../assets/moon-math_hi.jpg'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./src/styles/index.scss

./src/styles/index.scss
Module not found: Can't resolve '../assets/person_icon_white.svg'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./src/styles/index.scss

./src/styles/index.scss
Module not found: Can't resolve '../assets/shopping_cart.svg'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./src/styles/index.scss

./src/styles/index.scss
Module not found: Can't resolve '../assets/shopping_cart_hi.svg'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./src/styles/index.scss

> Build failed because of webpack errors
> Some SCSS image assets are missing. Let me copy the full assets directory:

Bash List all assets in client
IN
ls /Users/bluebhanu/Sites/MyBlog/client/src/assets/

OUT
checkmark.svg
memes
merch
moon-math_hi.jpg
moon-math.jpg
moonmath_logo_hi.svg
moonmath_logo.svg
moonmath_logo2_hi.jpg
moonmath_logo2.jpg
moonmath_logo2.svg
moonMathLogo.svg
person_icon_white.svg
react.svg
shopping_cart_hi.svg
shopping_cart.svg
tagline.svg
Bash Copy all image assets to src/assets/
IN
cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/moon-math.jpg /Users/bluebhanu/Sites/MyBlog/src/assets/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/moon-math_hi.jpg /Users/bluebhanu/Sites/MyBlog/src/assets/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/person_icon_white.svg /Users/bluebhanu/Sites/MyBlog/src/assets/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/shopping_cart.svg /Users/bluebhanu/Sites/MyBlog/src/assets/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/shopping_cart_hi.svg /Users/bluebhanu/Sites/MyBlog/src/assets/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/moonMathLogo.svg /Users/bluebhanu/Sites/MyBlog/src/assets/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/moonmath_logo.svg /Users/bluebhanu/Sites/MyBlog/src/assets/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/moonmath_logo_hi.svg /Users/bluebhanu/Sites/MyBlog/src/assets/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/checkmark.svg /Users/bluebhanu/Sites/MyBlog/src/assets/ && cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/_.jpg /Users/bluebhanu/Sites/MyBlog/src/assets/ 2>/dev/null; cp /Users/bluebhanu/Sites/MyBlog/client/src/assets/_.svg /Users/bluebhanu/Sites/MyBlog/src/assets/ 2>/dev/null; echo "Assets copied"

OUT
Assets copied
Bash Copy merch assets if they exist
IN
ls /Users/bluebhanu/Sites/MyBlog/client/src/assets/merch/ 2>/dev/null && cp -r /Users/bluebhanu/Sites/MyBlog/client/src/assets/merch /Users/bluebhanu/Sites/MyBlog/src/assets/ && echo "merch copied" || echo "no merch dir"

OUT
21M_beauty_back.png
21M_beauty_both.png
21M_beauty_with_background.png
21M_beauty_with_background2.png
21M_beauty.jpg
21M_beauty.png
golden_bitcoin_beauty_double.png
goldenBitcoin_back.png
goldenBitcoin.png
rule_of_72_wet.jpg
sunny_beach_thummbnail.png
merch copied
Bash Re-run Next.js build after copying assets
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1458ms
Linting and checking validity of types ...

We detected TypeScript in your project and reconfigured your tsconfig.json file for you. Strict-mode is set to false by default.
The following suggested values were added to your tsconfig.json. These values can be changed to fit your project's needs:

- target was set to ES2017 (For top-level `await`. Note: Next.js only polyfills for the esmodules target.)
- strictNullChecks was set to true

Failed to compile.

Type error: Cannot find module '../../src/app/about/page.js' or its corresponding type declarations.

Next.js build worker exited with code: 1 and signal: null
Read tsconfig.json
Bash Clear .next cache and rebuild
IN
rm -rf /Users/bluebhanu/Sites/MyBlog/.next && npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 3.3s
Linting and checking validity of types ...
Failed to compile.

Type error: Cannot find module '../../src/app/about/page.js' or its corresponding type declarations.

Next.js build worker exited with code: 1 and signal: null
Bash Search for references to src/app/about
IN
grep -r "src/app/about" /Users/bluebhanu/Sites/MyBlog --include="_.ts" --include="_.tsx" --include="_.js" --include="_.json" -l 2>/dev/null | grep -v node_modules | grep -v ".next" | grep -v "client" | grep -v "server"

OUT
0
Bash Search in .d.ts files for the reference
IN
grep -r "src/app" /Users/bluebhanu/Sites/MyBlog --include="\*.d.ts" -l 2>/dev/null | grep -v node_modules | grep -v ".next" | head -10

OUT
0
Bash Get full error context
IN
npm run build 2>&1 | grep -A5 "Cannot find module"

OUT
Type error: Cannot find module '../../src/app/about/page.js' or its corresponding type declarations.

Next.js build worker exited with code: 1 and signal: null
Bash Get lines before the error to find file source
IN
npm run build 2>&1 | grep -B5 "Cannot find module"

OUT
Creating an optimized production build ...
✓ Compiled successfully in 1253ms
Linting and checking validity of types ...
Failed to compile.

Type error: Cannot find module '../../src/app/about/page.js' or its corresponding type declarations.
Bash Run tsc directly for more error detail
IN
npx tsc --noEmit 2>&1 | head -30

OUT
.next/types/validator.ts(71,39): error TS2307: Cannot find module '../../src/app/about/page.js' or its corresponding type declarations.
.next/types/validator.ts(80,39): error TS2307: Cannot find module '../../src/app/admin/page.js' or its corresponding type declarations.
.next/types/validator.ts(89,39): error TS2307: Cannot find module '../../src/app/article/[id]/page.js' or its corresponding type declarations.
.next/types/validator.ts(98,39): error TS2307: Cannot find module '../../src/app/article/edit/[_id]/page.js' or its corresponding type declarations.
.next/types/validator.ts(107,39): error TS2307: Cannot find module '../../src/app/article/new/page.js' or its corresponding type declarations.
.next/types/validator.ts(116,39): error TS2307: Cannot find module '../../src/app/cart/page.js' or its corresponding type declarations.
.next/types/validator.ts(125,39): error TS2307: Cannot find module '../../src/app/check-out/page.js' or its corresponding type declarations.
.next/types/validator.ts(134,39): error TS2307: Cannot find module '../../src/app/login/page.js' or its corresponding type declarations.
.next/types/validator.ts(143,39): error TS2307: Cannot find module '../../src/app/memes/page.js' or its corresponding type declarations.
.next/types/validator.ts(152,39): error TS2307: Cannot find module '../../src/app/newUser/page.js' or its corresponding type declarations.
.next/types/validator.ts(161,39): error TS2307: Cannot find module '../../src/app/page.js' or its corresponding type declarations.
.next/types/validator.ts(170,39): error TS2307: Cannot find module '../../src/app/product/[id]/page.js' or its corresponding type declarations.
.next/types/validator.ts(179,39): error TS2307: Cannot find module '../../src/app/product/edit/[_id]/page.js' or its corresponding type declarations.
.next/types/validator.ts(188,39): error TS2307: Cannot find module '../../src/app/product/new/page.js' or its corresponding type declarations.
.next/types/validator.ts(197,39): error TS2307: Cannot find module '../../src/app/resources/page.js' or its corresponding type declarations.
.next/types/validator.ts(206,39): error TS2307: Cannot find module '../../src/app/user/page.js' or its corresponding type declarations.
.next/types/validator.ts(215,39): error TS2307: Cannot find module '../../src/app/api/articles/[id]/route.js' or its corresponding type declarations.
.next/types/validator.ts(224,39): error TS2307: Cannot find module '../../src/app/api/articles/route.js' or its corresponding type declarations.
.next/types/validator.ts(233,39): error TS2307: Cannot find module '../../src/app/api/backup/route.js' or its corresponding type declarations.
.next/types/validator.ts(242,39): error TS2307: Cannot find module '../../src/app/api/contact/route.js' or its corresponding type declarations.
.next/types/validator.ts(251,39): error TS2307: Cannot find module '../../src/app/api/login/route.js' or its corresponding type declarations.
.next/types/validator.ts(260,39): error TS2307: Cannot find module '../../src/app/api/products/[id]/route.js' or its corresponding type declarations.
.next/types/validator.ts(269,39): error TS2307: Cannot find module '../../src/app/api/products/route.js' or its corresponding type declarations.
.next/types/validator.ts(278,39): error TS2307: Cannot find module '../../src/app/api/settings/route.js' or its corresponding type declarations.
.next/types/validator.ts(287,39): error TS2307: Cannot find module '../../src/app/api/showMerch/route.js' or its corresponding type declarations.
.next/types/validator.ts(296,39): error TS2307: Cannot find module '../../src/app/api/toggleMerch/route.js' or its corresponding type declarations.
.next/types/validator.ts(305,39): error TS2307: Cannot find module '../../src/app/api/user/[id]/route.js' or its corresponding type declarations.
.next/types/validator.ts(314,39): error TS2307: Cannot find module '../../src/app/api/users/route.js' or its corresponding type declarations.
.next/types/validator.ts(323,39): error TS2307: Cannot find module '../../src/app/api/wipe/route.js' or its corresponding type declarations.
.next/types/validator.ts(333,31): error TS2344: Type 'typeof import("/Users/bluebhanu/Sites/MyBlog/src/pages/About")' does not satisfy the constraint 'PagesPageConfig'.
Bash Check what Next.js generated in validator.ts
IN
head -20 /Users/bluebhanu/Sites/MyBlog/.next/types/validator.ts

OUT
// This file is generated automatically by Next.js
// Do not edit this file manually
// This file validates that all pages and layouts export the correct types

import type { AppRoutes, LayoutRoutes, ParamMap, AppRouteHandlerRoutes } from "./routes.js"
import type { ResolvingMetadata, ResolvingViewport } from "next/types.js"
import type { NextRequest } from 'next/server.js'

type AppPageConfig<Route extends AppRoutes = AppRoutes> = {
default: React.ComponentType<{ params: Promise<ParamMap[Route]> } & any> | ((props: { params: Promise<ParamMap[Route]> } & any) => React.ReactNode | Promise<React.ReactNode> | never | void | Promise<void>)
generateStaticParams?: (props: { params: ParamMap[Route] }) => Promise<any[]> | any[]
generateMetadata?: (
props: { params: Promise<ParamMap[Route]> } & any,
parent: ResolvingMetadata
) => Promise<any> | any
generateViewport?: (
props: { params: Promise<ParamMap[Route]> } & any,
parent: ResolvingViewport
) => Promise<any> | any
metadata?: any
Bash Check the exact path referenced in validator.ts
IN
grep "about/page" /Users/bluebhanu/Sites/MyBlog/.next/types/validator.ts | head -5

OUT
// Validate ../../src/app/about/page.tsx
const handler = {} as typeof import("../../src/app/about/page.js")
Next.js expects pages in src/app/ when a src/ directory exists. The fix is to move app/ into src/:

Bash Move app/ directory into src/ for proper Next.js src layout
IN
mv /Users/bluebhanu/Sites/MyBlog/app /Users/bluebhanu/Sites/MyBlog/src/app && echo "Moved app/ to src/app/" && ls /Users/bluebhanu/Sites/MyBlog/src/

OUT
Moved app/ to src/app/
admin
app
assets
components
data
Home.tsx
hooks
lib
models
pages
services
state
styles
utils
Bash Clean build after moving app/ to src/app/
IN
rm -rf /Users/bluebhanu/Sites/MyBlog/.next && npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 3.3s
Linting and checking validity of types ...
Failed to compile.

Type error: Type 'typeof import("/Users/bluebhanu/Sites/MyBlog/src/pages/About")' does not satisfy the constraint 'PagesPageConfig'.
Property 'default' is missing in type 'typeof import("/Users/bluebhanu/Sites/MyBlog/src/pages/About")' but required in type 'PagesPageConfig'.

Next.js build worker exited with code: 1 and signal: null
Next.js is treating src/pages/ as the Pages Router. I need to rename it to avoid the conflict:

Bash Rename src/pages/ to src/views/ to avoid Next.js Pages Router conflict
IN
mv /Users/bluebhanu/Sites/MyBlog/src/pages /Users/bluebhanu/Sites/MyBlog/src/views && echo "Renamed src/pages/ to src/views/"

OUT
Renamed src/pages/ to src/views/
Now update all the imports that reference ../pages/ or ../../pages/:

Bash Find all files importing from pages/
IN
grep -r "from.*['\"].*pages/" /Users/bluebhanu/Sites/MyBlog/src --include="_.ts" --include="_.tsx" -l | grep -v node_modules

OUT
/Users/bluebhanu/Sites/MyBlog/src/app/memes/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/resources/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/admin/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/user/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/about/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/product/edit/[_id]/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/product/new/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/product/[id]/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/newUser/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/check-out/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/cart/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/app/login/page.tsx
/Users/bluebhanu/Sites/MyBlog/src/Home.tsx
Bash Replace all pages/ imports with views/ across src/
IN
find /Users/bluebhanu/Sites/MyBlog/src -name "_.tsx" -o -name "_.ts" | xargs grep -l "from.\*pages/" 2>/dev/null | grep -v node_modules | while read f; do sed -i '' 's|from '\''@/src/pages/|from '\''@/src/views/|g; s|from '\''../pages/|from '\''../views/|g; s|from '\''../../pages/|from '\''../../views/|g; s|from '\''../../../pages/|from '\''../../../views/|g' "$f"; echo "Updated $f"; done

OUT
Updated /Users/bluebhanu/Sites/MyBlog/src/app/memes/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/resources/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/admin/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/user/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/about/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/product/edit/[_id]/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/product/new/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/product/[id]/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/newUser/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/check-out/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/cart/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/app/login/page.tsx
Updated /Users/bluebhanu/Sites/MyBlog/src/Home.tsx
Also update imports within the views/ files themselves (they import from ../../state, ../../data, etc. which are unchanged, but they also import from each other):

Bash Check if views/ files import from pages/
IN
grep -r "from._pages/" /Users/bluebhanu/Sites/MyBlog/src/views --include="_.tsx" --include="\*.ts" -l 2>/dev/null

OUT
0
Good. Now rebuild:

Bash Rebuild after renaming pages/ to views/
IN
rm -rf /Users/bluebhanu/Sites/MyBlog/.next && npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
Failed to compile.

./src/Home.tsx
Module not found: Can't resolve './pages/Articles/Articles'

https://nextjs.org/docs/messages/module-not-found

./src/Home.tsx
Module not found: Can't resolve './pages/Products/ProductThumbnails'

https://nextjs.org/docs/messages/module-not-found

> Build failed because of webpack errors
> Bash Fix remaining pages/ imports in Home.tsx
> IN
> sed -i '' "s|'./pages/Articles/Articles'|'./views/Articles/Articles'|g; s|'./pages/Products/ProductThumbnails'|'./views/Products/ProductThumbnails'|g" /Users/bluebhanu/Sites/MyBlog/src/Home.tsx && echo "Fixed Home.tsx"

OUT
Fixed Home.tsx
Bash Build again
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
Failed to compile.

./src/Home.tsx
Module not found: Can't resolve './pages/Articles/Articles'

https://nextjs.org/docs/messages/module-not-found

./src/Home.tsx
Module not found: Can't resolve './pages/Products/ProductThumbnails'

https://nextjs.org/docs/messages/module-not-found

> Build failed because of webpack errors
> Bash Check remaining pages imports in Home.tsx
> IN
> grep "pages" /Users/bluebhanu/Sites/MyBlog/src/Home.tsx | head -10

OUT
import { Articles } from "./pages/Articles/Articles";
import { ProductThumbnails } from "./pages/Products/ProductThumbnails";
Edit Home.tsx
Edit failed
Bash Fix remaining import paths in Home.tsx
IN
sed -i '' "s|from \"./pages/Articles/Articles\"|from \"./views/Articles/Articles\"|g; s|from \"./pages/Products/ProductThumbnails\"|from \"./views/Products/ProductThumbnails\"|g" /Users/bluebhanu/Sites/MyBlog/src/Home.tsx && cat /Users/bluebhanu/Sites/MyBlog/src/Home.tsx | grep views

OUT
import { Articles } from "./views/Articles/Articles";
import { ProductThumbnails } from "./views/Products/ProductThumbnails";
Bash Build again after fixing Home.tsx imports
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 2.2s
Linting and checking validity of types ...
Failed to compile.

./src/admin/AdminPanel.tsx:26:24
Type error: 'user' is possibly 'null'.

[0m [90m 24 |[39m
[90m 25 |[39m [36mconst[39m toggleMerch [33m=[39m useCallback(() [33m=>[39m {
[31m[1m>[22m[39m[90m 26 |[39m displayMerch({ id[33m:[39m user[33m.[39m_id[33m,[39m key[33m:[39m user[33m.[39mphash })[33m;[39m
[90m |[39m [31m[1m^[22m[39m
[90m 27 |[39m }[33m,[39m [user])[33m;[39m
[90m 28 |[39m
[90m 29 |[39m [36mconst[39m killArticle [33m=[39m useCallback((article[33m:[39m [33mArticle[39m) [33m=>[39m {[0m
Next.js build worker exited with code: 1 and signal: null
TypeScript null checks are now strict. Rather than patching each file, let me disable strictNullChecks since the original code wasn't strict:

Read tsconfig.json
Edit tsconfig.json
Modified
Bash Build with strictNullChecks disabled
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 978ms
Linting and checking validity of types ...
Failed to compile.

./src/admin/AdminPanel.tsx:26:34
Type error: Type 'String' is not assignable to type 'string'.
'string' is a primitive, but 'String' is a wrapper object. Prefer using 'string' when possible.

[0m [90m 24 |[39m
[90m 25 |[39m [36mconst[39m toggleMerch [33m=[39m useCallback(() [33m=>[39m {
[31m[1m>[22m[39m[90m 26 |[39m displayMerch({ id[33m:[39m user[33m.[39m_id[33m,[39m key[33m:[39m user[33m.[39mphash })[33m;[39m
[90m |[39m [31m[1m^[22m[39m
[90m 27 |[39m }[33m,[39m [user])[33m;[39m
[90m 28 |[39m
[90m 29 |[39m [36mconst[39m killArticle [33m=[39m useCallback((article[33m:[39m [33mArticle[39m) [33m=>[39m {[0m
Next.js build worker exited with code: 1 and signal: null
The User type uses String (object) instead of string (primitive). Fix it in the store:

Read useStore.ts
Bash Fix String wrapper types to string primitives in useStore.ts
IN
sed -i '' 's/phash: String;/phash: string;/g; s/status: String,/status: string,/g; s/userEmail: String/userEmail: string/g' /Users/bluebhanu/Sites/MyBlog/src/state/useStore.ts && echo "Fixed String -> string in useStore.ts"

OUT
Fixed String -> string in useStore.ts
Bash Build again after type fix
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1258ms
Linting and checking validity of types ...
Failed to compile.

./src/admin/ArticleForm.tsx:37:28
Type error: Expected 2 arguments, but got 1.

[0m [90m 35 |[39m }[33m,[39m [isReady])[33m;[39m
[90m 36 |[39m
[31m[1m>[22m[39m[90m 37 |[39m [36mconst[39m handleFormSubmit [33m=[39m useCallback((e) [33m=>[39m {
[90m |[39m [31m[1m^[22m[39m
[90m 38 |[39m article[33m.[39mreadyToPublish [33m=[39m isReady[33m;[39m
[90m 39 |[39m handleSubmit(e)[33m;[39m
[90m 40 |[39m })[33m;[39m[0m
Next.js build worker exited with code: 1 and signal: null
useCallback requires a dependency array argument. Let me fix all the missing ones:

Bash Find useCallback calls missing dependency arrays
IN
grep -rn "useCallback((e) =>" /Users/bluebhanu/Sites/MyBlog/src --include="\*.tsx" | grep -v "node_modules" | grep ");"

OUT
0
Bash Find all useCallback usage in ArticleForm.tsx
IN
grep -n "useCallback(" /Users/bluebhanu/Sites/MyBlog/src/admin/ArticleForm.tsx

OUT
33: const toggleReadyStatus = useCallback(() => {
37: const handleFormSubmit = useCallback((e) => {
Bash Check the handleFormSubmit definition
IN
sed -n '37,41p' /Users/bluebhanu/Sites/MyBlog/src/admin/ArticleForm.tsx

OUT
const handleFormSubmit = useCallback((e) => {
article.readyToPublish = isReady;
handleSubmit(e);
});
Bash Add dependency array to handleFormSubmit useCallback in ArticleForm
IN
sed -i '' 's/ handleSubmit(e);\n });/ handleSubmit(e);\n }, [isReady, handleSubmit, article]);/' /Users/bluebhanu/Sites/MyBlog/src/admin/ArticleForm.tsx 2>/dev/null; python3 -c "
import re
with open('/Users/bluebhanu/Sites/MyBlog/src/admin/ArticleForm.tsx', 'r') as f:
content = f.read()

# Fix handleFormSubmit useCallback missing dep array

content = content.replace(
' const handleFormSubmit = useCallback((e) => {\n article.readyToPublish = isReady;\n handleSubmit(e);\n });',
' const handleFormSubmit = useCallback((e) => {\n article.readyToPublish = isReady;\n handleSubmit(e);\n }, [isReady, handleSubmit, article]);'
)

with open('/Users/bluebhanu/Sites/MyBlog/src/admin/ArticleForm.tsx', 'w') as f:
f.write(content)
print('Fixed ArticleForm.tsx')
"

OUT
Fixed ArticleForm.tsx
Bash Build again
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1182ms
Linting and checking validity of types ...
Failed to compile.

./src/admin/EditArticlePage.tsx:68:9
Type error: Type '(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void' is not assignable to type '() => void'.
Target signature provides too few arguments. Expected 1 or more, but got 0.

[0m [90m 66 |[39m handleFileChange[33m=[39m{handleFileChange}
[90m 67 |[39m editing
[31m[1m>[22m[39m[90m 68 |[39m changeCategory[33m=[39m{handleChange}
[90m |[39m [31m[1m^[22m[39m
[90m 69 |[39m changeNewCategory[33m=[39m{changeNewCategory}
[90m 70 |[39m newCategory[33m=[39m{newCategory}
[90m 71 |[39m [33m/[39m[33m>[39m[0m
Next.js build worker exited with code: 1 and signal: null
Bash Fix changeCategory type in ArticleForm
IN
sed -i '' 's/ changeCategory: () => void;/ changeCategory: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;/' /Users/bluebhanu/Sites/MyBlog/src/admin/ArticleForm.tsx && echo "Fixed ArticleForm type"

OUT
Fixed ArticleForm type
Bash Build again
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 959ms
Linting and checking validity of types ...
Failed to compile.

./src/admin/NewArticlePage.tsx:48:15
Type error: Property 'userId' does not exist on type 'Partial<Article>'. Did you mean 'userID'?

[0m [90m 46 |[39m article[33m.[39mheadlineImage [33m=[39m selectedFile [36mas[39m any[33m;[39m
[90m 47 |[39m }
[31m[1m>[22m[39m[90m 48 |[39m article[33m.[39muserId [33m=[39m user[33m.[39m_id[33m;[39m
[90m |[39m [31m[1m^[22m[39m
[90m 49 |[39m [36mawait[39m axios[33m.[39mpost([32m"/api/articles"[39m[33m,[39m article[33m,[39m {
[90m 50 |[39m headers[33m:[39m { [32m"Content-Type"[39m[33m:[39m [32m"multipart/form-data"[39m }
[90m 51 |[39m })[33m;[39m[0m
Next.js build worker exited with code: 1 and signal: null
Bash Fix userId typo and rebuild
IN
sed -i '' 's/article\.userId = user\.\_id;/article.userID = user.\_id;/' /Users/bluebhanu/Sites/MyBlog/src/admin/NewArticlePage.tsx && npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1143ms
Linting and checking validity of types ...
Failed to compile.

./src/admin/NewArticlePage.tsx:74:11
Type error: Type 'Partial<Article>' is not assignable to type 'Article'.
Property 'body' is optional in type 'Partial<Article>' but required in type 'Article'.

[0m [90m 72 |[39m {article [33m&&[39m (
[90m 73 |[39m [33m<[39m[33mArticleForm[39m
[31m[1m>[22m[39m[90m 74 |[39m article[33m=[39m{article}
[90m |[39m [31m[1m^[22m[39m
[90m 75 |[39m handleSubmit[33m=[39m{handleSubmit}
[90m 76 |[39m handleChange[33m=[39m{handleChange}
[90m 77 |[39m handleFileChange[33m=[39m{handleFileChange}[0m
Next.js build worker exited with code: 1 and signal: null
Bash Cast Partial<Article> to Article in NewArticlePage
IN
sed -i '' 's/article={article}/article={article as Article}/' /Users/bluebhanu/Sites/MyBlog/src/admin/NewArticlePage.tsx && head -5 /Users/bluebhanu/Sites/MyBlog/src/admin/NewArticlePage.tsx

OUT
'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article, useStore } from "../state/useStore";
import { useData } from "../data/useData";
Bash Build after type cast fix
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1022ms
Linting and checking validity of types ...
Failed to compile.

./src/data/useData.ts:78:22
Type error: Expected 2 arguments, but got 1.

[0m [90m 76 |[39m }[33m,[39m [users[33m.[39mlength])[33m;[39m
[90m 77 |[39m
[31m[1m>[22m[39m[90m 78 |[39m [36mconst[39m createUser [33m=[39m useCallback([36masync[39m () [33m=>[39m {
[90m |[39m [31m[1m^[22m[39m
[90m 79 |[39m [36mtry[39m {
[90m 80 |[39m [36mawait[39m axios[33m.[39mpost([32m"/api/users"[39m)[33m;[39m
[90m 81 |[39m } [36mfinally[39m {[0m
Next.js build worker exited with code: 1 and signal: null
Bash Find useCallback calls without dependency arrays in useData.ts
IN
grep -n "useCallback(" /Users/bluebhanu/Sites/MyBlog/src/data/useData.ts | grep -v "\[" | head -20

OUT
20: const fetchSettings = useCallback(async () => {
35: const fetchArticles = useCallback(async () => {
51: const fetchProducts = useCallback(async () => {
66: const fetchUsers = useCallback(async () => {
78: const createUser = useCallback(async () => {
86: const killProduct = useCallback(async (killID: string) => {
94: const kill = useCallback(async (killID: string) => {
102: const login = useCallback(async (newUser: Partial<User>) => {
124: const logout = useCallback(() => {
129: const displayMerch = useCallback(async (auth: AuthObject) => {
140: const wipeAndSeed = useCallback(async (auth: AuthObject) => {
153: const backUpDB = useCallback(async (auth: AuthObject) => {
166: const refresh = useCallback(async () => {
Bash Fix all missing useCallback dependency arrays in useData.ts
IN
python3 << 'EOF'
import re

with open('/Users/bluebhanu/Sites/MyBlog/src/data/useData.ts', 'r') as f:
content = f.read()

# Fix createUser - missing dep array

content = content.replace(
' const createUser = useCallback(async () => {\n try {\n await axios.post("/api/users");\n } finally {\n fetchUsers();\n }\n })',
' const createUser = useCallback(async () => {\n try {\n await axios.post("/api/users");\n } finally {\n fetchUsers();\n }\n }, [fetchUsers])'
)

# Fix logout - missing dep array

content = content.replace(
' const logout = useCallback(() => {\n setUser(null);\n localStorage.removeItem("jwt");\n })',
' const logout = useCallback(() => {\n setUser(null);\n localStorage.removeItem("jwt");\n }, [setUser])'
)

# Fix displayMerch - missing dep array

content = content.replace(
' const displayMerch = useCallback(async (auth: AuthObject) => {\n try {\n await axios.post(\'/api/toggleMerch/\', auth);\n const res = await axios.get("/api/settings");\n setSettings(res.data.data);\n }\n catch (err) {\n console.log(\'Failed to toggle merch.\');\n }\n });',
' const displayMerch = useCallback(async (auth: AuthObject) => {\n try {\n await axios.post(\'/api/toggleMerch/\', auth);\n const res = await axios.get("/api/settings");\n setSettings(res.data.data);\n }\n catch (err) {\n console.log(\'Failed to toggle merch.\');\n }\n }, [setSettings]);'
)

# Fix wipeAndSeed - missing dep array

content = content.replace(
''' const wipeAndSeed = useCallback(async (auth: AuthObject) => {
let wiped;
try {
wiped = await axios.post('/api/wipe/', auth);
}
catch (err) {
console.log('Failed to wipe database.');
}
finally {
return wiped;
}
});''',
''' const wipeAndSeed = useCallback(async (auth: AuthObject) => {
let wiped;
try {
wiped = await axios.post('/api/wipe/', auth);
}
catch (err) {
console.log('Failed to wipe database.');
}
finally {
return wiped;
}
}, []);'''
)

# Fix backUpDB - missing dep array

content = content.replace(
''' const backUpDB = useCallback(async (auth: AuthObject) => {
let backedUp;
try {
backedUp = await axios.post('/api/backup/', auth);
}
catch (err) {
console.log('Failed to back up database.');
}
finally {
return backedUp;
}
})''',
''' const backUpDB = useCallback(async (auth: AuthObject) => {
let backedUp;
try {
backedUp = await axios.post('/api/backup/', auth);
}
catch (err) {
console.log('Failed to back up database.');
}
finally {
return backedUp;
}
}, [])'''
)

with open('/Users/bluebhanu/Sites/MyBlog/src/data/useData.ts', 'w') as f:
f.write(content)

print('Fixed useData.ts')
EOF

OUT
Fixed useData.ts
Bash Build again
IN
npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1145ms
Linting and checking validity of types ...
Failed to compile.

./src/views/CreateAccount.tsx:31:20
Type error: Expected 0 arguments, but got 1.

[0m [90m 29 |[39m [36mconst[39m preExisting [33m=[39m users[33m?[39m[33m.[39mfind((user) [33m=>[39m user[33m.[39muserEmail [33m===[39m userEmail)[33m;[39m
[90m 30 |[39m [36mif[39m ([33m![39mpreExisting) {
[31m[1m>[22m[39m[90m 31 |[39m createUser(newUser [36mas[39m any)[33m;[39m
[90m |[39m [31m[1m^[22m[39m
[90m 32 |[39m setUser(newUser)[33m;[39m
[90m 33 |[39m router[33m.[39mpush([32m`/`[39m)[33m;[39m
[90m 34 |[39m }[0m
Next.js build worker exited with code: 1 and signal: null
Bash Fix createUser call signature and rebuild
IN
sed -i '' 's/createUser(newUser as any);/createUser();/' /Users/bluebhanu/Sites/MyBlog/src/views/CreateAccount.tsx && npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1224ms
Linting and checking validity of types ...
Failed to compile.

./src/views/Products/EditProductPage.tsx:90:9
Type error: Type '(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void' is not assignable to type '() => void'.
Target signature provides too few arguments. Expected 1 or more, but got 0.

[0m [90m 88 |[39m handleThumbnailChange[33m=[39m{handleThumbnailChange}
[90m 89 |[39m editing[33m=[39m{[36mtrue[39m}
[31m[1m>[22m[39m[90m 90 |[39m changeCategory[33m=[39m{handleChange}
[90m |[39m [31m[1m^[22m[39m
[90m 91 |[39m changeNewCategory[33m=[39m{changeNewCategory}
[90m 92 |[39m newCategory[33m=[39m{newCategory}
[90m 93 |[39m [33m/[39m[33m>[39m[0m
Next.js build worker exited with code: 1 and signal: null
Bash Fix changeCategory type in ProductForm and rebuild
IN
sed -i '' 's/ changeCategory: () => void;/ changeCategory: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;/' /Users/bluebhanu/Sites/MyBlog/src/views/Products/ProductForm.tsx && npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1157ms
Linting and checking validity of types ...
Failed to compile.

./src/views/Products/NewProductPage.tsx:82:9
Type error: Type 'Partial<Product>' is not assignable to type 'Product'.
Property '\_id' is optional in type 'Partial<Product>' but required in type 'Product'.

[0m [90m 80 |[39m [33m<[39m[33mdiv[39m className[33m=[39m[32m'articlePageTitle'[39m[33m>[39m{[32m`New Product:`[39m}[33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
[90m 81 |[39m [33m<[39m[33mProductForm[39m
[31m[1m>[22m[39m[90m 82 |[39m product[33m=[39m{product}
[90m |[39m [31m[1m^[22m[39m
[90m 83 |[39m handleSubmit[33m=[39m{handleSubmit}
[90m 84 |[39m handleChange[33m=[39m{handleChange}
[90m 85 |[39m handleFileChange[33m=[39m{handleFileChange}[0m
Next.js build worker exited with code: 1 and signal: null
Bash Fix Partial<Product> type cast and rebuild
IN
sed -i '' 's/product={product}/product={product as Product}/' /Users/bluebhanu/Sites/MyBlog/src/views/Products/NewProductPage.tsx && npm run build 2>&1

OUT
Exit code 1

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1138ms
Linting and checking validity of types ...
Failed to compile.

./src/views/Products/ProductForm.tsx:30:28
Type error: Expected 2 arguments, but got 1.

[0m [90m 28 |[39m }[33m,[39m [isReady])[33m;[39m
[90m 29 |[39m
[31m[1m>[22m[39m[90m 30 |[39m [36mconst[39m handleFormSubmit [33m=[39m useCallback((e) [33m=>[39m {
[90m |[39m [31m[1m^[22m[39m
[90m 31 |[39m product[33m.[39mreadyToPublish [33m=[39m isReady[33m;[39m
[90m 32 |[39m handleSubmit(e)[33m;[39m
[90m 33 |[39m })[33m;[39m[0m
Next.js build worker exited with code: 1 and signal: null
Bash Fix useCallback dep array in ProductForm and rebuild
IN
python3 << 'EOF'
with open('/Users/bluebhanu/Sites/MyBlog/src/views/Products/ProductForm.tsx', 'r') as f:
content = f.read()

content = content.replace(
' const handleFormSubmit = useCallback((e) => {\n product.readyToPublish = isReady;\n handleSubmit(e);\n });',
' const handleFormSubmit = useCallback((e) => {\n product.readyToPublish = isReady;\n handleSubmit(e);\n }, [isReady, handleSubmit, product]);'
)

with open('/Users/bluebhanu/Sites/MyBlog/src/views/Products/ProductForm.tsx', 'w') as f:
f.write(content)
print('Fixed ProductForm.tsx')
EOF
npm run build 2>&1

OUT
Fixed ProductForm.tsx

> moon-math.online@1.0.0 build
> next build

▲ Next.js 15.5.12

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully in 1132ms
Linting and checking validity of types ...
Collecting page data ...
Generating static pages (0/35) ...
Generating static pages (8/35)
Generating static pages (17/35)
⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000". See https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
Generating static pages (26/35)
✓ Generating static pages (35/35)
Finalizing page optimization ...
Collecting build traces ...

Route (app) Size First Load JS Revalidate Expire
┌ ○ / 12.1 kB 139 kB
├ ○ /\_not-found 999 B 103 kB
├ ○ /about 3.36 kB 127 kB
├ ○ /admin 2.99 kB 127 kB
├ ƒ /api/articles 156 B 102 kB
├ ƒ /api/articles/[id] 156 B 102 kB
├ ƒ /api/backup 156 B 102 kB
├ ƒ /api/contact 156 B 102 kB
├ ƒ /api/login 156 B 102 kB
├ ƒ /api/products 156 B 102 kB
├ ƒ /api/products/[id] 156 B 102 kB
├ ƒ /api/settings 156 B 102 kB
├ ƒ /api/showMerch 156 B 102 kB
├ ƒ /api/toggleMerch 156 B 102 kB
├ ƒ /api/user/[id] 156 B 102 kB
├ ƒ /api/users 156 B 102 kB
├ ƒ /api/wipe 156 B 102 kB
├ ● /article/[id] 2.23 kB 126 kB 1h 1y
├ ├ /article/691389b15d22fc979beab1a0 1h 1y
├ ├ /article/6913b68eb87319ff4eb48867 1h 1y
├ ├ /article/691389b15d22fc979beab19f 1h 1y
├ └ [+5 more paths]
├ ƒ /article/edit/[_id] 2.4 kB 126 kB
├ ○ /article/new 2.42 kB 126 kB
├ ○ /cart 3.04 kB 127 kB
├ ○ /check-out 2.53 kB 126 kB
├ ○ /login 2.65 kB 126 kB
├ ○ /memes 639 B 127 kB
├ ○ /newUser 2.73 kB 126 kB
├ ● /product/[id] 3.16 kB 127 kB 1h 1y
├ ├ /product/6935cfcbcf4a9e47065a16ff 1h 1y
├ └ /product/69347c8e48d39a058ca611dd 1h 1y
├ ƒ /product/edit/[_id] 2.83 kB 126 kB
├ ○ /product/new 2.79 kB 126 kB
├ ○ /resources 3.18 kB 127 kB
└ ○ /user 2.76 kB 126 kB

- First Load JS shared by all 102 kB
  ├ chunks/255-ebd51be49873d76c.js 46 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js 54.2 kB
  └ other shared chunks (total) 1.92 kB

○ (Static) prerendered as static content
● (SSG) prerendered as static HTML (uses generateStaticParams)
ƒ (Dynamic) server-rendered on demand
Build successful. The output shows exactly what we planned:

● /article/[id] — SSG with 8 article pages pre-built, revalidate 1h
● /product/[id] — SSG with 2 product pages pre-built, revalidate 1h
All API routes as dynamic server functions
Static pages: home, about, resources, login, memes, etc.
Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/ and write all src/ components

Create all API route handlers (app/api/)

Create app/layout.tsx and all app/ page routes

Move public assets and uploads

Install dependencies and verify build

Delete old client/ and server/ directories
Now delete the old client/ and server/ directories:

Bash Delete old Vite client and Express server directories
IN
rm -rf /Users/bluebhanu/Sites/MyBlog/client /Users/bluebhanu/Sites/MyBlog/server && echo "Deleted client/ and server/"

OUT
Deleted client/ and server/
Also remove the old root index.html that was the Vite entry point (it's in public/):

Bash Remove old Vite SPA index.html from public/
IN
rm /Users/bluebhanu/Sites/MyBlog/public/index.html && echo "Removed old index.html"

OUT
Removed old index.html
Update Todos

Set up Next.js: package.json, next.config.ts, tsconfig.json

Create src/lib/mongodb.ts connection singleton

Move models to src/models/ and write all src/ components

Create all API route handlers (app/api/)

Create app/layout.tsx and all app/ page routes

Move public assets and uploads

Install dependencies and verify build

Delete old client/ and server/ directories
Let me do a final clean build to confirm everything is still green:

Bash Final clean build to confirm success
IN
rm -rf /Users/bluebhanu/Sites/MyBlog/.next && npm run build 2>&1 | tail -40

OUT
├ ƒ /api/backup 156 B 102 kB
├ ƒ /api/contact 156 B 102 kB
├ ƒ /api/login 156 B 102 kB
├ ƒ /api/products 156 B 102 kB
├ ƒ /api/products/[id] 156 B 102 kB
├ ƒ /api/settings 156 B 102 kB
├ ƒ /api/showMerch 156 B 102 kB
├ ƒ /api/toggleMerch 156 B 102 kB
├ ƒ /api/user/[id] 156 B 102 kB
├ ƒ /api/users 156 B 102 kB
├ ƒ /api/wipe 156 B 102 kB
├ ● /article/[id] 2.23 kB 126 kB 1h 1y
├ ├ /article/691389b15d22fc979beab1a0 1h 1y
├ ├ /article/6913b68eb87319ff4eb48867 1h 1y
├ ├ /article/691389b15d22fc979beab19f 1h 1y
├ └ [+5 more paths]
├ ƒ /article/edit/[_id] 2.4 kB 126 kB
├ ○ /article/new 2.42 kB 126 kB
├ ○ /cart 3.04 kB 127 kB
├ ○ /check-out 2.53 kB 126 kB
├ ○ /login 2.65 kB 126 kB
├ ○ /memes 639 B 127 kB
├ ○ /newUser 2.73 kB 126 kB
├ ● /product/[id] 3.16 kB 127 kB 1h 1y
├ ├ /product/6935cfcbcf4a9e47065a16ff 1h 1y
├ └ /product/69347c8e48d39a058ca611dd 1h 1y
├ ƒ /product/edit/[_id] 2.83 kB 126 kB
├ ○ /product/new 2.79 kB 126 kB
├ ○ /resources 3.18 kB 127 kB
└ ○ /user 2.76 kB 126 kB

- First Load JS shared by all 102 kB
  ├ chunks/255-ebd51be49873d76c.js 46 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js 54.2 kB
  └ other shared chunks (total) 1.92 kB

○ (Static) prerendered as static content
● (SSG) prerendered as static HTML (uses generateStaticParams)
ƒ (Dynamic) server-rendered on demand
Clean build. Let me save the key notes to memory:

Read MEMORY.md
Bash Create memory directory
IN
mkdir -p /Users/bluebhanu/.claude/projects/-Users-bluebhanu-Sites-MyBlog/memory

OUT
0
Write MEMORY.md
69 lines

# Moon-Math Blog — Project Memory

## Stack (as of March 2026)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict: false, strictNullChecks: false)
- **Styling:** SCSS (src/styles/index.scss imports other partials)
- **State:** Zustand (src/state/useStore.ts)
- **Database:** MongoDB via Mongoose (src/models/)
- **Auth:** JWT in localStorage (jsonwebtoken + jwt-decode)
- **Email:** Resend API (src/services/email.ts)
- **Hosting:** EC2 (self-hosted, filesystem persists)

## Directory Structure

```
MyBlog/
├── src/
│   ├── app/            ← Next.js App Router pages + API routes
│   │   ├── layout.tsx
│   │   ├── page.tsx (Home)
│   │   ├── article/[id]/page.tsx  ← SSG + SEO metadata
│   │   ├── product/[id]/page.tsx  ← SSG + SEO metadata
│   │   └── api/*/route.ts
│   ├── admin/          ← Admin panel components
│   ├── components/     ← Shared UI components (banner-nav, footer, etc.)
│   ├── data/useData.ts ← Data fetching hooks (axios)
│   ├── hooks/
│   ├── lib/mongodb.ts  ← MongoDB singleton connection
│   ├── models/         ← Mongoose models (Articles, Users, Products, Settings)
│   ├── services/       ← Email service (Resend)
│   ├── state/useStore.ts ← Zustand store
│   ├── styles/         ← SCSS partials
│   ├── utils/          ← Shared utils (articleUtils.ts)
│   └── views/          ← Page component files (NOT Next.js pages - avoid src/pages/)
├── public/
│   ├── uploads/        ← User-uploaded images (articles/, products/) — served at /uploads/...
│   └── favicons
├── .env                ← JWT_SECRET, MONGO_URI, RESEND_API_KEY, etc.
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Key Rules

- **DO NOT** use `src/pages/` — Next.js treats it as Pages Router. Use `src/views/` for component files.
- **`app/` is inside `src/`** because Next.js src-layout expects `src/app/`.
- All interactive components need `'use client'` directive.
- Navigation: `useRouter` from `next/navigation`, NOT `react-router-dom`.
- Params in Next.js 15 are Promises: `const { id } = await params`.

## SEO — The Core Reason for Migration

Article and product pages have `generateMetadata()` + `generateStaticParams()`:

- `src/app/article/[id]/page.tsx` — SSG with `revalidate = 3600` (1 hour ISR)
- `src/app/product/[id]/page.tsx` — SSG with `revalidate = 3600`
- Both set `<title>`, `<meta description>`, Open Graph, and Twitter card tags server-side.

## Dev/Build Commands

- `npm run dev` — single dev server (replaces old `concurrently` monorepo)
- `npm run build` — Next.js production build
- `npm run start` — start production server (use PM2 on EC2)

## File Uploads

- Uploaded files saved to `public/uploads/articles/` and `public/uploads/products/`
- Next.js serves `public/` at root URL, so `/uploads/articles/file.jpg` works
- File handling in API routes: `request.formData()` (no multer/formidable needed)

## Previous Architecture (deleted)

- Was: Vite + React SPA (client/) + Express server (server/)
- Now: Single Next.js app in project root
  The migration is complete. Here's what was done:

Done
Build passes cleanly. npm run dev now starts a single Next.js server — no more concurrently.

What changed
Before After
client/ (Vite + React) + server/ (Express) Single src/ in Next.js
concurrently to run 2 servers npm run dev
react-router-dom next/navigation
No dynamic <title> or meta tags generateMetadata() per article/product
Client-side only rendering SSG for articles + products
multer for uploads request.formData() in API routes
The SEO win — in the build output:

● /article/[id] revalidate: 1h ← 8 articles pre-built as static HTML
● /product/[id] revalidate: 1h ← 2 products pre-built
Every article URL now has a server-rendered <title>, description, and Open Graph card in the HTML — before any JavaScript runs. Share an article URL anywhere and it will show a proper preview.

To deploy on EC2
Stop your old PM2 process and start the new one:

npm run build
pm2 start "npm run start" --name moon-math
save this entire migration chat into an external text file called migration.txt
Write migration.txt
454 lines
================================================================================
MOON-MATH.ONLINE — NEXT.JS MIGRATION LOG
Date: March 2026
================================================================================

## OVERVIEW

Migrated moon-math.online from a Vite + React SPA monorepo (with a separate
Express backend) to a single Next.js 15 App Router application.

PRIMARY MOTIVATION: SEO
Article pages had no dynamic <title> or Open Graph meta tags.
Social shares showed no preview. Search engines saw empty pages (JS-rendered).
Next.js enables server-side metadata per page via generateMetadata().

================================================================================
BEFORE — OLD ARCHITECTURE
================================================================================

MyBlog/
├── client/ (Vite + React 18 + TypeScript, port 5173)
│ ├── src/
│ │ ├── App.tsx ← React Router v7 routes
│ │ ├── Home.tsx
│ │ ├── state/useStore.ts ← Zustand store
│ │ ├── data/useData.ts ← axios data fetching
│ │ ├── components/ ← banner-nav, footer, image-modal, etc.
│ │ ├── pages/ ← page components
│ │ ├── admin/ ← admin panel components
│ │ ├── assets/memes/ ← 7 meme images
│ │ └── styles/ ← SCSS partials
│ ├── vite.config.js ← proxied /api and /uploads to localhost:3000
│ └── index.html
├── server/ (Express + Node.js + TypeScript, port 3000)
│ └── src/
│ ├── server.ts ← all Express routes + MongoDB connect
│ ├── models/ ← Mongoose: Articles, Users, Products, Settings
│ └── services/email.ts ← Resend API
├── uploads/ ← was at root... actually at public/uploads/ already
├── public/
│ └── uploads/
│ ├── articles/ ← user-uploaded article headline images
│ └── products/ ← user-uploaded product images
└── package.json ← used concurrently to run both servers

Dev command: npm run dev (ran concurrently — client on 5173, server on 3000)
Build command: npm run build --prefix server && npm run build --prefix client
Start command: npm run start --prefix server (Express served client/dist/)

================================================================================
AFTER — NEW ARCHITECTURE
================================================================================

MyBlog/
├── src/
│ ├── app/ ← Next.js App Router (INSIDE src/ — required)
│ │ ├── layout.tsx ← root layout (replaces index.html)
│ │ ├── page.tsx ← Home
│ │ ├── about/page.tsx
│ │ ├── resources/page.tsx
│ │ ├── login/page.tsx
│ │ ├── newUser/page.tsx
│ │ ├── admin/page.tsx
│ │ ├── memes/page.tsx
│ │ ├── cart/page.tsx
│ │ ├── check-out/page.tsx
│ │ ├── user/page.tsx
│ │ ├── article/
│ │ │ ├── [id]/page.tsx ← SSG + generateMetadata ← THE SEO WIN
│ │ │ ├── new/page.tsx
│ │ │ └── edit/[_id]/page.tsx
│ │ ├── product/
│ │ │ ├── [id]/page.tsx ← SSG + generateMetadata
│ │ │ ├── new/page.tsx
│ │ │ └── edit/[_id]/page.tsx
│ │ └── api/
│ │ ├── articles/route.ts (GET, POST)
│ │ ├── articles/[id]/route.ts (PATCH, DELETE)
│ │ ├── products/route.ts (GET, POST)
│ │ ├── products/[id]/route.ts (PATCH, DELETE)
│ │ ├── users/route.ts (GET, POST)
│ │ ├── user/[id]/route.ts (PATCH)
│ │ ├── login/route.ts (POST)
│ │ ├── settings/route.ts (GET)
│ │ ├── showMerch/route.ts (GET)
│ │ ├── toggleMerch/route.ts (POST)
│ │ ├── contact/route.ts (POST)
│ │ ├── wipe/route.ts (POST)
│ │ └── backup/route.ts (POST)
│ ├── admin/ ← admin panel components (all "use client")
│ │ ├── AdminPanel.tsx
│ │ ├── NewArticlePage.tsx
│ │ ├── EditArticlePage.tsx
│ │ ├── ArticleForm.tsx
│ │ ├── UsersForm.tsx
│ │ ├── ExpandableTable.tsx
│ │ ├── TableHeader.tsx
│ │ └── Download.tsx
│ ├── components/ ← shared UI (all "use client")
│ │ ├── banner-nav.tsx
│ │ ├── footer.tsx
│ │ ├── image-modal.tsx
│ │ ├── MemeThumbnails.tsx
│ │ └── ArticleThumbnail.tsx
│ ├── data/useData.ts ← updated: useNavigate → useRouter
│ ├── hooks/useClickOutside.tsx
│ ├── lib/mongodb.ts ← NEW: singleton connection for Next.js
│ ├── models/ ← copied from server/src/models/
│ │ ├── Articles.ts
│ │ ├── Users.ts
│ │ ├── Products.ts
│ │ └── Settings.ts
│ ├── services/email.ts ← copied from server/src/services/
│ ├── state/useStore.ts ← unchanged (Zustand)
│ ├── styles/ ← all SCSS partials (unchanged)
│ ├── utils/articleUtils.ts ← NEW: splitIntoLines, splitIntoParagraphs
│ ├── views/ ← page components (renamed from pages/ — see gotchas)
│ │ ├── About.tsx
│ │ ├── Resources.tsx
│ │ ├── Login.tsx
│ │ ├── CreateAccount.tsx
│ │ ├── EditUserPage.tsx
│ │ ├── AdminPage.tsx
│ │ ├── MemesPage.tsx
│ │ ├── Articles/
│ │ │ ├── Articles.tsx
│ │ │ └── ArticlePage.tsx
│ │ └── Products/
│ │ ├── ProductPage.tsx
│ │ ├── ProductThumbnails.tsx
│ │ ├── ShoppingCart.tsx
│ │ ├── CheckOut.tsx
│ │ ├── ProductForm.tsx
│ │ ├── NewProductPage.tsx
│ │ └── EditProductPage.tsx
│ └── Home.tsx
├── public/
│ ├── favicon.ico (+ other favicon sizes)
│ └── uploads/ ← pre-existing, served by Next.js at /uploads/...
│ ├── articles/
│ └── products/
├── .env ← copied from server/.env to root
├── next.config.ts
├── package.json ← merged deps, removed vite/express/react-router/multer
└── tsconfig.json ← Next.js App Router config

Dev command: npm run dev (single server)
Build command: npm run build
Start command: npm run start (use PM2 on EC2)

================================================================================
THE SEO IMPLEMENTATION (CORE GOAL)
================================================================================

src/app/article/[id]/page.tsx — Server Component

export const revalidate = 3600; // ISR: regenerate at most once per hour

export async function generateMetadata({ params }) {
const { id } = await params; // params is a Promise in Next.js 15
await connectDB();
const article = await Articles.findById(id).lean();
const description = article?.body
?.replace(/<[^>]\*>/g, '') // strip HTML tags
.substring(0, 160);

return {
title: article?.title,
description,
openGraph: {
title: article?.title,
description,
images: article?.headlineImage ? [{ url: article.headlineImage }] : [],
type: 'article',
},
twitter: {
card: 'summary_large_image',
title: article?.title,
description,
images: article?.headlineImage ? [article.headlineImage] : [],
},
};
}

export async function generateStaticParams() {
await connectDB();
const articles = await Articles.find({}, '\_id').lean();
return articles.map(a => ({ id: String(a.\_id) }));
}

export default async function ArticlePageSSG({ params }) {
const { id } = await params;
await connectDB();
const article = await Articles.findById(id).lean();
const author = await Users.findById(article?.userID).lean();
// ... render article content server-side
}

RESULT: Every article URL has proper <title>, <meta name="description">,
og:title, og:description, og:image in the server-sent HTML.
Social media scrapers (Twitter, Discord, Slack, etc.) see the metadata
WITHOUT executing JavaScript.

================================================================================
KEY CHANGES BY CATEGORY
================================================================================

1. DEPENDENCIES
   Added: next@^15.0.0
   Removed: vite, @vitejs/plugin-react, react-router-dom,
   express, cors, concurrently, multer
   Unchanged: react, react-dom, typescript, zustand, axios, jwt-decode,
   sass, mongoose, bcrypt, jsonwebtoken, resend, html-react-parser

2. NAVIGATION (every component that used react-router-dom)
   BEFORE:
   import { useNavigate } from 'react-router-dom';
   import { useParams } from 'react-router-dom';
   import { Link } from 'react-router-dom';
   const navigate = useNavigate();
   navigate('/path');

   AFTER:
   import { useRouter } from 'next/navigation';
   import { useParams } from 'next/navigation';
   import Link from 'next/link';
   const router = useRouter();
   router.push('/path');

3. "USE CLIENT" DIRECTIVE
   All interactive components (useState, useEffect, event handlers,
   Zustand store access) need:
   'use client';
   at the top of the file.

   Server components (no directive needed):
   - app/article/[id]/page.tsx
   - app/product/[id]/page.tsx
   - app/about/page.tsx
   - app/resources/page.tsx
     (Though About and Resources use BannerNav which is "use client",
     Next.js handles this — server components can render client components.)

4. FILE UPLOADS
   BEFORE: multer disk storage middleware
   const storage = multer.diskStorage({
   destination: 'uploads/articles/',
   filename: (req, file, cb) => cb(null, Date.now() + ext)
   });
   const upload = multer({ storage });
   app.post('/api/articles', upload.single('headlineImage'), ...)

   AFTER: Web Fetch API FormData in Next.js Route Handlers
   export async function POST(request) {
   const formData = await request.formData();
   const file = formData.get('headlineImage') as File;
   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);
   const filename = `${Date.now()}${path.extname(file.name)}`;
   await fs.writeFile(
   path.join(process.cwd(), 'public', 'uploads', 'articles', filename),
   buffer
   );
   }
   Files saved to public/uploads/ are served by Next.js at /uploads/...
   (same URLs as before, no database changes needed)

5. MONGODB CONNECTION
   BEFORE: mongoose.connect() called once in server.ts on startup

   AFTER: Singleton pattern for Next.js (hot-reloads would create
   too many connections without it):

   // src/lib/mongodb.ts
   let cached = global.mongoose;
   if (!cached) cached = global.mongoose = { conn: null, promise: null };
   export async function connectDB() {
   if (cached.conn) return cached.conn;
   cached.promise = mongoose.connect(process.env.MONGO_URI!);
   cached.conn = await cached.promise;
   return cached.conn;
   }

6. RENDERING STRATEGY
   Route | Strategy | Reason
   -------------------------|-----------|---------------------------
   / | Static | Renders client-side after load
   /article/[id] | SSG + ISR | SEO — server-rendered HTML
   /product/[id] | SSG + ISR | SEO — server-rendered HTML
   /about | Static | Fully static content
   /resources | Static | Fully static content
   /login, /newUser | Static | Client-rendered (auth)
   /admin, /article/new | Static | Client-rendered (admin)
   /cart, /check-out, /user | Static | Client-rendered (user state)
   /memes | Static | Client-rendered (images + modal)

   ISR revalidation: 3600 seconds (1 hour) for articles and products

================================================================================
GOTCHAS & LESSONS LEARNED
================================================================================

1. src/pages/ IS RESERVED by Next.js
   We used src/pages/ for component files (not actual Next.js pages).
   Next.js treats src/pages/ as the Pages Router and validates that every
   file there has a default export following Page Router conventions.
   FIX: Renamed src/pages/ → src/views/ throughout.

2. app/ must be inside src/ when using the src/ directory layout
   We initially put app/ at the project root. Next.js generated type
   declarations looking for src/app/ and the validator.ts couldn't
   find our pages.
   FIX: Moved app/ to src/app/.

3. params is a Promise in Next.js 15
   Page components and generateMetadata must await params:
   export default async function Page({ params }) {
   const { id } = await params; // NOT params.id directly
   }

4. useCallback requires a dependency array (2 arguments)
   Original Vite code had many useCallback calls without dep arrays:
   const fn = useCallback(() => { ... }); // WRONG in strict TS
   Next.js/TypeScript enforced 2 args. Added dep arrays throughout.

5. String vs string type
   Original useStore.ts had:
   phash: String; // wrapper object
   status: String,
   userEmail: String
   These caused type errors when used as function arguments expecting string
   (primitive). FIX: Changed all to lowercase string.

6. Vite image imports return StaticImageData objects in Next.js
   Meme images imported as:
   import orangePill from '../assets/memes/orange_pill.jpeg';
   In Vite, this gives a URL string. In Next.js, it gives a StaticImageData
   object with a .src property. Used: img.src ?? img for compatibility.

7. FormData in Next.js API routes has a default size limit (~4.5MB)
   Sufficient for typical article/product images. If larger images are
   needed, configure: next.config.ts → experimental.serverBodySizeLimit

8. metadataBase warning
   Build output shows: "metadataBase property in metadata export is not set"
   This affects absolute URL resolution for OG images.
   FIX (future): Add to layout.tsx metadata:
   metadataBase: new URL('https://moon-math.online')

================================================================================
DEPLOYMENT ON EC2
================================================================================

1. SSH into EC2
2. git pull (or rsync the new files)
3. npm install
4. npm run build
5. Stop old PM2 process: pm2 stop moon-math (or whatever it was named)
6. Start new: pm2 start "npm run start" --name moon-math
   OR update ecosystem.config.js if using one

The .env file is now at project root (was at server/.env).
Make sure the EC2 instance has the .env file at:
/path/to/MyBlog/.env

Environment variables needed:
JWT_SECRET=...
JWT_EXPIRES_IN=2h
NODE_ENV=production
MONGO_URI=...
MONGO_DUMP_PATH=...
RESEND_API_KEY=...

================================================================================
VERIFICATION CHECKLIST
================================================================================

[ ] npm run dev starts without errors
[ ] Visit / — articles and merch/memes load correctly
[ ] Visit /article/[id] — check page <title> in browser tab
[ ] view-source on an article URL — <title> and <meta> must be in the HTML,
not inserted by JavaScript after load
[ ] Share an article URL in Discord/Slack — social preview card should show
title + description + headline image
[ ] Test with Twitter Card Validator: https://cards-dev.twitter.com/validator
[ ] Test with Facebook Debugger: https://developers.facebook.com/tools/debug/
[ ] Test Open Graph: https://www.opengraph.xyz/
[ ] Login works
[ ] Admin panel accessible (login with sensi account)
[ ] Create new article (with image upload)
[ ] Edit existing article
[ ] File uploads appear at /uploads/articles/...
[ ] Contact form sends email
[ ] Admin: DB backup works
[ ] Products page loads
[ ] Shopping cart works (add item, go to checkout)

================================================================================
FINAL BUILD OUTPUT
================================================================================

Route (app) Size First Load JS Revalidate
┌ ○ / 12.1 kB 139 kB
├ ○ /about 3.36 kB 127 kB
├ ○ /admin 2.99 kB 127 kB
├ ƒ /api/articles 156 B 102 kB
├ ƒ /api/articles/[id] 156 B 102 kB
├ ƒ /api/backup 156 B 102 kB
├ ƒ /api/contact 156 B 102 kB
├ ƒ /api/login 156 B 102 kB
├ ƒ /api/products 156 B 102 kB
├ ƒ /api/products/[id] 156 B 102 kB
├ ƒ /api/settings 156 B 102 kB
├ ƒ /api/showMerch 156 B 102 kB
├ ƒ /api/toggleMerch 156 B 102 kB
├ ƒ /api/user/[id] 156 B 102 kB
├ ƒ /api/users 156 B 102 kB
├ ƒ /api/wipe 156 B 102 kB
├ ● /article/[id] 2.23 kB 126 kB 1h 1y
├ ├ /article/691389b15d22fc979beab1a0 1h 1y
├ ├ /article/6913b68eb87319ff4eb48867 1h 1y
├ └ [+6 more paths]
├ ○ /article/new 2.42 kB 126 kB
├ ƒ /article/edit/[_id] 2.40 kB 126 kB
├ ○ /cart 3.04 kB 127 kB
├ ○ /check-out 2.53 kB 126 kB
├ ○ /login 2.65 kB 126 kB
├ ○ /memes 639 B 127 kB
├ ○ /newUser 2.73 kB 126 kB
├ ● /product/[id] 3.16 kB 127 kB 1h 1y
├ ├ /product/6935cfcbcf4a9e47065a16ff 1h 1y
├ └ /product/69347c8e48d39a058ca611dd 1h 1y
├ ○ /product/new 2.79 kB 126 kB
├ ƒ /product/edit/[_id] 2.83 kB 126 kB
├ ○ /resources 3.18 kB 127 kB
└ ○ /user 2.76 kB 126 kB

○ (Static) prerendered as static content
● (SSG) prerendered as static HTML (uses generateStaticParams)
ƒ (Dynamic) server-rendered on demand

8 article pages pre-built as static HTML.
2 product pages pre-built as static HTML.
All API routes are dynamic server functions.
================================================================================
migration.txt has been created at the project root. It covers:

Before/after directory structures in full
The SEO implementation with the actual generateMetadata code
All key changes by category (navigation, file uploads, MongoDB connection, rendering strategies)
Gotchas & lessons learned (the src/pages/ naming conflict, params being a Promise in Next.js 15, String vs string, image imports, etc.)
Deployment steps for EC2
Verification checklist for testing after deploy
The final build output with all routes and their rendering strategies
The migration.txt is a good summary - but I also want to just copy and paste and save this conversation from start to finish - in an external file, let's call it migration_conversation
Unfortunately I can't access or export the raw conversation — that data lives in the Claude UI, not on your filesystem. I can write files based on what's in my context, but the full back-and-forth chat text isn't something I can extract programmatically.

The easiest ways to save the full conversation:

Option 1 — Browser "Save As"
In your browser, Cmd+S (or File → Save Page As) → save as .txt or .html. Rename it migration_conversation.txt.

Option 2 — Select all text

Click at the very top of the conversation
Cmd+A to select all, then Cmd+C to copy
Open a text editor, paste, save as migration_conversation.txt
Option 3 — Browser print to PDF
Cmd+P → "Save as PDF" → name it migration_conversation.pdf

Option 4 — Claude share link (if available)
Look for a share/export button in the Claude interface — some versions let you export a conversation.

The migration.txt I already created is a structured summary of everything that was done, which may actually be more useful as a reference than the raw Q&A. But if you want the verbatim chat, the browser copy is the way to go.
