import { escapeHtml } from '../content/escape'
import { findNote, NOTES } from '../content/notes'
import type { Note } from '../content/note'

export function parseNoteSlug(hash: string): string | null {
  const match = /^#notes\/([^/]+)$/.exec(hash)
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

function formatDate(iso: string): string {
  const [year, month] = iso.split('-')
  return `${year}.${month}`
}

export function renderHomeNoteList(): string {
  const items = NOTES.map((note) => {
    const href = `#notes/${encodeURIComponent(note.slug)}`
    return `
      <li>
        <a class="note-item" href="${href}">
          <time class="note-date" datetime="${note.date}">${formatDate(note.date)}</time>
          <span class="note-title">${escapeHtml(note.title)}</span>
        </a>
      </li>`
  }).join('')

  return `
    <section class="home-notes" id="notes" aria-labelledby="notes-heading">
      <h2 id="notes-heading">随笔</h2>
      <ul class="note-list">${items}</ul>
    </section>
  `
}

export function renderNoteArticle(note: Note): string {
  return `
    <article class="panel panel--list glass note-article" aria-labelledby="note-title">
      <p class="note-back"><a href="#notes">返回列表</a></p>
      <h2 id="note-title">${escapeHtml(note.title)}</h2>
      <time class="note-date" datetime="${note.date}">${formatDate(note.date)}</time>
      <div class="note-body">${note.bodyHtml}</div>
    </article>
  `
}

export function articleFromHash(hash: string): Note | undefined {
  const slug = parseNoteSlug(hash)
  return slug ? findNote(slug) : undefined
}
