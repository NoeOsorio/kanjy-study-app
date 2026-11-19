import { addLog, getCard, markStudyDay, putCard, allCards } from '../store/repo'
import { newCard, preview as previewCard, rate } from '../store/scheduler'
import type { Rating, ReviewCard } from '../store/types'
import type { TodayPlan } from './plan'

export type StepKind = 'review' | 'new'
export interface Step {
  char: string
  kind: StepKind
}
export interface Summary {
  reviewed: number
  minutes: number
  costaron: string[]
  tomorrow: string[]
}
export type ButtonLabels = Record<Rating, string>

const AGAIN_GAP = 3

export interface Session {
  current(): Step | null
  preview(): ButtonLabels | null
  answer(rating: Rating, elapsedMs: number): Promise<void>
  done(): boolean
  /** Items left in the queue, current included. */
  remaining(): number
  summary(): Promise<Summary>
}

/** Builds a session from the plan: due reviews first, then new kanji. `clock` is injectable for tests. */
export async function createSession(plan: Pick<TodayPlan, 'due' | 'newKanji'>, clock: () => Date = () => new Date()): Promise<Session> {
  const queue: Step[] = [
    ...plan.due.map((char): Step => ({ char, kind: 'review' })),
    ...plan.newKanji.map((char): Step => ({ char, kind: 'new' })),
  ]
  const cards = new Map<string, ReviewCard>()
  for (const s of queue) {
    if (s.kind === 'review') {
      const c = await getCard(s.char)
      if (c) cards.set(s.char, c)
    }
  }
  const reviewed = new Set<string>()
  const failed = new Set<string>()
  let elapsedTotal = 0

  const cardFor = (s: Step): ReviewCard => cards.get(s.char) ?? newCard(s.char, 'lesson', clock())

  return {
    current: () => queue[0] ?? null,
    preview() {
      const s = queue[0]
      if (!s) return null
      const p = previewCard(cardFor(s), clock())
      return { again: p.again.label, hard: p.hard.label, good: p.good.label, easy: p.easy.label }
    },
    async answer(rating, elapsedMs) {
      const s = queue.shift()
      if (!s) return
      const at = clock()
      const { card, log } = rate(cardFor(s), rating, at, elapsedMs)
      const saved = await putCard(card)
      cards.set(s.char, saved)
      await addLog(log)
      await markStudyDay(at)
      reviewed.add(s.char)
      elapsedTotal += elapsedMs
      if (rating === 'again') {
        failed.add(s.char)
        queue.splice(Math.min(AGAIN_GAP, queue.length), 0, { char: s.char, kind: 'review' })
      }
    },
    done: () => queue.length === 0,
    remaining: () => queue.length,
    async summary() {
      const endTomorrow = clock()
      endTomorrow.setHours(23, 59, 59, 999)
      endTomorrow.setDate(endTomorrow.getDate() + 1)
      const tomorrow = (await allCards())
        .filter((c) => new Date(c.fsrs.due).getTime() <= endTomorrow.getTime())
        .map((c) => c.char)
      return {
        reviewed: reviewed.size,
        minutes: Math.max(1, Math.round(elapsedTotal / 60000)),
        costaron: [...failed],
        tomorrow,
      }
    },
  }
}
