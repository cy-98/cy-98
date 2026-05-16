export const SIMPLE_MODE_KEY = 'cy98-simple-scene'
export const FORCE_WEBGL_KEY = 'cy98-force-webgl'

export function isSimpleModeStored(): boolean {
  return localStorage.getItem(SIMPLE_MODE_KEY) === '1'
}

export function setSimpleModeStored(enabled: boolean): void {
  localStorage.setItem(SIMPLE_MODE_KEY, enabled ? '1' : '0')
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isLowEndDevice(): boolean {
  const cores = navigator.hardwareConcurrency
  return cores > 0 && cores <= 4
}

/** 是否应使用静态海报背景（不启动 WebGL） */
export function shouldUseStaticScene(): boolean {
  if (localStorage.getItem(FORCE_WEBGL_KEY) === '1') return false
  if (isSimpleModeStored()) return true
  if (prefersReducedMotion()) return true
  if (isLowEndDevice()) return true
  return false
}

export function isSimpleModeLocked(): boolean {
  if (localStorage.getItem(FORCE_WEBGL_KEY) === '1') return false
  if (isSimpleModeStored()) return false
  return prefersReducedMotion() || isLowEndDevice()
}

export function setForceWebGL(enabled: boolean): void {
  if (enabled) localStorage.setItem(FORCE_WEBGL_KEY, '1')
  else localStorage.removeItem(FORCE_WEBGL_KEY)
}

export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export type SceneMode = 'webgl' | 'static' | 'static-forced'

export function resolveSceneMode(): SceneMode {
  if (shouldUseStaticScene()) return 'static'
  if (!canUseWebGL()) return 'static-forced'
  return 'webgl'
}
