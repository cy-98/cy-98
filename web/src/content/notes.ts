import type { Note } from './note'
import { completeAgentic } from './notes/complete-agentic'
import { ePerson } from './notes/e-person'
import { recap2024 } from './notes/recap-2024'
import { springFestival2025 } from './notes/spring-festival-2025'

/** Newest first. */
export const NOTES: readonly Note[] = [
  completeAgentic,
  springFestival2025,
  ePerson,
  recap2024,
]

export function findNote(slug: string): Note | undefined {
  return NOTES.find((note) => note.slug === slug)
}
