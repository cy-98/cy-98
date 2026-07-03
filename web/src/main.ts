import './style.css'
import { mountDriftBackground } from './drift-background'
import { onDesktopPointerChange, syncDesktopPassiveClass } from './drift/desktop-passive'
import { mountOverlay } from './ui/overlay'

syncDesktopPassiveClass()
const stopDesktopSync = onDesktopPointerChange(syncDesktopPassiveClass)

const bgRoot = document.querySelector<HTMLElement>('#bg-root')
const uiRoot = document.querySelector<HTMLElement>('#ui-root')

if (!bgRoot || !uiRoot) {
  throw new Error('Missing #bg-root or #ui-root')
}

mountOverlay(uiRoot)

let drift: { dispose: () => void } | null = null

mountDriftBackground(bgRoot)
  .then((handle) => {
    drift = handle
  })
  .catch((err) => {
    console.error('[site] failed to mount Drift', err)
  })

window.addEventListener('beforeunload', () => {
  stopDesktopSync()
  drift?.dispose()
})
