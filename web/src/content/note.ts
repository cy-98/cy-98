export type NoteBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'ul'; items: string[] }

export type Note = {
  slug: string
  title: string
  date: string
  excerpt: string
  body: readonly NoteBlock[]
}
