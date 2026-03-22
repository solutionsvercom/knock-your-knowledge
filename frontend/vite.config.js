import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import fs from "node:fs";

function readPortFromBackendEnv() {
  try {
    const envPath = path.resolve(process.cwd(), "../backend/.env");
    let raw = fs.readFileSync(envPath, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    const m = raw.match(/^\s*PORT\s*=\s*(\d+)/m);
    if (m) return Number(m[1]);
  } catch {
    // missing backend/.env
  }
  return null;
}

function resolveApiProxyTarget(env = {}) {
  const fromEnv = env?.VITE_PROXY_TARGET;
  if (fromEnv) return String(fromEnv).replace(/\/$/, "");
  const port = readPortFromBackendEnv();
  return `http://localhost:${port ?? 5000}`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "") ?? {};
  const apiTarget = resolveApiProxyTarget(env);

  return {
    logLevel: "error",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
