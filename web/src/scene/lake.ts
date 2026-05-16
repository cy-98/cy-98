import * as THREE from 'three'

const lakeVertex = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uReduced;
  void main() {
    vUv = uv;
    vec3 p = position;
    if (uReduced < 0.5) {
      float wave = sin(p.x * 0.35 + uTime * 0.9) * 0.12
                 + cos(p.z * 0.28 + uTime * 0.7) * 0.1;
      p.y += wave;
      vElevation = wave;
    } else {
      vElevation = 0.0;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const lakeFragment = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uScroll;
  uniform float uReduced;
  void main() {
    vec2 uv = vUv;
    uv.y += uTime * 0.03 + uScroll * 0.02;
    float ripple = sin(uv.x * 40.0 + uTime * 1.2) * 0.5 + 0.5;
    ripple *= sin(uv.y * 35.0 - uTime * 0.8) * 0.5 + 0.5;
    vec3 deep = vec3(0.02, 0.06, 0.14);
    vec3 mid = vec3(0.04, 0.12, 0.22);
    vec3 col = mix(deep, mid, ripple * 0.35 + vElevation * 0.5);
    float starGlint = pow(ripple, 3.0) * 0.25;
    if (uReduced < 0.5) {
      starGlint += sin(uv.x * 80.0 + uTime * 2.0) * 0.04;
    }
    col += vec3(0.5, 0.75, 0.95) * starGlint;
    float fog = smoothstep(0.0, 0.35, uv.y);
    col = mix(col * 0.6, col, fog);
    gl_FragColor = vec4(col, 0.92);
  }
`

export function createLake(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(120, 80, 64, 48)
  geometry.rotateX(-Math.PI / 2)

  const material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uReduced: { value: 0 },
    },
    vertexShader: lakeVertex,
    fragmentShader: lakeFragment,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, -4.2, -25)
  return mesh
}

export function updateLake(
  lake: THREE.Mesh,
  time: number,
  scroll: number,
  reduced: boolean,
): void {
  const mat = lake.material as THREE.ShaderMaterial
  mat.uniforms.uTime.value = time
  mat.uniforms.uScroll.value = scroll
  mat.uniforms.uReduced.value = reduced ? 1 : 0
}
