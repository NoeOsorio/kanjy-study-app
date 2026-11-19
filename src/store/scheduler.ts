import { createEmptyCard, fsrs, Rating as R } from 'ts-fsrs'
import type { Card, Grade } from 'ts-fsrs'
import type { ReviewCard, ReviewLog, Rating } from './types'

const f = fsrs()

const GRADE: Record<Rating, Grade> = { again: R.Again, hard: R.Hard, good: R.Good, easy: R.Easy }
const RATINGS: Rating[] = ['again', 'hard', 'good', 'easy']

export function newCard(char: string, addedFrom: ReviewCard['addedFrom'] = 'lesson', at = new Date()): ReviewCard {
  return { char, fsrs: createEmptyCard(at), addedFrom, updatedAt: at.toISOString() }
}

export function intervalLabel(from: Date, due: Date): string {
  const min = Math.max(1, Math.round((due.getTime() - from.getTime()) / 60000))
  if (min < 60) return `${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return h === 1 ? '1 hora' : `${h} horas`
  const d = Math.round(min / 1440)
  if (d < 30) return d === 1 ? '1 día' : `${d} días`
  const mo = Math.round(d / 30)
  if (mo < 12) return mo === 1 ? '1 mes' : `${mo} meses`
  const y = Math.round((d / 365) * 10) / 10
  return y === 1 ? '1 año' : `${String(y).replace('.', ',')} años`
}

export interface Preview {
  due: Date
  label: string
}

/** Next due date and short label for each of the four buttons. */
export function preview(card: ReviewCard, at: Date = new Date()): Record<Rating, Preview> {
  const rec = f.repeat(card.fsrs, at)
  const out = {} as Record<Rating, Preview>
  for (const r of RATINGS) {
    const due = rec[GRADE[r]].card.due
    out[r] = { due, label: intervalLabel(at, due) }
  }
  return out
}

export function rate(
  card: ReviewCard,
  rating: Rating,
  at: Date = new Date(),
  elapsedMs = 0,
): { card: ReviewCard; log: ReviewLog } {
  const res = f.next(card.fsrs, at, GRADE[rating]) as { card: Card }
  return {
    card: { ...card, fsrs: res.card, updatedAt: at.toISOString() },
    log: { char: card.char, rating, reviewedAt: at.toISOString(), elapsedMs },
  }
}
