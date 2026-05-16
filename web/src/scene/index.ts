import * as THREE from 'three'
import { SCENE } from './config'
import { createStars, updateStars } from './stars'
import { createLake, updateLake } from './lake'
import { createLoop } from './loop'

export interface SceneHandle {
  dispose: () => void
  setScrollBoost: (value: number) => void
}

/** 星夜湖：仅程序化星空 + 湖面，无外链插画层 */
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
  renderer.setClearColor(SCENE.clearColor, 1)

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(SCENE.fogColor, SCENE.fogDensity)

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

  let cameraZ: number = SCENE.cameraStartZ
  let travelDir: -1 | 1 = -1
  let scrollBoost = 0

  const loop = createLoop((dt, elapsed) => {
    const speed = reducedMotion ? 0 : SCENE.forwardSpeed * (1 + scrollBoost * 0.35)

    if (!reducedMotion && SCENE.cameraPingPong) {
      cameraZ += travelDir * speed * dt
      if (cameraZ <= SCENE.cameraMinZ) {
        cameraZ = SCENE.cameraMinZ
        travelDir = 1
      } else if (cameraZ >= SCENE.cameraStartZ) {
        cameraZ = SCENE.cameraStartZ
        travelDir = -1
      }
    } else if (!reducedMotion) {
      cameraZ = Math.max(SCENE.cameraMinZ, cameraZ - speed * dt)
    }

    const bob = reducedMotion
      ? 0
      : Math.sin(elapsed * SCENE.bobFrequency) * SCENE.bobAmplitude
    camera.position.set(
      reducedMotion ? 0 : Math.sin(elapsed * 0.3) * 0.06,
      1.2 + bob,
      cameraZ,
    )
    camera.lookAt(0, -0.35, cameraZ - 20)

    updateStars(stars, elapsed, reducedMotion)
    updateLake(lake, elapsed, scrollBoost, reducedMotion)

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

  const decayScrollBoost = () => {
    if (scrollBoost <= 0) return
    scrollBoost = Math.max(0, scrollBoost - 0.018)
    if (scrollBoost > 0) requestAnimationFrame(decayScrollBoost)
  }

  let wheelDecayTimer = 0
  const onWheel = (e: WheelEvent) => {
    if (reducedMotion) return
    if (SCENE.scrollBoostRequiresShift && !e.shiftKey) return
    scrollBoost = Math.min(1.2, scrollBoost + e.deltaY * 0.00035)
    window.clearTimeout(wheelDecayTimer)
    wheelDecayTimer = window.setTimeout(() => {
      requestAnimationFrame(decayScrollBoost)
    }, 80)
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
      loop.stop()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('wheel', onWheel)
      renderer.dispose()
      stars.geometry.dispose()
      ;(stars.material as THREE.Material).dispose()
      lake.geometry.dispose()
      ;(lake.material as THREE.Material).dispose()
    },
  }
}
