import { LORE } from '../scene/lore'
import { articleFromHash, renderHomeNoteList, renderNoteArticle } from './notes'

const DEFAULT_DRIFT_URL = 'https://cy-98.github.io/drift/'

export function mountOverlay(root: HTMLElement): void {
  const driftHref = import.meta.env.VITE_DRIFT_URL ?? DEFAULT_DRIFT_URL

  root.replaceChildren()
  const inner = document.createElement('div')
  inner.className = 'ui-inner'
  inner.innerHTML = `
    <header class="hero glass">
      <p class="eyebrow">${LORE.place}</p>
      <h1>
        <a class="brand" href="#notes">才越 <span class="handle">@cy-98</span></a>
      </h1>
      <div class="hero-stack">
        <nav class="links" aria-label="主要链接">
          <a href="https://cy-98.github.io/markdown-cv/" target="_blank" rel="noreferrer">简历</a>
          <a href="#notes">随笔</a>
          <a href="${driftHref}" target="_blank" rel="noreferrer">漫游</a>
          <a href="https://github.com/cy-98" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
        ${renderHomeNoteList()}
      </div>
    </header>
    <div data-article-root></div>
  `

  root.appendChild(inner)

  const articleRoot = inner.querySelector<HTMLElement>('[data-article-root]')
  const notesSection = inner.querySelector<HTMLElement>('.home-notes')
  if (!articleRoot) {
    throw new Error('Missing article root')
  }

  const renderArticle = (scrollToArticle: boolean) => {
    const note = articleFromHash(window.location.hash)
    const reading = Boolean(note)
    root.classList.toggle('is-reading', reading)
    if (notesSection) {
      notesSection.hidden = reading
    }
    articleRoot.innerHTML = note ? renderNoteArticle(note) : ''
    if (scrollToArticle && note) {
      window.scrollTo({ top: 0 })
    }
  }

  renderArticle(false)
  window.addEventListener('hashchange', () => renderArticle(true))

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
