import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'
import fs from 'node:fs'

/** Read PORT from server/.env (strip UTF-8 BOM so regex always matches) */
function readPortFromServerEnv() {
  try {
    const envPath = path.resolve(process.cwd(), 'server/.env')
    let raw = fs.readFileSync(envPath, 'utf8')
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1)
    const m = raw.match(/^\s*PORT\s*=\s*(\d+)/m)
    if (m) return Number(m[1])
  } catch {
    // missing server/.env
  }
  return null
}

/** Match server/.env PORT so /api proxy hits the same process as `npm --prefix server run dev` */
function resolveApiProxyTarget(env = {}) {
  const fromEnv = env?.VITE_PROXY_TARGET
  if (fromEnv) return String(fromEnv).replace(/\/$/, '')
  const port = readPortFromServerEnv()
  return `http://localhost:${port ?? 5001}`
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') ?? {}
  const apiTarget = resolveApiProxyTarget(env)

  return {
    logLevel: 'error',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
