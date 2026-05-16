import './style.css'
import { initScene } from './scene'
import { mountOverlay } from './ui/overlay'

const canvas = document.querySelector<HTMLCanvasElement>('#scene-canvas')
const uiRoot = document.querySelector<HTMLElement>('#ui-root')

if (!canvas || !uiRoot) {
  throw new Error('Missing #scene-canvas or #ui-root')
}

mountOverlay(uiRoot)
const scene = initScene(canvas)

window.addEventListener('beforeunload', () => {
  scene.dispose()
})
