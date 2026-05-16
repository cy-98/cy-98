/**
 * 遗留脚本：曾用于导出 public/scene/*.webp 占位图。当前星夜湖场景为纯代码，无需运行。
 * 运行：npm run export:scene  或  node scripts/export-scene-webp.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public/scene')

const STROKE = '#6eb8e8'
const FILL = '#081828'
const FILL_SOFT = 'rgba(8, 24, 48, 0.92)'

function svgWrap(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c2038"/>
      <stop offset="100%" stop-color="#040c18"/>
    </linearGradient>
    <radialGradient id="flameG" cx="50%" cy="65%" r="55%">
      <stop offset="0%" stop-color="#ffd080" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#ff8830" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="#ff4010" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#040c18" stop-opacity="0"/>
      <stop offset="35%" stop-color="#040c18" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#020810" stop-opacity="0.98"/>
    </linearGradient>
  </defs>
  ${body}
</svg>`
}

function rockSvg(glyph, mirror) {
  const w = 512
  const h = 680
  const g = mirror
    ? `<g transform="translate(${w},0) scale(-1,1)">`
    : '<g>'
  const body = `${g}
    <path d="M 70 640 L 45 320 Q 90 80 256 48 Q 420 72 467 310 L 440 640 Z"
      fill="url(#rockGrad)" stroke="${STROKE}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M 120 520 Q 200 380 256 360 Q 312 380 392 520" fill="none" stroke="${STROKE}" stroke-width="2" opacity="0.35"/>
    <text x="256" y="280" text-anchor="middle" fill="${STROKE}" font-size="128" font-family="serif" font-weight="bold">${glyph}</text>
    <ellipse cx="256" cy="200" rx="90" ry="40" fill="url(#flameG)" opacity="0.35"/>
  </g>`
  return { w, h, svg: svgWrap(w, h, body) }
}

function figureSvg(variant) {
  const w = 400
  const h = 720
  const flip = variant === 'laojun' ? `transform="translate(${w},0) scale(-1,1)"` : ''
  const pipe =
    variant === 'laojun'
      ? `<line x1="220" y1="380" x2="340" y2="360" stroke="${STROKE}" stroke-width="4" stroke-linecap="round"/>`
      : ''
  const body = `<g ${flip}>
    <path d="M 200 700 L 130 380 Q 160 200 210 180 Q 250 170 280 200 L 300 380 L 260 700 Z"
      fill="${FILL_SOFT}" stroke="${STROKE}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 210 200 Q 260 80 310 110" fill="none" stroke="${STROKE}" stroke-width="3"/>
    <circle cx="248" cy="210" r="28" fill="${FILL}" stroke="${STROKE}" stroke-width="3"/>
    ${pipe}
  </g>`
  return { w, h, svg: svgWrap(w, h, body) }
}

function flameSvg() {
  const w = 256
  const h = 256
  const body = `
    <ellipse cx="128" cy="150" rx="100" ry="90" fill="url(#flameG)"/>
    <path d="M 128 30 Q 200 120 128 220 Q 56 120 128 30 Z" fill="#ffb060" opacity="0.85"/>
    <path d="M 128 50 Q 170 110 128 180 Q 86 110 128 50 Z" fill="#ff9040" opacity="0.7"/>
    <path d="M 128 70 Q 150 120 128 150 Q 106 120 128 70 Z" fill="#ffe8c0" opacity="0.9"/>
  `
  return { w, h, svg: svgWrap(w, h, body) }
}

function boatRimSvg() {
  const w = 1024
  const h = 360
  const body = `
    <rect width="${w}" height="${h}" fill="url(#rimGrad)"/>
    <path d="M 0 120 Q 512 40 1024 140" fill="none" stroke="${STROKE}" stroke-width="6" opacity="0.55"/>
    <path d="M 0 200 Q 512 130 1024 220 L 1024 ${h} L 0 ${h} Z" fill="#030810" opacity="0.9"/>
    <path d="M 80 200 Q 512 160 944 210" fill="none" stroke="${STROKE}" stroke-width="3" opacity="0.35"/>
  `
  return { w, h, svg: svgWrap(w, h, body) }
}

function posterSvg() {
  const w = 1920
  const h = 1080
  const body = `
    <rect width="${w}" height="${h}" fill="#030810"/>
    <defs>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#030810"/><stop offset="55%" stop-color="#061428"/><stop offset="100%" stop-color="#0a1e38"/>
      </linearGradient>
      <linearGradient id="lakeG" x1="0" y1="0.5" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a2840"/><stop offset="100%" stop-color="#020810"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#skyG)"/>
    ${Array.from({ length: 80 }, (_, i) => {
      const x = (i * 137) % w
      const y = (i * 89) % 400
      const r = 1 + (i % 3) * 0.4
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="#d0e4ff" opacity="${0.3 + (i % 5) * 0.1}"/>`
    }).join('')}
    <rect y="520" width="${w}" height="560" fill="url(#lakeG)"/>
    <path d="M 680 420 L 800 160 L 920 420 Z" fill="${FILL}" stroke="${STROKE}" stroke-width="4"/>
    <text x="800" y="300" text-anchor="middle" fill="${STROKE}" font-size="96" font-family="serif" font-weight="bold">借</text>
    <ellipse cx="800" cy="360" rx="70" ry="35" fill="url(#flameG)"/>
    <path d="M 1000 420 L 1120 160 L 1240 420 Z" fill="${FILL}" stroke="${STROKE}" stroke-width="4"/>
    <text x="1120" y="300" text-anchor="middle" fill="${STROKE}" font-size="96" font-family="serif" font-weight="bold">火</text>
    <ellipse cx="1120" cy="360" rx="70" ry="35" fill="url(#flameG)"/>
    <ellipse cx="880" cy="500" rx="50" ry="110" fill="${FILL_SOFT}" stroke="${STROKE}" stroke-width="3"/>
    <ellipse cx="1040" cy="490" rx="55" ry="115" fill="${FILL_SOFT}" stroke="${STROKE}" stroke-width="3"/>
    <line x1="1080" y1="420" x2="1180" y2="400" stroke="${STROKE}" stroke-width="3"/>
    <path d="M 0 720 Q 960 640 1920 760 L 1920 1080 L 0 1080 Z" fill="#030810" opacity="0.88"/>
    <path d="M 0 700 Q 960 620 1920 740" fill="none" stroke="${STROKE}" stroke-width="4" opacity="0.45"/>
  `
  return { w, h, svg: svgWrap(w, h, body) }
}

const LAYERS = {
  rockLeft: () => rockSvg('借', false),
  rockRight: () => rockSvg('火', true),
  qingning: () => figureSvg('qingning'),
  laojun: () => figureSvg('laojun'),
  flameLeft: () => flameSvg(),
  flameRight: () => flameSvg(),
  boatRim: () => boatRimSvg(),
  poster: () => posterSvg(),
}

async function exportWebp(name, factory, { alsoLegacy } = {}) {
  const { w, h, svg } = factory()
  const buf = Buffer.from(svg)
  const target = path.join(outDir, `${name}.webp`)
  await sharp(buf)
    .resize(w, h, { fit: 'fill' })
    .webp({ quality: 88, effort: 4, alphaQuality: 90 })
    .toFile(target)
  const stat = fs.statSync(target)
  console.log(`ok ${name}.webp  ${w}x${h}  ${(stat.size / 1024).toFixed(1)} KB`)

  if (alsoLegacy) {
    const legacy = alsoLegacy === true ? name.replace(/Left|Right/, '') : alsoLegacy
    if (legacy && legacy !== name) {
      const legacyPath = path.join(outDir, `${legacy}.webp`)
      fs.copyFileSync(target, legacyPath)
      console.log(`   → copied to ${legacy}.webp`)
    }
  }
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })

  await exportWebp('rockLeft', LAYERS.rockLeft)
  await exportWebp('rockRight', LAYERS.rockRight)
  fs.copyFileSync(path.join(outDir, 'rockLeft.webp'), path.join(outDir, 'rock.webp'))
  console.log('ok rock.webp (from rockLeft, legacy compat)')

  await exportWebp('qingning', LAYERS.qingning)
  await exportWebp('laojun', LAYERS.laojun)
  await exportWebp('flameLeft', LAYERS.flameLeft)
  await exportWebp('flameRight', LAYERS.flameRight)
  fs.copyFileSync(path.join(outDir, 'flameLeft.webp'), path.join(outDir, 'flame.webp'))
  console.log('ok flame.webp (from flameLeft, legacy compat)')

  await exportWebp('boatRim', LAYERS.boatRim)
  await exportWebp('poster', LAYERS.poster)

  console.log('\nDone. Files in public/scene/*.webp')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
