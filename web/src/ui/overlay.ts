import { LORE } from '../scene/lore'

const DEFAULT_DRIFT_URL = 'https://cy-98.github.io/drift/'

export function mountOverlay(root: HTMLElement): void {
  const driftHref = import.meta.env.VITE_DRIFT_URL ?? DEFAULT_DRIFT_URL

  root.replaceChildren()
  const inner = document.createElement('div')
  inner.className = 'ui-inner'
  inner.innerHTML = `
    <header class="hero glass">
      <p class="eyebrow">${LORE.place}</p>
      <h1>才越 <span class="handle">@cy-98</span></h1>
      <nav class="links" aria-label="主要链接">
        <a href="https://cy-98.github.io/markdown-cv/" target="_blank" rel="noreferrer">简历</a>
        <a href="https://docs.page/cy-98/cy-docs" target="_blank" rel="noreferrer">随笔</a>
        <a href="${driftHref}" target="_blank" rel="noreferrer">漫游</a>
        <a href="https://github.com/cy-98" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </header>
  `

  root.appendChild(inner)

  let idleTimer = 0
  const onActivity = () => {
    inner.classList.remove('ui-inner--idle')
    window.clearTimeout(idleTimer)
    idleTimer = window.setTimeout(() => inner.classList.add('ui-inner--idle'), 4500)
  }
  window.addEventListener('pointermove', onActivity, { passive: true })
  window.addEventListener('keydown', onActivity)
  onActivity()
}
