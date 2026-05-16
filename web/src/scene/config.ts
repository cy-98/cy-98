export const SCENE = {
  cameraFov: 52,
  cameraStartZ: 12,
  cameraMinZ: -28,
  forwardSpeed: 0.35,
  bobAmplitude: 0.08,
  bobFrequency: 0.45,
  maxDpr: 2,
  starCountDesktop: 2400,
  starCountMobile: 900,
  mobileBreakpoint: 768,
} as const

export type LayerId =
  | 'sky'
  | 'rock'
  | 'qingning'
  | 'laojun'
  | 'flame'
  | 'boatRim'

export interface LayerSpec {
  id: LayerId
  z: number
  parallax: number
  width: number
  height: number
  x?: number
  y?: number
}

export const LAYERS: LayerSpec[] = [
  { id: 'sky', z: -90, parallax: 0.15, width: 140, height: 80, y: 8 },
  { id: 'rock', z: -48, parallax: 0.45, width: 22, height: 28, y: -2 },
  { id: 'qingning', z: -40, parallax: 0.55, width: 10, height: 18, y: -3, x: -3.2 },
  { id: 'laojun', z: -38, parallax: 0.58, width: 11, height: 20, y: -3, x: 2.8 },
  { id: 'flame', z: -36, parallax: 0.62, width: 4, height: 4, y: -1.5, x: 0 },
  { id: 'boatRim', z: -6, parallax: 1.2, width: 28, height: 10, y: -5.5 },
]
