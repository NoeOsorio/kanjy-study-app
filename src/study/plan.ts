import { loadLevel } from '../data/levels'
import { allCards, getSettings, isStudied, logsSince, newKanjiPerDay } from '../store/repo'
import type { Level } from '../data/types'

export interface TodayPlan {
  level: Level
  /** Chars due now, earliest due first. */
  due: string[]
  /** Next unlearned kanji of the level, in lesson order, capped by what is left of today's allowance. */
  newKanji: string[]
  currentLesson: number | null
  /** Earliest future due date; null when there are no cards. */
  nextReviewAt: Date | null
  isFirstDay: boolean
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Chars whose very first review happened today (so they count as introduced today). */
async function introducedToday(now: Date): Promise<number> {
  const all = await logsSince(new Date(0))
  const start = startOfDay(now).getTime()
  const first = new Map<string, number>()
  for (const l of all) {
    const t = new Date(l.reviewedAt).getTime()
    if (!first.has(l.char) || t < first.get(l.char)!) first.set(l.char, t)
  }
  let n = 0
  for (const t of first.values()) if (t >= start && t <= now.getTime()) n++
  return n
}

export async function todayPlan(now: Date = new Date()): Promise<TodayPlan> {
  const settings = await getSettings()
  const [file, cards, introduced] = await Promise.all([
    loadLevel(settings.level),
    allCards(),
    introducedToday(now),
  ])
  const t = now.getTime()
  const byDue = [...cards].sort((a, b) => new Date(a.fsrs.due).getTime() - new Date(b.fsrs.due).getTime())
  const due = byDue.filter((c) => new Date(c.fsrs.due).getTime() <= t).map((c) => c.char)
  const future = byDue.find((c) => new Date(c.fsrs.due).getTime() > t)
  const known = new Set(cards.filter(isStudied).map((c) => c.char))

  const unlearned: { char: string; lesson: number }[] = []
  for (const lesson of file.lessons) {
    for (const char of lesson.kanji) if (!known.has(char)) unlearned.push({ char, lesson: lesson.number })
  }
  const count = Math.max(0, newKanjiPerDay(settings.minutesPerDay) - introduced)
  const next = unlearned.slice(0, count)

  return {
    level: settings.level,
    due,
    newKanji: next.map((u) => u.char),
    currentLesson: unlearned[0]?.lesson ?? null,
    nextReviewAt: future ? new Date(future.fsrs.due) : null,
    isFirstDay: cards.length === 0,
  }
}
