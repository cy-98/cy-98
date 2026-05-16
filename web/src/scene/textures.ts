import * as THREE from 'three'
import type { LayerId } from './config'

const STROKE = '#6eb8e8'
const FILL = 'rgba(8, 20, 40, 0.85)'

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#030810')
  g.addColorStop(0.55, '#061428')
  g.addColorStop(1, '#0a1e38')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * w
    const y = Math.random() * h * 0.7
    const r = Math.random() * 1.4 + 0.3
    ctx.fillStyle = `rgba(200, 220, 255, ${Math.random() * 0.5 + 0.2})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawRock(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = FILL
  ctx.strokeStyle = STROKE
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(w * 0.15, h * 0.95)
  ctx.lineTo(w * 0.08, h * 0.45)
  ctx.quadraticCurveTo(w * 0.2, h * 0.15, w * 0.5, h * 0.08)
  ctx.quadraticCurveTo(w * 0.85, h * 0.12, w * 0.92, h * 0.5)
  ctx.lineTo(w * 0.88, h * 0.95)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.font = `bold ${h * 0.22}px serif`
  ctx.fillStyle = STROKE
  ctx.textAlign = 'center'
  ctx.fillText('借', w * 0.42, h * 0.42)
  ctx.fillText('火', w * 0.58, h * 0.42)
}

function drawFigure(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  variant: 'qingning' | 'laojun',
): void {
  ctx.fillStyle = FILL
  ctx.strokeStyle = STROKE
  ctx.lineWidth = 2.5
  const flip = variant === 'laojun' ? -1 : 1
  ctx.save()
  ctx.translate(w / 2, h)
  ctx.scale(flip, 1)

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-w * 0.22, -h * 0.55)
  ctx.quadraticCurveTo(-w * 0.05, -h * 0.75, w * 0.08, -h * 0.7)
  ctx.lineTo(w * 0.12, -h * 0.35)
  ctx.lineTo(w * 0.28, -h * 0.38)
  ctx.lineTo(w * 0.18, 0)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(w * 0.05, -h * 0.72)
  ctx.quadraticCurveTo(w * 0.35, -h * 0.95, w * 0.55, -h * 0.88)
  ctx.stroke()

  if (variant === 'laojun') {
    ctx.beginPath()
    ctx.moveTo(w * 0.2, -h * 0.4)
    ctx.lineTo(w * 0.75, -h * 0.35)
    ctx.stroke()
  }

  ctx.restore()
}

function drawFlame(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const g = ctx.createRadialGradient(w / 2, h * 0.6, 2, w / 2, h * 0.5, w * 0.45)
  g.addColorStop(0, 'rgba(255, 180, 80, 0.9)')
  g.addColorStop(0.5, 'rgba(255, 100, 40, 0.5)')
  g.addColorStop(1, 'rgba(255, 60, 20, 0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(w * 0.5, h * 0.05)
  ctx.quadraticCurveTo(w * 0.9, h * 0.5, w * 0.5, h * 0.95)
  ctx.quadraticCurveTo(w * 0.1, h * 0.5, w * 0.5, h * 0.05)
  ctx.fill()
  ctx.strokeStyle = STROKE
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawBoatRim(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, 'rgba(4, 12, 24, 0)')
  g.addColorStop(0.35, 'rgba(4, 12, 24, 0.75)')
  g.addColorStop(1, 'rgba(2, 8, 18, 0.98)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = STROKE
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, h * 0.35)
  ctx.quadraticCurveTo(w * 0.5, h * 0.15, w, h * 0.4)
  ctx.stroke()
}

function paintLayer(id: LayerId, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, width, height)

  switch (id) {
    case 'sky':
      drawSky(ctx, width, height)
      break
    case 'rock':
      drawRock(ctx, width, height)
      break
    case 'qingning':
      drawFigure(ctx, width, height, 'qingning')
      break
    case 'laojun':
      drawFigure(ctx, width, height, 'laojun')
      break
    case 'flame':
      drawFlame(ctx, width, height)
      break
    case 'boatRim':
      drawBoatRim(ctx, width, height)
      break
  }

  return canvas
}

const textureCache = new Map<LayerId, THREE.Texture>()

export function getLayerTexture(id: LayerId, pixelH = 512): THREE.Texture {
  const cached = textureCache.get(id)
  if (cached) return cached

  const aspect =
    id === 'sky' ? 16 / 9 : id === 'boatRim' ? 2.8 : id === 'rock' ? 0.75 : 0.55
  const h = pixelH
  const w = Math.round(h * aspect)
  const canvas = paintLayer(id, w, h)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  textureCache.set(id, tex)
  return tex
}

export function loadSceneTexturesFromUrls(
  baseUrl: string,
): Promise<Partial<Record<LayerId, THREE.Texture>>> {
  const ids: LayerId[] = ['rock', 'qingning', 'laojun', 'flame', 'boatRim']
  const loader = new THREE.TextureLoader()
  return Promise.allSettled(
    ids.map(
      (id) =>
        new Promise<[LayerId, THREE.Texture]>((resolve, reject) => {
          loader.load(
            `${baseUrl}scene/${id}.webp`,
            (tex) => {
              tex.colorSpace = THREE.SRGBColorSpace
              resolve([id, tex])
            },
            undefined,
            () => reject(new Error(`missing ${id}`)),
          )
        }),
    ),
  ).then((results) => {
    const map: Partial<Record<LayerId, THREE.Texture>> = {}
    for (const r of results) {
      if (r.status === 'fulfilled') {
        const [id, tex] = r.value
        map[id] = tex
        textureCache.set(id, tex)
      }
    }
    return map
  })
}
