import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const base = process.env.VITE_BASE ?? '/cy-98/'
const rootDir = path.dirname(fileURLToPath(import.meta.url))
const specsDir = path.join(rootDir, 'docs/specs')

function specsMiddleware(
  req: import('http').IncomingMessage,
  res: import('http').ServerResponse,
  next: () => void,
) {
  const url = req.url?.split('?')[0] ?? ''
  if (!url.startsWith('/specs')) return next()

  const rel = decodeURIComponent(url.replace(/^\/specs\/?/, '') || 'index.html')
  const file = path.normalize(path.join(specsDir, rel))
  if (!file.startsWith(specsDir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return next()
  }

  const ext = path.extname(file).toLowerCase()
  const types: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
  }
  res.statusCode = 200
  res.setHeader('Content-Type', types[ext] ?? 'application/octet-stream')
  res.end(fs.readFileSync(file))
}

/** Vite dev 会把 public 里的 .html 当成 SPA 回退；spec 从 docs/specs 单独挂载。 */
function serveSpecsHtml(): Plugin {
  return {
    name: 'serve-specs-html',
    configureServer(server) {
      server.middlewares.use(specsMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(specsMiddleware)
    },
  }
}

/** 构建时把 docs/specs 复制到 dist/specs（Pages 可访问） */
function copySpecsToDist(): Plugin {
  return {
    name: 'copy-specs-to-dist',
    apply: 'build',
    closeBundle() {
      const dest = path.join(rootDir, 'dist/specs')
      fs.cpSync(specsDir, dest, { recursive: true })
    },
  }
}

export default defineConfig({
  base,
  plugins: [serveSpecsHtml(), copySpecsToDist()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
})
