## Local MERN setup

**Production (e.g. [knockyourknowledge.com](https://www.knockyourknowledge.com/))**

- **Do not commit `dist`** — Vercel runs `npm run build`; `dist` stays gitignored.
- **SPA routes** — `vercel.json` rewrites to `index.html` for client-side routing.
- **API URL** — Set **`VITE_API_BASE_URL`** at **build time** (e.g. in Vercel **Environment Variables** for Production) to your Express URL **including `/api`**, then **Redeploy**. The browser calls the API host directly; your Express **`FRONTEND_URL`** / CORS must allow the site. **Never** use placeholder hostnames — the browser will show **`ERR_NAME_NOT_RESOLVED`**.
- **Express CORS** — On the **API** host, set **`FRONTEND_URL`** in **`server/.env`** to a **comma-separated** list that includes your site, e.g. `https://www.knockyourknowledge.com,https://knockyourknowledge.com` (and `http://localhost:5173` for local testing against prod API if needed).

This project is now a **MERN full-stack** app:

- **Frontend**: Vite + React (runs on `http://localhost:5173`); HTTP calls use **Axios** via `src/api/apiClient.js` (JSON + shared error handling).
- **Backend**: Express + MongoDB (runs on `http://localhost:5001`)

### Prerequisites

- Node.js 18+ (recommended)
- MongoDB running locally (or a MongoDB Atlas connection string)

### Configure environment

1. Create `server/.env` from the example:

```bash
cp server/.env.example server/.env
```

2. Edit `server/.env`:

- **MONGODB_URI**: e.g. `mongodb://127.0.0.1:27017/kyk`
- **JWT_SECRET**: any random string (required for stable logins; if it changes, existing tokens become invalid)
- **PORT**: `5001` (default in this project)
- **FRONTEND_URL**: e.g. `http://localhost:5173` for local only, or **comma-separated** with your production domain so CORS allows both

3. (Frontend) copy **`.env.example`** → **`.env`** for local overrides. For a production build locally, copy **`.env.production.example`** → **`.env.production`** and set **`VITE_API_BASE_URL`** to your live API URL (must end with **`/api`**).

### Install dependencies

```bash
npm install
npm --prefix server install
```

### Run locally (frontend + backend)

```bash
npm run dev
```

This runs **`npm run kill:api`** first (frees the port from **`server/.env`**, default 5001/5002) so a leftover Node process cannot block the API and make nodemon show **“app crashed”** / **Port already in use**. To free the port manually: `npm run kill:api`.

**API returns 500 on `/api/courses` etc.?** In a terminal run `curl http://localhost:5001/api/health` (use the same port as in the server log). You should see `"ok":true` and `"db":"connected"`. If not, start **MongoDB** locally or set **`MONGODB_URI`** in **`server/.env`**. The server loads **`server/.env`** automatically (even if you start Node from the repo root). Check the **terminal where the API runs** for `[API]` error logs.

### Login

Open `http://localhost:5173/login` and sign in (local dev).  
The app stores a JWT in `localStorage` and uses it for `/api/*` requests.

### Frontend API layer

- All HTTP calls go through **`src/api/apiClient.js`** (exported as `api`).
- Domain routes include: auth, users, courses, bundles, enrollments, payments, leads, course interests, doubt sessions, lessons, quizzes, resources, certificates, support tickets, notifications, live classes, internships, AI conversations, and local stubs under **`api.ai`** (LLM / upload / email via `server` routes).

### Auth API (backend)

- `POST /api/auth/signup` and `POST /api/auth/register` — same behavior; returns `{ token, user }`.
- `POST /api/auth/login` — returns `{ token, user }`.
- `GET /api/auth/me` — requires `Authorization: Bearer <token>`.

If login fails in the browser, confirm **`VITE_API_BASE_URL`** in the project root `.env` either is **unset** (dev uses Vite’s `/api` proxy) or points to your API **including `/api`** (e.g. `http://localhost:5001/api`).

## Production separation (frontend and backend)

Deploy frontend and backend as separate services:

- **Frontend (Vercel)**  
  Set **`VITE_API_BASE_URL`** in **Environment Variables** (Production) to your **actual** API URL (Railway **Deployments** tab shows it), e.g. `https://kyk-api-production-xxxx.up.railway.app/api`, then **Redeploy**.
- **Frontend (Netlify, etc.)**  
  Same: **`VITE_API_BASE_URL`** at build time, or your host’s env UI.

- **Backend service**
  - Install: `npm --prefix server install`
  - Start: `npm run start:server`
  - Required env (`server/.env`): `PORT`, `MONGODB_URI`, `JWT_SECRET`, **`FRONTEND_URL`** (comma-separated if you use multiple site origins)

## Admin seed

**Default test administrator** (used if you omit env vars): `vinay@gmail.com` / `12345678`.  
Run once so the user exists in MongoDB (uses **`server/.env`** for `MONGODB_URI` even when you run the command from the repo root):

```bash
npm --prefix server run seed:admin
```

If the script prints an error, check MongoDB is running and `MONGODB_URI` in **`server/.env`** is correct. You can run seed while `npm run dev` is running — that does not block the API.

If **admin login** returns “Internal Server Error”, confirm **`npm run dev`** shows `API listening on http://localhost:PORT` (not “Port … already in use”). Only one process should listen on that `PORT`. Vite’s proxy must target the same port (see **`vite.config.js`**, which reads `PORT` from **`server/.env`**).

Optional — override in `server/.env`:

- `ADMIN_EMAIL`
- `ADMIN_FULL_NAME`
- `ADMIN_PASSWORD`

Then run `npm --prefix server run seed:admin` again to update that account.

**Admin UI URL:** `http://localhost:5173/admin/login` (not linked from the public site).

**Admin course list** only shows what is stored in MongoDB (not the old static marketing catalog). To add several sample rows at once:

```bash
npm --prefix server run seed:courses
```

Titles starting with `Demo:` are skipped on later runs if they already exist.

