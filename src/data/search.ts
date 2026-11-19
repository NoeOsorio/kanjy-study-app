import type { Level, SearchRow } from './types'

let indexPromise: Promise<SearchRow[]> | null = null

export function loadSearchIndex(): Promise<SearchRow[]> {
  if (!indexPromise) {
    indexPromise = fetch('/data/search.json')
      .then((r) => {
        if (!r.ok) throw new Error(`search index: ${r.status}`)
        return r.json() as Promise<SearchRow[]>
      })
      .catch((e) => {
        indexPromise = null
        throw e
      })
  }
  return indexPromise
}

export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .trim()
}

/** Splits an index field into comparable terms, dropping okurigana marks. */
function terms(field: string): string[] {
  return field
    .split(/[,;、，\s/]+/)
    .map((t) => normalize(t.replace(/[.-]/g, '')))
    .filter(Boolean)
}

export interface SearchResult {
  char: string
  level: Level
  meanings: string
  score: number
}

function scoreTerms(list: string[], q: string, exact: number, start: number, contains: number): number {
  let best = 0
  for (const t of list) {
    if (t === q) return exact
    if (t.startsWith(q)) best = Math.max(best, start)
    else if (q.length >= 2 && t.includes(q)) best = Math.max(best, contains)
    else if (t.split(/\s+/).some((w) => w.startsWith(q))) best = Math.max(best, start - 5)
  }
  return best
}

export async function search(query: string, opts: { level?: Level } = {}): Promise<SearchResult[]> {
  const raw = query.trim()
  if (!raw) return []
  const q = normalize(raw)
  const rows = await loadSearchIndex()
  const out: SearchResult[] = []
  for (const [char, level, meanings, kana, romaji] of rows) {
    if (opts.level && level !== opts.level) continue
    let score = 0
    if (raw === char) score = 1000
    else if (raw.includes(char)) score = 400
    else {
      const m = scoreTerms(meanings.split(/[,;]/).map((x) => normalize(x)), q, 900, 700, 300)
      const k = scoreTerms(terms(kana), q, 850, 650, 250)
      const r = scoreTerms(terms(romaji), q, 800, 600, 200)
      score = Math.max(m, k, r)
    }
    if (score > 0) out.push({ char, level, meanings, score })
  }
  return out.sort((a, b) => b.score - a.score)
}
