/** 星夜湖场景参数 — 调色与镜头 */
export const SCENE = {
  cameraFov: 50,
  cameraStartZ: 12,
  cameraMinZ: -26,
  cameraPingPong: true,
  forwardSpeed: 0.28,
  bobAmplitude: 0.035,
  bobFrequency: 0.38,
  maxDpr: 2,
  starCountDesktop: 3200,
  starCountMobile: 1100,
  mobileBreakpoint: 768,
  scrollBoostRequiresShift: true,
  clearColor: 0x030810,
  fogColor: 0x061018,
  fogDensity: 0.015,
  lake: {
    y: -4.0,
    z: -24,
    ripple: 1.0,
    glint: 1.0,
  },
} as const
