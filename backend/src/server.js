import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDb } from "./config/db.js";
import contactRouter from "./routes/contact.js";
import paymentsRouter from "./routes/payments.js";
import adminRouter from "./routes/admin.js";
import couponsRouter from "./routes/coupons.js";
import ticketsRouter from "./routes/tickets.js";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") }); // reload env on process restart

const app = express();
const PORT = Number(process.env.PORT) || 5001;

const allowedOrigins = String(process.env.FRONTEND_URL || "http://localhost:5173")
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
  res.json({ ok: true, db, service: "kyk-api" });
});

app.use("/api/contact", contactRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/admin", adminRouter);

app.use((err, _req, res, _next) => {
  console.error("[API]", err?.message || err);
  res.status(500).json({ message: err?.message || "Server error" });
});

async function start() {
  try {
    await connectDb(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`[API] listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[API] failed to start:", err.message);
    process.exit(1);
  }
}

start();
