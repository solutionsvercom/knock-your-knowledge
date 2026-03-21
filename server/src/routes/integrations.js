import path from "node:path";
import express from "express";
import multer from "multer";

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.resolve(process.cwd(), UPLOAD_DIR)),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
      cb(null, `${Date.now()}_${safe}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post("/core/upload-file", upload.single("file"), async (req, res) => {
  const f = req.file;
  if (!f) return res.status(400).json({ message: "file is required" });
  const file_url = `/uploads/${f.filename}`;
  res.json({ file_url, filename: f.originalname, size: f.size });
});

router.post("/core/send-email", async (_req, res) => {
  // Local stub: accept payload, do nothing
  res.json({ ok: true });
});

router.post("/core/invoke-llm", async (req, res) => {
  const { prompt, messages } = req.body || {};
  const text =
    (typeof prompt === "string" && prompt.trim())
      ? `Local LLM stub response. Prompt received (${prompt.length} chars).`
      : Array.isArray(messages)
        ? `Local LLM stub response. Messages received (${messages.length}).`
        : "Local LLM stub response.";
  res.json({ text });
});

export default router;

