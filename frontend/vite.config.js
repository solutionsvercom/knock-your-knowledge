import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import fs from "node:fs";

function backendPort() {
  try {
    const envPath = path.resolve(process.cwd(), "../backend/.env");
    if (!fs.existsSync(envPath)) return 5001;
    const text = fs.readFileSync(envPath, "utf8");
    const m = text.match(/^\s*PORT\s*=\s*(\d+)/m);
    return m ? Number(m[1]) : 5001;
  } catch {
    return 5001;
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.VITE_API_PROXY_PORT) || backendPort();

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
          target: `http://127.0.0.1:${port}`,
          changeOrigin: true,
        },
      },
    },
  };
});
