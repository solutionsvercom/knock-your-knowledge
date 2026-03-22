import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDb } from "./lib/db.js";
import { mapDbError } from "./lib/mapError.js";
import { authMiddleware } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import integrationsRoutes from "./routes/integrations.js";
import appLogsRoutes from "./routes/app-logs.js";
import usersRoutes from "./routes/users.js";
import coursesRoutes from "./routes/courses.js";
import bundlesRoutes from "./routes/bundles.js";
import enrollmentsRoutes from "./routes/enrollments.js";
import paymentsRoutes from "./routes/payments.js";
import supportTicketsRoutes from "./routes/supportTickets.js";
import notificationsRoutes from "./routes/notifications.js";
import liveClassesRoutes from "./routes/liveClasses.js";
import internshipsRoutes from "./routes/internships.js";
import aiConversationsRoutes from "./routes/aiConversations.js";
import leadsRoutes from "./routes/leads.js";
import courseInterestsRoutes from "./routes/courseInterests.js";
import doubtSessionsRoutes from "./routes/doubtSessions.js";
import lessonsRoutes from "./routes/lessons.js";
import quizzesRoutes from "./routes/quizzes.js";
import resourcesRoutes from "./routes/resources.js";
import certificatesRoutes from "./routes/certificates.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Always load backend/.env even if the process was started from the repo root */
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/** Match backend/.env.example and frontend/src/utils/apiBase.js */
const PORT = Number(process.env.PORT || 5001);
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

// Ensure upload dir exists
const uploadAbs = path.resolve(process.cwd(), UPLOAD_DIR);
fs.mkdirSync(uploadAbs, { recursive: true });
app.use("/uploads", express.static(uploadAbs));

app.get("/api/health", (_req, res) => {
  const rs = mongoose.connection.readyState;
  const labels = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbOk = rs === 1;
  res.status(dbOk ? 200 : 503).json({
    ok: dbOk,
    db: labels[rs] ?? "unknown",
  });
});

/** Block API traffic if MongoDB drops (avoids opaque 500s on every route) */
app.use((req, res, next) => {
  const pathOnly = req.originalUrl.split("?")[0];
  if (!pathOnly.startsWith("/api")) return next();
  if (pathOnly === "/api/health" || pathOnly.startsWith("/api/health/")) return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database not connected. Start MongoDB locally or fix MONGODB_URI on the API server (Atlas IP allowlist, URI typo, etc.).",
      code: "DB_UNAVAILABLE",
    });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/integrations", authMiddleware.optional, integrationsRoutes);
app.use("/api/app-logs", authMiddleware.optional, appLogsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/bundles", bundlesRoutes);
app.use("/api/enrollments", enrollmentsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/support-tickets", supportTicketsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/live-classes", liveClassesRoutes);
app.use("/api/internships", internshipsRoutes);
app.use("/api/ai-conversations", aiConversationsRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/course-interests", courseInterestsRoutes);
app.use("/api/doubt-sessions", doubtSessionsRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/certificates", certificatesRoutes);

app.use("/api/users", authMiddleware.required, usersRoutes);

// Basic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // express.json() / body-parser: bad JSON should be 400, not 500
  if (err && (err.status === 400 || err.type === "entity.parse.failed" || err.type === "entity.too.large")) {
    const status = err.status || 400;
    return res.status(status).json({
      message: err.message || "Invalid request body",
      ...(process.env.NODE_ENV !== "production" ? { type: err.type } : {}),
    });
  }
  const mapped = mapDbError(err);
  const status = mapped?.status || mapped?.statusCode || 500;
  if (status >= 500) {
    console.error("[API]", mapped?.message || err?.message);
    if (process.env.NODE_ENV !== "production") console.error(mapped?.stack || err?.stack);
  }
  const safeMessage =
    (mapped?.message && String(mapped.message)) ||
    (err?.message && String(err.message)) ||
    (err?.reason?.message && String(err.reason.message)) ||
    (err?.name ? `${err.name} (see server logs)` : "") ||
    "Server error";

  res.status(status).json({
    message: safeMessage,
    ...(mapped?.code ? { code: mapped.code } : {}),
    ...(mapped?.detail && process.env.NODE_ENV !== "production" ? { detail: mapped.detail } : {}),
    ...(err?.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV !== "production" ? { stack: mapped?.stack || err?.stack } : {}),
  });
});

try {
  await connectDb();
  console.log("[MongoDB] Connected");
} catch (e) {
  console.error("[MongoDB] Connection failed:", e?.message || e);
  console.error(
    "[MongoDB] Start MongoDB locally or set MONGODB_URI in backend/.env (see backend/.env.example)"
  );
  process.exit(1);
}

const tryListen = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.on("error", reject);
  });

try {
  await tryListen(PORT);
  console.log(`API listening on http://localhost:${PORT}`);
} catch (err) {
  if (err?.code === "EADDRINUSE") {
    console.error(
      `[API] Port ${PORT} is already in use. Stop the other process (or the old nodemon), or set PORT in backend/.env to a free port.`
    );
    console.error(
      `[API] If you ran seed:admin while dev was running, that is fine — but do not start two API servers on the same PORT.`
    );
    process.exit(1);
  }
  throw err;
}

