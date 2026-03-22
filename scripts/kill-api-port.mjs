/**
 * Free the API port from backend/.env (default 5001/5002) before `npm run dev`.
 * Fixes "Port already in use" / nodemon crash when a zombie Node process holds the port.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, "backend", ".env");

let ports = [5001, 5002];
try {
  const raw = readFileSync(envPath, "utf8");
  const m = raw.match(/^\s*PORT\s*=\s*(\d+)/m);
  if (m) ports = [Number(m[1])];
} catch {
  // no backend/.env — try common defaults
}

const unique = [...new Set(ports)].filter((n) => Number.isFinite(n) && n > 0);
if (unique.length === 0) process.exit(0);

try {
  execSync(`npx --yes kill-port ${unique.join(" ")}`, {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
} catch {
  // No listener on port, or kill-port not available — safe to continue
}
process.exit(0);
