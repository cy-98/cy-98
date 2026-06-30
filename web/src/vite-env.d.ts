/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DRIFT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
