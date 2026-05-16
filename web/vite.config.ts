import { defineConfig } from 'vite'

const base = process.env.VITE_BASE ?? '/cy-98/'

export default defineConfig({
  base,
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
})
