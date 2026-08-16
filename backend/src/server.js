import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { connectDb } from "./config/db.js";
import { defaultAllowedOrigins } from "./config/site.js";
import contactRouter from "./routes/contact.js";
import paymentsRouter from "./routes/payments.js";
import adminRouter from "./routes/admin.js";
import couponsRouter from "./routes/coupons.js";
import ticketsRouter from "./routes/tickets.js";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(backendRoot, "..");

dotenv.config({ path: path.join(backendRoot, ".env") });
dotenv.config({ path: path.join(repoRoot, ".env") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const PORT = Number(process.env.PORT) || 5001;

function resolvePublicDir() {
  const candidates = [
    path.join(repoRoot, "public"),
    path.join(process.cwd(), "public"),
    path.join(backendRoot, "public"),
    path.join(backendRoot, "public/dist"),
    path.join(process.cwd(), "backend/public/dist"),
    path.join(process.cwd(), "public/dist"),
    path.join(process.cwd(), "dist"),
  ];
  return (
    candidates.find((dir) => fs.existsSync(path.join(dir, "index.html"))) ||
    path.join(repoRoot, "public")
  );
}

const publicDir = resolvePublicDir();

app.set("trust proxy", 1);

const allowedOrigins = String(
  process.env.FRONTEND_URL || defaultAllowedOrigins().join(",")
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const db =
    dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";
  res.json({ ok: true, db, service: "kyk-api", publicDir });
});

app.use("/api/contact", contactRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/admin", adminRouter);

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  const indexFile = path.join(publicDir, "index.html");
  if (!fs.existsSync(indexFile)) {
    return res.status(503).json({
      message: "Frontend is not built yet. Run npm run build from the repo root.",
    });
  }
  res.sendFile(indexFile);
});

app.use((err, _req, res, _next) => {
  console.error("[API]", err?.message || err);
  res.status(500).json({ message: err?.message || "Server error" });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await connectDb(process.env.MONGODB_URI);
    } catch (err) {
      console.error("[API] MongoDB connection failed:", err.message);
    }
  } else {
    console.warn("[API] MONGODB_URI is not set; API routes that need the database will fail.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[API] listening on http://0.0.0.0:${PORT}`);
    console.log(`[API] serving frontend from ${publicDir}`);
  });
}

start();
