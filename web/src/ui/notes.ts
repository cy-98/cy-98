import { escapeHtml } from '../content/escape'
import { findNote, NOTES } from '../content/notes'
import type { Note, NoteBlock } from '../content/note'

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

function renderBlocks(blocks: readonly NoteBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'p':
          return `<p>${escapeHtml(block.text)}</p>`
        case 'h3':
          return `<h3>${escapeHtml(block.text)}</h3>`
        case 'quote':
          return `<blockquote>${escapeHtml(block.text)}</blockquote>`
        case 'ul':
          return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      }
    })
    .join('')
}

function renderNoteList(): string {
  const items = NOTES.map(
    (note) => `
      <li>
        <a class="note-item" href="#notes/${encodeURIComponent(note.slug)}">
          <time class="note-date" datetime="${note.date}">${formatDate(note.date)}</time>
          <span class="note-title">${escapeHtml(note.title)}</span>
          <span class="note-excerpt">${escapeHtml(note.excerpt)}</span>
        </a>
      </li>`,
  ).join('')

  return `
    <section class="panel panel--list glass" id="notes" aria-labelledby="notes-heading">
      <h2 id="notes-heading">随笔</h2>
      <ul class="note-list">${items}</ul>
    </section>
  `
}

function renderNoteArticle(note: Note): string {
  return `
    <article class="panel panel--list glass note-article" id="notes" aria-labelledby="note-title">
      <p class="note-back"><a href="#notes">返回随笔</a></p>
      <h2 id="note-title">${escapeHtml(note.title)}</h2>
      <time class="note-date" datetime="${note.date}">${formatDate(note.date)}</time>
      <div class="note-body">${renderBlocks(note.body)}</div>
    </article>
  `
}

export function renderNotesPanel(hash: string): string {
  const slug = parseNoteSlug(hash)
  const note = slug ? findNote(slug) : undefined
  return note ? renderNoteArticle(note) : renderNoteList()
}
