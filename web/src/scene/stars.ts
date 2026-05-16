import * as THREE from 'three'

export function createStars(count: number): THREE.Points {
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 180
    positions[i3 + 1] = Math.random() * 55 + 2
    positions[i3 + 2] = -Math.random() * 120 - 10
    sizes[i] = Math.random() * 1.8 + 0.3
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uReduced: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      uniform float uTime;
      uniform float uReduced;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        if (uReduced < 0.5) {
          p.x += sin(uTime * 0.2 + position.z * 0.05) * 0.15;
          p.y += cos(uTime * 0.15 + position.x * 0.03) * 0.08;
        }
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = size * (220.0 / -mv.z);
        vAlpha = 0.35 + size * 0.25;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.1, d) * vAlpha;
        gl_FragColor = vec4(0.75, 0.88, 1.0, a);
      }
    `,
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return points
}

export function updateStars(stars: THREE.Points, time: number, reduced: boolean): void {
  const mat = stars.material as THREE.ShaderMaterial
  mat.uniforms.uTime.value = time
  mat.uniforms.uReduced.value = reduced ? 1 : 0
}
