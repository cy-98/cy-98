import './style.css'
import { mountDriftBackground } from './drift-background'
import { mountOverlay } from './ui/overlay'

const bgRoot = document.querySelector<HTMLElement>('#bg-root')
const uiRoot = document.querySelector<HTMLElement>('#ui-root')

if (!bgRoot || !uiRoot) {
  throw new Error('Missing #bg-root or #ui-root')
}

const drift = mountDriftBackground(bgRoot)
mountOverlay(uiRoot)

window.addEventListener('beforeunload', () => {
  drift.dispose()
})
