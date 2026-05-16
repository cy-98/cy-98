import * as THREE from 'three'

export function createStars(count: number): THREE.Points {
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const warmth = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const band = Math.random()
    positions[i3] = (Math.random() - 0.5) * 200
    positions[i3 + 1] = 4 + Math.pow(band, 0.65) * 52
    positions[i3 + 2] = -Math.random() * 130 - 8
    const roll = Math.random()
    sizes[i] = roll > 0.992 ? 3.2 + Math.random() * 1.4 : 0.35 + Math.random() * 1.6
    phases[i] = Math.random() * Math.PI * 2
    warmth[i] = 0.75 + Math.random() * 0.25
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('warmth', new THREE.BufferAttribute(warmth, 1))

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uReduced: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      attribute float phase;
      attribute float warmth;
      uniform float uTime;
      uniform float uReduced;
      varying float vWarmth;
      varying float vTwinkle;
      void main() {
        vec3 p = position;
        float tw = 1.0;
        if (uReduced < 0.5) {
          p.x += sin(uTime * 0.18 + phase) * 0.12;
          p.y += cos(uTime * 0.14 + phase * 1.3) * 0.06;
          tw = 0.72 + 0.28 * sin(uTime * (1.2 + warmth * 2.0) + phase);
        }
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = size * (240.0 / max(-mv.z, 1.0));
        vWarmth = warmth;
        vTwinkle = tw;
      }
    `,
    fragmentShader: `
      varying float vWarmth;
      varying float vTwinkle;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float core = smoothstep(0.5, 0.0, d);
        float halo = smoothstep(0.5, 0.18, d) * 0.45;
        float a = (core + halo) * (0.42 + vWarmth * 0.35) * vTwinkle;
        vec3 col = mix(vec3(0.72, 0.86, 1.0), vec3(1.0, 0.95, 0.88), vWarmth * 0.25);
        gl_FragColor = vec4(col, a);
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
