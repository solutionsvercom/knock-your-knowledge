import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

/**
 * Load `backend/.env` no matter the current working directory (fixes seeds/CLI when run from repo root).
 */
export function loadServerEnv() {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.resolve(dir, "../../.env");
  dotenv.config({ path: envPath, override: true });
}
