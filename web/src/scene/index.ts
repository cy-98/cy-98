import * as THREE from 'three'
import { SCENE } from './config'
import { createStars, updateStars } from './stars'
import { createLake, updateLake } from './lake'
import {
  createParallaxLayers,
  updateParallaxLayers,
  animateLayers,
  type ParallaxLayer,
} from './layers'
import {
  createFlameParticles,
  updateFlameParticles,
  createSmoke,
  updateSmoke,
} from './effects'
import { createLoop } from './loop'
import { loadSceneTexturesFromUrls } from './textures'

export interface SceneHandle {
  dispose: () => void
  setScrollBoost: (value: number) => void
}

export function initScene(canvas: HTMLCanvasElement): SceneHandle {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.innerWidth < SCENE.mobileBreakpoint
  const dpr = Math.min(window.devicePixelRatio, SCENE.maxDpr)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: false,
    powerPreference: isMobile ? 'low-power' : 'high-performance',
  })
  renderer.setPixelRatio(dpr)
  renderer.setSize(window.innerWidth, window.innerHeight, false)
  renderer.setClearColor(0x030810, 1)

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x061018, 0.018)

  const camera = new THREE.PerspectiveCamera(
    SCENE.cameraFov,
    window.innerWidth / window.innerHeight,
    0.1,
    200,
  )
  camera.position.set(0, 1.2, SCENE.cameraStartZ)

  const starCount = isMobile ? SCENE.starCountMobile : SCENE.starCountDesktop
  const stars = createStars(reducedMotion ? Math.floor(starCount * 0.4) : starCount)
  scene.add(stars)

  const lake = createLake()
  scene.add(lake)

  let layers: ParallaxLayer[] = createParallaxLayers()
  for (const layer of layers) {
    scene.add(layer.mesh)
  }

  const flameParticles = createFlameParticles(reducedMotion, isMobile)
  const smoke = createSmoke(reducedMotion, isMobile)
  scene.add(flameParticles)
  scene.add(smoke)

  let cameraZ: number = SCENE.cameraStartZ
  let scrollBoost = 0
  let disposed = false

  const baseUrl = import.meta.env.BASE_URL

  loadSceneTexturesFromUrls(baseUrl).then((overrides) => {
    if (disposed || Object.keys(overrides).length === 0) return
    for (const layer of layers) {
      scene.remove(layer.mesh)
      layer.mesh.geometry.dispose()
      ;(layer.mesh.material as THREE.Material).dispose()
    }
    layers = createParallaxLayers(overrides)
    for (const layer of layers) {
      scene.add(layer.mesh)
    }
  })

  const loop = createLoop((dt, elapsed) => {
    const speed = reducedMotion ? 0 : SCENE.forwardSpeed * (1 + scrollBoost * 0.35)
    cameraZ = Math.max(SCENE.cameraMinZ, cameraZ - speed * dt)

    const bob = reducedMotion
      ? 0
      : Math.sin(elapsed * SCENE.bobFrequency) * SCENE.bobAmplitude
    camera.position.set(
      reducedMotion ? 0 : Math.sin(elapsed * 0.3) * 0.06,
      1.2 + bob,
      cameraZ,
    )
    camera.lookAt(0, -0.5, cameraZ - 18)

    updateStars(stars, elapsed, reducedMotion)
    updateLake(lake, elapsed, scrollBoost, reducedMotion)
    updateParallaxLayers(layers, cameraZ, SCENE.cameraStartZ)
    animateLayers(layers, elapsed, reducedMotion)
    updateFlameParticles(flameParticles, elapsed, reducedMotion)
    updateSmoke(smoke, elapsed, reducedMotion)

    renderer.render(scene, camera)
  })

  const onResize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }

  const onVisibility = () => {
    if (document.hidden) loop.stop()
    else loop.start()
  }

  let wheelTimeout = 0
  const onWheel = (e: WheelEvent) => {
    if (reducedMotion) return
    scrollBoost = Math.min(1.5, scrollBoost + e.deltaY * 0.0004)
    window.clearTimeout(wheelTimeout)
    wheelTimeout = window.setTimeout(() => {
      scrollBoost *= 0.92
      if (scrollBoost < 0.02) scrollBoost = 0
    }, 120)
  }

  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('wheel', onWheel, { passive: true })

  loop.start()

  return {
    setScrollBoost(v: number) {
      scrollBoost = v
    },
    dispose() {
      disposed = true
      loop.stop()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('wheel', onWheel)
      renderer.dispose()
      stars.geometry.dispose()
      ;(stars.material as THREE.Material).dispose()
      lake.geometry.dispose()
      ;(lake.material as THREE.Material).dispose()
      flameParticles.geometry.dispose()
      ;(flameParticles.material as THREE.Material).dispose()
      smoke.geometry.dispose()
      ;(smoke.material as THREE.Material).dispose()
      for (const layer of layers) {
        layer.mesh.geometry.dispose()
        ;(layer.mesh.material as THREE.Material).dispose()
      }
    },
  }
}
