import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const base = process.env.VITE_BASE ?? '/cy-98/'
const rootDir = path.dirname(fileURLToPath(import.meta.url))
const specsDir = path.join(rootDir, 'docs/specs')
const driftDir = path.join(rootDir, 'drift')

function driftBasePath(): string {
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}drift/`
}

function driftAssetMiddleware(
  req: import('http').IncomingMessage,
  res: import('http').ServerResponse,
  next: () => void,
) {
  const url = req.url?.split('?')[0] ?? ''
  const prefix = driftBasePath()
  if (!url.startsWith(prefix)) return next()

  const rel = decodeURIComponent(url.slice(prefix.length))
  const file = path.normalize(path.join(driftDir, rel))
  if (!file.startsWith(driftDir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return next()
  }

  const ext = path.extname(file).toLowerCase()
  const types: Record<string, string> = {
    '.json': 'application/json; charset=utf-8',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.yml': 'text/yaml; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
  }
  res.statusCode = 200
  res.setHeader('Content-Type', types[ext] ?? 'application/octet-stream')
  res.end(fs.readFileSync(file))
}

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

function serveSpecsHtml(): Plugin {
  return {
    name: 'serve-specs-html',
    configureServer(server) {
      server.middlewares.use(specsMiddleware)
      server.middlewares.use(driftAssetMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(specsMiddleware)
      server.middlewares.use(driftAssetMiddleware)
    },
  }
}

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

function copyDriftAssetsToDist(): Plugin {
  return {
    name: 'copy-drift-assets-to-dist',
    apply: 'build',
    closeBundle() {
      const dest = path.join(rootDir, 'dist/drift')
      fs.mkdirSync(dest, { recursive: true })
      for (const dir of ['data', 'public']) {
        const src = path.join(driftDir, dir)
        if (fs.existsSync(src)) {
          fs.cpSync(src, path.join(dest, dir), { recursive: true })
        }
      }
    },
  }
}

export default defineConfig({
  base,
  plugins: [serveSpecsHtml(), copySpecsToDist(), copyDriftAssetsToDist()],
  resolve: {
    alias: [
      {
        find: /^three\/addons\/(.*)$/,
        replacement: `${path.join(driftDir, 'vendor/three/examples/jsm')}/$1`,
      },
      {
        find: 'three',
        replacement: path.join(driftDir, 'vendor/three/build/three.module.js'),
      },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/drift/vendor/three/') || id.includes('node_modules/three')) {
            return 'three'
          }
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
