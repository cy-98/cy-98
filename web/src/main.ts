import './style.css'
import { mountDriftBackground } from './drift-background'
import { syncEmbedPassiveClass } from './drift/desktop-passive'
import { mountOverlay } from './ui/overlay'

syncEmbedPassiveClass()

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
  drift?.dispose()
})
