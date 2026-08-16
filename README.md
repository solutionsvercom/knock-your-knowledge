## Knock Your Knowledge

React (Vite) frontend is **built into** `./public` and served by Express. One Node app, one deploy. The layout matches Hostinger’s Node.js folder: `server.js` + `public/` at the app root.

Live site: **https://knockyourknowledge.com**

### Prerequisites

- Node.js 18+
- MongoDB Atlas (or local MongoDB)

### Local development

Terminal 1 — API:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API: **http://localhost:5001**

Terminal 2 — UI:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

UI: **http://localhost:5173** (Vite proxies `/api` to the backend)

Leave `VITE_API_BASE_URL` empty.

### Production build (same as Hostinger)

From the repo root:

```bash
npm run build
npm start
```

This installs frontend + backend, builds the React app into `./public` (`index.html` + `assets`), then starts Express. Open **http://localhost:5001**.

### Hostinger deploy (GitHub → live site)

Pushing to `main` on GitHub rebuilds and restarts the site when Hostinger is connected.

1. In hPanel go to **Websites** → **Add Website** (or open the existing site) → **Node.js web app**.
2. Choose **Import Git repository** → connect GitHub → select `knock-your-knowledge`.
3. Use these settings (same shape as a working Hostinger Node.js site):
   - **Node.js version:** 20 (or 18.x)
   - **Root directory:** `./`
   - **Package manager:** npm
   - **Build command:** `npm run build`
   - **Entry file:** `server.js`  ← must be this, not `backend/src/server.js`
   - **Output directory:** leave **empty** (do not set `dist` or `public` — Express serves `./public` itself)

After a successful build the live app folder looks like Hostinger’s classic `nodejs` layout:

```
nodejs/                  (repo root, or hbuilds/current/nodejs on GitHub deploys)
  server.js              ← entry file
  package.json
  public/
    index.html
    assets/
  backend/
  frontend/
```

`hbuilds`, `current`, and `versions` are Hostinger system folders. You cannot remove them on a GitHub-connected Node app. The files that must match the working site live **inside** `hbuilds/current/nodejs/` (that folder is this repo).
4. Add environment variables (do **not** put these in git):

| Variable | Value |
| --- | --- |
| `PORT` | leave to Hostinger, or the port they assign |
| `MONGODB_URI` | your Atlas URI |
| `FRONTEND_URL` | `https://knockyourknowledge.com,https://www.knockyourknowledge.com` |
| `CASHFREE_ENV` | `production` |
| `CASHFREE_APP_ID` | Payment Gateway App ID |
| `CASHFREE_SECRET_KEY` | Payment Gateway secret |
| `CASHFREE_PUBLIC_KEY` | paste the full PEM (or upload the `.pem` and set `CASHFREE_PUBLIC_KEY_PATH`) |
| `CASHFREE_RETURN_URL` | `https://knockyourknowledge.com/Checkout?order_id={order_id}` |
| `ADMIN_API_KEY` | same value as `VITE_ADMIN_API_KEY` used at build time if you set one |

5. Point the domain **knockyourknowledge.com** (and www) at this Node app. Enable HTTPS.
6. Click **Deploy**. Later, `git push` to `main` triggers a new build automatically.

### Cashfree live checkout

In [Cashfree → Developers → Whitelisting](https://merchant.cashfree.com/merchants/pg/developers/whitelisting) add:

- `https://knockyourknowledge.com`
- `https://www.knockyourknowledge.com`

Localhost cannot be used for live payments.

### Demo accounts (browser localStorage)

| Role | Email | Password |
|------|-------|----------|
| Admin | `vinay@gmail.com` | `12345678` |
| Student | Sign up at `/login` | (any password) |

### Project layout

- **`server.js`** — Hostinger entry file (starts Express)
- **`public/`** — Vite production build (`index.html` + `assets`); created by `npm run build`
- **`frontend/`** — Vite + React source
- **`backend/`** — Express + MongoDB; serves `/api` and `./public`
