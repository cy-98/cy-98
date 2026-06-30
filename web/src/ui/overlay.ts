import { LORE } from '../scene/lore'

const DEFAULT_DRIFT_URL = 'https://cy-98.github.io/drift/'

export function mountOverlay(root: HTMLElement): void {
  const specsHref = `${import.meta.env.BASE_URL}specs/index.html`
  const driftHref = import.meta.env.VITE_DRIFT_URL ?? DEFAULT_DRIFT_URL
  const driftSpecHref = `${driftHref.replace(/\/?$/, '/')}spec/`

  root.replaceChildren()
  const inner = document.createElement('div')
  inner.className = 'ui-inner'
  inner.innerHTML = `
    <header class="hero glass">
      <p class="eyebrow">${LORE.place}</p>
      <h1>才越 <span class="handle">@cy-98</span></h1>
      <p class="lead">${LORE.lead}</p>
      <nav class="links" aria-label="主要链接">
        <a href="https://cy-98.github.io/markdown-cv/" target="_blank" rel="noreferrer">简历</a>
        <a href="https://docs.page/cy-98/cy-docs" target="_blank" rel="noreferrer">随笔</a>
        <a href="${driftHref}" target="_blank" rel="noreferrer">漫游</a>
        <a href="https://github.com/cy-98" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </header>
    <section class="panel glass" aria-labelledby="hint-heading">
      <h2 id="hint-heading">操作提示</h2>
      <p class="hint">${LORE.hint}</p>
    </section>
    <footer class="footer glass">
      <p>
        <a href="${driftHref}" target="_blank" rel="noreferrer">Drift 项目</a>
        · <a href="${specsHref}">本站 Spec</a>
        · <a href="${driftSpecHref}" target="_blank" rel="noreferrer">Drift Spec</a>
      </p>
    </footer>
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
