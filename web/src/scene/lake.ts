import * as THREE from 'three'
import { SCENE } from './config'

const lakeVertex = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform float uReduced;
  uniform float uRipple;
  void main() {
    vUv = uv;
    vec3 p = position;
    if (uReduced < 0.5) {
      float wave = sin(p.x * 0.32 + uTime * 0.85) * 0.1
                 + cos(p.z * 0.26 + uTime * 0.65) * 0.08;
      wave *= uRipple;
      p.y += wave;
      vElevation = wave;
    } else {
      vElevation = 0.0;
    }
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const lakeFragment = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform float uScroll;
  uniform float uReduced;
  uniform float uRipple;
  uniform float uGlint;
  void main() {
    vec2 uv = vUv;
    float t = uTime;
    if (uReduced < 0.5) {
      uv.y += t * 0.025 + uScroll * 0.018;
      uv.x += sin(t * 0.4 + uv.y * 6.0) * 0.004 * uRipple;
    }
    float ripple = sin(uv.x * 38.0 + t * 1.1) * 0.5 + 0.5;
    ripple *= sin(uv.y * 32.0 - t * 0.75) * 0.5 + 0.5;
    ripple = mix(0.35, ripple, uRipple);

    vec3 deep = vec3(0.015, 0.045, 0.11);
    vec3 mid = vec3(0.03, 0.1, 0.2);
    vec3 shallow = vec3(0.06, 0.16, 0.28);
    vec3 col = mix(deep, mid, ripple * 0.4 + vElevation * 2.5);
    col = mix(col, shallow, smoothstep(0.15, 0.55, uv.y) * 0.35);

    float glint = pow(ripple, 2.8) * 0.22 * uGlint;
    if (uReduced < 0.5) {
      glint += pow(sin(uv.x * 70.0 + t * 1.8) * 0.5 + 0.5, 4.0) * 0.06 * uGlint;
    }
    col += vec3(0.45, 0.72, 0.95) * glint;

    float horizon = smoothstep(0.48, 0.62, uv.y);
    col += vec3(0.08, 0.14, 0.22) * horizon * 0.5;

    float shoreFade = smoothstep(0.0, 0.22, uv.y);
    col = mix(col * 0.55, col, shoreFade);

    float alpha = 0.9 + horizon * 0.08;
    gl_FragColor = vec4(col, alpha);
  }
`

export function createLake(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(140, 90, 80, 56)
  geometry.rotateX(-Math.PI / 2)

  const material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uReduced: { value: 0 },
      uRipple: { value: SCENE.lake.ripple },
      uGlint: { value: SCENE.lake.glint },
    },
    vertexShader: lakeVertex,
    fragmentShader: lakeFragment,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, SCENE.lake.y, SCENE.lake.z)
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
