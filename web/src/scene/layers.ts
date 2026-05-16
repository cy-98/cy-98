import * as THREE from 'three'
import { LAYERS, type LayerSpec } from './config'
import { getLayerTexture } from './textures'

export interface ParallaxLayer {
  spec: LayerSpec
  mesh: THREE.Mesh
  baseZ: number
}

export function createParallaxLayers(
  overrides?: Partial<Record<string, THREE.Texture>>,
): ParallaxLayer[] {
  return LAYERS.map((spec) => {
    const tex = overrides?.[spec.id] ?? getLayerTexture(spec.id)
    const material = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: spec.id !== 'sky',
      opacity: spec.id === 'sky' ? 1 : 0.95,
    })

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(spec.width, spec.height),
      material,
    )
    mesh.position.set(spec.x ?? 0, spec.y ?? 0, spec.z)
    if (spec.id === 'boatRim') {
      mesh.renderOrder = 10
    }
    return { spec, mesh, baseZ: spec.z }
  })
}

export function updateParallaxLayers(
  layers: ParallaxLayer[],
  cameraZ: number,
  startZ: number,
): void {
  const traveled = startZ - cameraZ
  for (const layer of layers) {
    const offset = traveled * layer.spec.parallax * 0.12
    layer.mesh.position.z = layer.baseZ + offset
  }
}

export function animateLayers(
  layers: ParallaxLayer[],
  time: number,
  reduced: boolean,
): void {
  if (reduced) return

  for (const layer of layers) {
    if (layer.spec.id === 'flame') {
      layer.mesh.position.y = (layer.spec.y ?? 0) + Math.sin(time * 3) * 0.08
      layer.mesh.scale.setScalar(1 + Math.sin(time * 4) * 0.06)
    }
    if (layer.spec.id === 'qingning' || layer.spec.id === 'laojun') {
      layer.mesh.position.y =
        (layer.spec.y ?? 0) + Math.sin(time * 0.8 + layer.baseZ) * 0.04
    }
    if (layer.spec.id === 'rock') {
      const mat = layer.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 0.92 + Math.sin(time * 1.5) * 0.03
    }
  }
}
