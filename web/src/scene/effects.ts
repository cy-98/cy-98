import * as THREE from 'three'

export function createFlameParticles(reduced: boolean, mobile: boolean): THREE.Points {
  const count = reduced ? 0 : mobile ? 40 : 120
  const positions = new Float32Array(count * 3)
  const velocities: THREE.Vector3[] = []

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 1.2
    positions[i3 + 1] = Math.random() * 1.5
    positions[i3 + 2] = (Math.random() - 0.5) * 0.6
    velocities.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.04 + 0.02,
        (Math.random() - 0.5) * 0.01,
      ),
    )
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xffaa55,
    size: mobile ? 0.12 : 0.18,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)
  points.position.set(0, -1.2, -35.5)
  points.userData.velocities = velocities
  return points
}

export function updateFlameParticles(
  points: THREE.Points,
  time: number,
  reduced: boolean,
): void {
  if (reduced || points.geometry.attributes.position.count === 0) return

  const pos = points.geometry.attributes.position as THREE.BufferAttribute
  const vels = points.userData.velocities as THREE.Vector3[] | undefined
  if (!vels) return

  for (let i = 0; i < pos.count; i++) {
    const i3 = i * 3
    pos.array[i3] += vels[i].x + Math.sin(time * 2 + i) * 0.002
    pos.array[i3 + 1] += vels[i].y
    pos.array[i3 + 2] += vels[i].z
    if (pos.array[i3 + 1] > 2.2) {
      pos.array[i3] = (Math.random() - 0.5) * 1.2
      pos.array[i3 + 1] = 0
      pos.array[i3 + 2] = (Math.random() - 0.5) * 0.6
    }
  }
  pos.needsUpdate = true
}

export function createSmoke(reduced: boolean, mobile: boolean): THREE.Points {
  const count = reduced ? 0 : mobile ? 25 : 60
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = 2.6 + (Math.random() - 0.5) * 0.4
    positions[i3 + 1] = -2.5 + Math.random() * 0.8
    positions[i3 + 2] = -37 + (Math.random() - 0.5) * 0.5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xaac8dd,
    size: mobile ? 0.25 : 0.35,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  })

  return new THREE.Points(geometry, material)
}

export function updateSmoke(points: THREE.Points, time: number, reduced: boolean): void {
  if (reduced || points.geometry.attributes.position.count === 0) return
  const pos = points.geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const i3 = i * 3
    pos.array[i3 + 1] += 0.008 + Math.sin(time + i) * 0.002
    pos.array[i3] += Math.sin(time * 0.5 + i) * 0.003
    if (pos.array[i3 + 1] > -1.2) {
      pos.array[i3 + 1] = -2.5 + Math.random() * 0.3
      pos.array[i3] = 2.6 + (Math.random() - 0.5) * 0.3
    }
  }
  pos.needsUpdate = true
}
