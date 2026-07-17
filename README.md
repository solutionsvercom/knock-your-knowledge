## Knock Your Knowledge — Frontend only

Clean React (Vite) website. **No backend / MongoDB required** — data and auth run in the browser via static demo data + `localStorage`.

### Prerequisites

- Node.js 18+

### Run locally

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `vinay@gmail.com` | `12345678` |
| Student | Sign up at `/login` | (any password) |

- **Public site:** Home, Internships, Internship Courses, Live Classes, About, Blog
- **Learner:** `/login` → Dashboard / enroll / learn (saved in your browser)
- **Admin:** `/admin/login` (not linked from the public nav)

### Deploy (e.g. Vercel)

Preferred: set the project **Root Directory** to **`frontend`**, then redeploy.  
If Root Directory stays the repo root, `vercel.json` at the root builds `frontend/` for you.  
`vite` and Tailwind are in **dependencies** so production installs include the build tools.

### Project layout

- **`frontend/`** — Vite + React UI (`src/`)
- Data: `src/data/courseCatalog.js` + `src/data/demoData.js`
- API layer: `src/api/apiClient.js` (local mock, no HTTP server)
