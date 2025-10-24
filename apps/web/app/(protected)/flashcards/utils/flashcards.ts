/**
 * Flashcards storage and SRS utilities
 */

export interface Flashcard {
  id: string // `${questionId}:${expectedAnswer}` or custom id
  questionId?: number | string
  lessonId?: string | number
  prompt: string
  expectedAnswer: string
  language?: 'zh-CN' | 'zh-TW' | 'en' | 'auto'
  pinyin?: string
  userLastAnswer?: string
  errors?: any[]
  custom?: boolean
  createdAt?: string

  lastSeen?: string
  timesSeen?: number
  timesCorrect?: number

  deck?: number // Leitner 1..5
  ease?: number
  nextReviewAt?: string
}

const LS_KEY = 'flashcards_v2'

function safeNowISO() {
  try {
    return new Date().toISOString()
  } catch {
    return ''
  }
}

function loadFlashcards(): Flashcard[] {
  if (typeof window === 'undefined') return []
  try {
    const json = localStorage.getItem(LS_KEY)
    return json ? JSON.parse(json) : []
  } catch {
    return []
  }
}

function saveFlashcards(list: Flashcard[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}

function makeId(card: Partial<Flashcard>): string {
  if (card.id) return card.id
  if (card.questionId != null && card.expectedAnswer) {
    return `${card.questionId}:${card.expectedAnswer}`
  }
  return `custom:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`
}

export function addOrUpdateFlashcard(input: Partial<Flashcard>) {
  const list = loadFlashcards()
  const id = makeId(input)
  const now = safeNowISO()
  const idx = list.findIndex(x => x.id === id)

  if (idx >= 0) {
    const cur = list[idx]
    list[idx] = {
      ...cur,
      ...input,
      id,
      lastSeen: now,
      timesSeen: (cur.timesSeen || 0) + 1,
      userLastAnswer: input.userLastAnswer ?? cur.userLastAnswer,
      errors: input.errors ?? cur.errors,
    }
  } else {
    list.unshift({
      id,
      prompt: input.prompt || '',
      expectedAnswer: input.expectedAnswer || '',
      questionId: input.questionId,
      lessonId: input.lessonId,
      language: input.language || 'auto',
      pinyin: input.pinyin,
      userLastAnswer: input.userLastAnswer,
      errors: input.errors || [],
      custom: !!input.custom,
      createdAt: now,
      lastSeen: now,
      timesSeen: 1,
      timesCorrect: 0,
      deck: 1,
      ease: 2.3,
      nextReviewAt: now,
    })
  }
  saveFlashcards(list.slice(0, 500))
}

export function addCustomFlashcard(data: {
  prompt: string
  expectedAnswer: string
  language?: 'zh-CN' | 'zh-TW' | 'en' | 'auto'
  pinyin?: string
}) {
  addOrUpdateFlashcard({ ...data, custom: true })
}

export function removeFlashcardById(id: string) {
  const list = loadFlashcards().filter(x => x.id !== id)
  saveFlashcards(list)
}

function scheduleNext(card: Flashcard, correct: boolean): Flashcard {
  const deck = Math.max(1, Math.min(5, (card.deck || 1) + (correct ? 1 : -1)))
  const base = new Date()
  const intervals = [0, 1, 2, 5, 12, 25] // days
  const days = intervals[deck] ?? 1
  base.setDate(base.getDate() + days)
  return { ...card, deck, nextReviewAt: base.toISOString() }
}

export function markFlashcardResult(id: string, correct: boolean) {
  const list = loadFlashcards()
  const i = list.findIndex(x => x.id === id)
  if (i < 0) return
  let c = list[i]
  c.timesSeen = (c.timesSeen || 0) + 1
  c.timesCorrect = (c.timesCorrect || 0) + (correct ? 1 : 0)
  c.lastSeen = safeNowISO()
  c = scheduleNext(c, correct)
  if (correct && (c.timesCorrect || 0) >= 2 && (c.deck || 1) >= 4) {
    list.splice(i, 1)
  } else {
    list[i] = c
  }
  saveFlashcards(list)
}

export function loadAllFlashcards(): Flashcard[] {
  return loadFlashcards()
}

export function loadDueFlashcards(now = new Date()): Flashcard[] {
  const ts = now.toISOString()
  return loadFlashcards()
    .filter(c => !c.nextReviewAt || c.nextReviewAt <= ts)
    .sort((a, b) => (a.nextReviewAt || '').localeCompare(b.nextReviewAt || ''))
}
