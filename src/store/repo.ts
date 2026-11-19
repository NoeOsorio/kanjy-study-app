import { del, get, getMany, keys, set, values } from 'idb-keyval'
import { cardsStore, daysStore, ensureReady, logsStore, notesStore, settingsStore } from './db'
import type { Note, ReviewCard, ReviewLog, Settings } from './types'

const now = () => new Date().toISOString()

export const DEFAULT_SETTINGS: Settings = { level: 'N5', minutesPerDay: 10, writing: true, sound: true }

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// Cards
export async function getCard(char: string): Promise<ReviewCard | undefined> {
  await ensureReady()
  return get<ReviewCard>(char, cardsStore)
}

export async function putCard(card: ReviewCard): Promise<ReviewCard> {
  await ensureReady()
  const saved = { ...card, updatedAt: now() }
  await set(card.char, saved, cardsStore)
  return saved
}

export async function allCards(): Promise<ReviewCard[]> {
  await ensureReady()
  return values<ReviewCard>(cardsStore)
}

export async function allDueCards(at: Date = new Date()): Promise<ReviewCard[]> {
  const t = at.getTime()
  return (await allCards())
    .filter((c) => new Date(c.fsrs.due).getTime() <= t)
    .sort((a, b) => new Date(a.fsrs.due).getTime() - new Date(b.fsrs.due).getTime())
}

// Logs (device only; keyed by time + char)
export async function addLog(log: ReviewLog): Promise<void> {
  await ensureReady()
  await set(`${log.reviewedAt}|${log.char}`, log, logsStore)
}

export async function logsSince(date: Date): Promise<ReviewLog[]> {
  await ensureReady()
  const t = date.getTime()
  return (await values<ReviewLog>(logsStore))
    .filter((l) => new Date(l.reviewedAt).getTime() >= t)
    .sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt))
}

// Notes
export async function getNote(char: string): Promise<Note | undefined> {
  await ensureReady()
  return get<Note>(char, notesStore)
}

/** Empty text deletes the note. */
export async function putNote(char: string, text: string): Promise<void> {
  await ensureReady()
  if (text.trim() === '') await del(char, notesStore)
  else await set(char, { char, text, updatedAt: now() } satisfies Note, notesStore)
}

export async function allNotes(): Promise<Note[]> {
  await ensureReady()
  return values<Note>(notesStore)
}

// Study days
export async function markStudyDay(date: Date = new Date()): Promise<void> {
  await ensureReady()
  await set(dayKey(date), { date: dayKey(date) }, daysStore)
}

export async function allStudyDays(): Promise<string[]> {
  await ensureReady()
  return keys<string>(daysStore)
}

/** Seven entries, oldest first, ending with `today`. */
export async function lastSevenDays(today: Date = new Date()): Promise<{ date: string; studied: boolean }[]> {
  await ensureReady()
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    dates.push(dayKey(d))
  }
  const found = await getMany<unknown>(dates, daysStore)
  return dates.map((date, i) => ({ date, studied: found[i] !== undefined }))
}

// Settings
export async function getSettings(): Promise<Settings> {
  await ensureReady()
  const saved = await get<Partial<Settings>>('settings', settingsStore)
  return { ...DEFAULT_SETTINGS, ...saved }
}

export async function putSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = { ...(await getSettings()), ...patch }
  await set('settings', { ...next, updatedAt: now() }, settingsStore)
  return next
}

export function newKanjiPerDay(minutes: Settings['minutesPerDay']): number {
  return { 5: 1, 10: 2, 20: 4, 30: 6 }[minutes]
}
