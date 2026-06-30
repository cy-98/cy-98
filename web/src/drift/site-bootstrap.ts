// Drift 子模块为 JS 源码，嵌入层不做类型细查。
// @ts-nocheck
import { createWebStorage } from '../../drift/src/platform/web/storage-web.js'
import { createDomHud } from '../../drift/src/platform/web/dom-hud.js'
import { initWebMonitor } from '../../drift/src/platform/web/monitor-web.js'
import { createDriftApp } from '../../drift/src/core/drift-app.js'
import { createWebInput } from '../../drift/src/platform/web/input-web.js'
import { createTouch } from '../../drift/src/platform/web/touch.js'
import { createGamepad } from '../../drift/src/platform/web/gamepad.js'
import { createWebNarration } from '../../drift/src/platform/web/narration-web.js'
import { loadGalaxyCatalog } from '../../drift/src/core/galaxy-loader.js'

declare global {
  interface Window {
    __DRIFT_BASE__?: string
  }
}

export interface SiteBootstrapHandle {
  dispose(): void
}

function q<T extends Element>(root: ParentNode, id: string): T | null {
  return root.querySelector<T>(`#${CSS.escape(id)}`)
}

function inSiteUi(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest('.ui-root')
}

/** 在个人站 #drift-mount 内启动 Drift（直接引用 drift 源码，无 iframe）。 */
export async function bootDriftEmbed(mount: HTMLElement): Promise<SiteBootstrapHandle> {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  window.__DRIFT_BASE__ = `${base}drift/`

  const canvas = q<HTMLCanvasElement>(mount, 'drift-canvas')
  if (!canvas) throw new Error('Missing #drift-canvas in drift mount')

  const webglError = q<HTMLElement>(mount, 'webgl-error')
  const storage = createWebStorage()

  const hud = createDomHud({
    prompt: q(mount, 'prompt'),
    speedEl: q(mount, 'speed'),
    altEl: q(mount, 'alt'),
    fpsEl: q(mount, 'fps'),
    collectEl: q(mount, 'collect-count'),
    targetEl: q(mount, 'target'),
    distEl: q(mount, 'dist'),
    compass: q(mount, 'compass'),
    loreToast: q(mount, 'lore'),
    sectorEl: q(mount, 'sector'),
    galaxyEl: q(mount, 'galaxy'),
    startBtn: q<HTMLButtonElement>(mount, 'start-btn'),
  })

  function showWebglError(message?: string) {
    webglError?.classList.add('show')
    webglError?.removeAttribute('hidden')
    if (message && webglError) {
      const sub = webglError.querySelector('.drift-webgl-error__sub')
      if (sub) sub.textContent = message
    }
  }

  const monitor = initWebMonitor({
    storage,
    canvas,
    onContextLost: () => showWebglError('图形上下文丢失，请刷新页面'),
    onLowFps: (fps) => console.warn('[Drift] low fps', fps),
  })

  const platform = {
    getPixelRatio(quality: string) {
      if (quality === 'low') return 1
      return Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.5)
    },
    onReady() {
      mount.classList.add('drift-ready')
      hud.dismissPrompt()
    },
    setVignette(on: boolean) {
      mount.classList.toggle('vignette-on', on)
    },
    setPhotoMode(on: boolean) {
      mount.classList.toggle('photo-mode', on)
      if (on) mount.classList.remove('boost-hyper')
    },
    setBoostHyper(on: boolean) {
      mount.classList.toggle('boost-hyper', !!on)
    },
    exitPointerLock() {
      document.exitPointerLock?.()
    },
  }

  const inputHolder: { current: ReturnType<typeof createWebInput> | null } = { current: null }
  const gamepad = createGamepad()
  const touch = createTouch(() => (app?.ok ? app.getSettings() : {}), {
    onEngage: () => inputHolder.current?.requestEngage?.(),
  })

  let app: ReturnType<typeof createDriftApp> | { ok: false; error?: unknown } | null = null
  const loadStart = performance.now()

  const onResize = () => {
    if (app?.ok) app.resize()
  }

  const onKeydown = (e: KeyboardEvent) => {
    if (inSiteUi(e.target)) return
    if (!app?.ok) return
    if (e.key.toLowerCase() === 'tab') {
      e.preventDefault()
      app.cycleNavTarget()
    }
  }

  mount.addEventListener(
    'selectstart',
    (e) => {
      if (inSiteUi(e.target)) return
      e.preventDefault()
    },
    { passive: false },
  )

  mount.addEventListener('contextmenu', (e) => {
    if (inSiteUi(e.target)) return
    e.preventDefault()
  })

  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKeydown)

  try {
    await loadGalaxyCatalog()
    app = createDriftApp({
      canvas,
      storage,
      hud,
      platform,
      monitor,
      touch,
      gamepad,
      loadStart,
      createNarration: createWebNarration,
      createInput: (c: HTMLCanvasElement, cam: unknown, getS: () => Record<string, unknown>, h: unknown, opts: Record<string, unknown>) => {
        const inp = createWebInput(c, cam, getS, h, {
          ...opts,
          onEscape: () => {
            if (mount.classList.contains('photo-mode')) app?.togglePhotoMode?.()
          },
          touch,
          gamepad,
        })
        inputHolder.current = inp
        return inp
      },
    })
  } catch (err) {
    console.error('[Drift] embed boot failed', err)
    showWebglError('苏醒受阻，请刷新页面重试')
    app = { ok: false, error: err }
  }

  if (!app?.ok) {
    if (app && 'error' in app && app.error) console.error(app.error)
    if (!webglError?.classList.contains('show')) showWebglError()
  } else {
    webglError?.classList.remove('show')
    webglError?.setAttribute('hidden', '')
  }

  return {
    dispose() {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeydown)
      app?.endSession?.()
    },
  }
}
