export interface LoopHandle {
  start: () => void
  stop: () => void
  isRunning: () => boolean
}

export function createLoop(onFrame: (dt: number, elapsed: number) => void): LoopHandle {
  let raf = 0
  let running = false
  let last = 0
  let elapsed = 0

  const tick = (now: number) => {
    if (!running) return
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    elapsed += dt
    onFrame(dt, elapsed)
    raf = requestAnimationFrame(tick)
  }

  return {
    start() {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    },
    stop() {
      running = false
      cancelAnimationFrame(raf)
    },
    isRunning: () => running,
  }
}
