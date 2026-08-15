## Knock Your Knowledge — MERN (frontend + API)

React (Vite) frontend + Express/MongoDB backend for **Get Started** contact leads.

### Prerequisites

- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas URI

### 1) Backend (API + MongoDB)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API runs on **http://localhost:5001**

Edit `backend/.env`:

- `MONGODB_URI` — e.g. `mongodb://127.0.0.1:27017/kyk` or your Atlas connection string
- `PORT` — `5001`
- `FRONTEND_URL` — `http://localhost:5173` (comma-separated for multiple origins)
- `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` — from [Cashfree Dashboard → Developers → API Keys](https://merchant.cashfree.com/merchants/login) (`CASHFREE_ENV=sandbox` for test, `production` for live)
- `CASHFREE_PUBLIC_KEY_PATH` — Cashfree 2FA public key `.pem` (Dashboard → Developers → Two-Factor Authentication → Public Key)

Health check: `http://localhost:5001/api/health` → `"db":"connected"`

Contact endpoints:

- `POST /api/contact` — save form (`email`, `phone`, `internshipInterest`)
- `GET /api/contact` — list submissions
- `GET /api/contact/options` — internship choices

Payment (Cashfree) endpoints:

- `GET /api/payments/config` — gateway status / mode
- `POST /api/payments/create-order` — create Cashfree order (UPI, debit card, credit card)
- `POST /api/payments/verify` — confirm order status after Checkout success

Checkout flow: cart → coupon (optional) → **Pay with Cashfree** (UPI / debit / credit) → server verifies order status → order saved in MongoDB.

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**

**Get Started** opens a contact form (email, phone, internship of the 4 programs). Submissions are stored in MongoDB.

Locally, Vite proxies `/api` → the Express server (no need to set `VITE_API_BASE_URL`).

### Demo accounts (browser localStorage)

| Role | Email | Password |
|------|-------|----------|
| Admin | `vinay@gmail.com` | `12345678` |
| Student | Sign up at `/login` | (any password) |

### Deploy

- **Frontend (Vercel):** Root Directory = `frontend`. Set `VITE_API_BASE_URL` to your live API URL **including `/api`**, then redeploy.
- **Backend (Railway / Render / etc.):** start from `backend/` with `npm start`. Set `MONGODB_URI`, `FRONTEND_URL`, `PORT`, `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV`.

### Project layout

- **`frontend/`** — Vite + React UI
- **`backend/`** — Express + MongoDB (contact leads + Cashfree payments)
