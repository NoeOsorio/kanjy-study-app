import type { Kanji, Level, LevelFile } from './types'
import { loadSearchIndex } from './search'

export const LEVELS: Level[] = ['N5', 'N4', 'N3', 'N2', 'N1']

const cache = new Map<Level, Promise<LevelFile>>()
const loaded = new Map<Level, LevelFile>()

export function loadLevel(level: Level): Promise<LevelFile> {
  let p = cache.get(level)
  if (!p) {
    p = fetch(`/data/levels/${level.toLowerCase()}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`level ${level}: ${r.status}`)
        return r.json() as Promise<LevelFile>
      })
      .then((f) => {
        loaded.set(level, f)
        return f
      })
    p.catch(() => cache.delete(level))
    cache.set(level, p)
  }
  return p
}

/** Finds a kanji; null when it is not in the data. */
export async function getKanji(char: string): Promise<Kanji | null> {
  for (const f of loaded.values()) {
    const k = f.kanji[char]
    if (k) return k
  }
  const rows = await loadSearchIndex()
  const row = rows.find((r) => r[0] === char)
  if (!row) return null
  const file = await loadLevel(row[1])
  return file.kanji[char] ?? null
}

export function strokeUrl(char: string): string {
  const hex = (char.codePointAt(0) ?? 0).toString(16).toLowerCase().padStart(5, '0')
  return `/data/strokes/${hex}.svg`
}
