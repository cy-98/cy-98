import './style.css'
import { initScene } from './scene'
import { LakeAmbientSound, isLakeSoundEnabled } from './scene/ambient-sound'
import { mountStaticFallback } from './scene/static-fallback'
import {
  isSimpleModeLocked,
  isSimpleModeStored,
  prefersReducedMotion,
  resolveSceneMode,
  setForceWebGL,
  setSimpleModeStored,
} from './scene/runtime-mode'
import { mountOverlay, type OverlayOptions } from './ui/overlay'

const canvas = document.querySelector<HTMLCanvasElement>('#scene-canvas')
const uiRoot = document.querySelector<HTMLElement>('#ui-root')

if (!canvas || !uiRoot) {
  throw new Error('Missing #scene-canvas or #ui-root')
}

let staticFallback: { dispose: () => void } | null = null
let scene: { dispose: () => void } | null = null
let ambient: LakeAmbientSound | null = null

const soundAvailable =
  typeof AudioContext !== 'undefined' ||
  typeof (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext !==
    'undefined'

function applySimpleMode(enabled: boolean, forceWebgl = false): void {
  setSimpleModeStored(enabled)
  if (forceWebgl) setForceWebGL(true)
  else setForceWebGL(false)
  window.location.reload()
}

function syncAmbientSound(enabled: boolean): void {
  if (!soundAvailable) return
  if (enabled) {
    ambient ??= new LakeAmbientSound()
    ambient.start()
  } else {
    const current = ambient
    ambient = null
    current?.stop()
  }
}

const overlayOptions: OverlayOptions = {
  displayMode: resolveSceneMode() === 'webgl' ? 'webgl' : 'static',
  simpleModeChecked: resolveSceneMode() !== 'webgl',
  simpleModeLocked: isSimpleModeLocked(),
  reducedMotion: prefersReducedMotion(),
  soundAvailable,
  onSimpleModeChange(enabled) {
    if (!enabled && isSimpleModeLocked()) {
      const ok = window.confirm(
        '系统已开启「减少动态效果」或检测为低性能设备。仍要尝试动态场景吗？可能会卡顿。',
      )
      if (!ok) return
      applySimpleMode(false, true)
      return
    }
    applySimpleMode(enabled)
  },
  onSoundChange(enabled) {
    syncAmbientSound(enabled)
  },
}

mountOverlay(uiRoot, overlayOptions)

const mode = resolveSceneMode()

if (mode === 'webgl') {
  try {
    canvas.hidden = false
    scene = initScene(canvas)
    if (isLakeSoundEnabled()) syncAmbientSound(true)
  } catch (err) {
    console.warn('WebGL init failed, using static fallback', err)
    canvas.hidden = true
    staticFallback = mountStaticFallback(document.body, 'webgl-failed')
  }
} else {
  canvas.hidden = true
  const reason = isSimpleModeStored() ? 'simple' : 'preference'
  staticFallback = mountStaticFallback(document.body, reason)
}

window.addEventListener('beforeunload', () => {
  scene?.dispose()
  staticFallback?.dispose()
  ambient?.dispose()
})
