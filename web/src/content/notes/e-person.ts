import type { Note } from '../note'

export const ePerson: Note = {
  slug: 'e-person',
  title: 'E person',
  date: '2025-03-01',
  excerpt: 'I think I was born E, even though I am not good at social contact. Trying anyway.',
  body: [
    {
      type: 'quote',
      text: 'It is popular recently that a person is judged by two types. E person gets satisfaction from others and I person gets it from himself.',
    },
    {
      type: 'p',
      text: 'I think I was born with the E type even though I am not good at social contact. I need others’ laugh, sharing and company. Actually it was a hope for these, and for keeping away from lonely. I am trying to become a classical E person, learning how to chat online, provide emotional value and feel others’ feelings. And finally found I am really not good at these.',
    },
    {
      type: 'p',
      text: 'I am not a good E person for I never chatted with someone online before. Then I found someone never chats with me now. Let me make a plan for how to improve my E skills (now I was a P person).',
    },
    {
      type: 'ul',
      items: [
        'Chat with strangers as much as possible.',
        'Contact schoolmates lost for a long time.',
        'Listen carefully and feel what friends feel when they talk.',
        'Care about family and friends on festivals. Ask if anything needs help.',
      ],
    },
    { type: 'p', text: 'Interesting.' },
  ],
}
