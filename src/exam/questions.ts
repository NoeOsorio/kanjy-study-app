import type { Kanji, LevelFile, Word } from '../data/types'

export type ModeKind = 'meaning' | 'kanji' | 'reading' | 'byReading' | 'words'
export type Mode = ModeKind | 'mix'

/** Máximo de preguntas de un examen (la hoja de respuestas debe caber en la barra). */
export const MAX_QUESTIONS = 20

export interface ExamOption {
  text: string
  /** Kanji y kana van en Klee One, los significados en Newsreader. */
  script: 'kanji' | 'voice'
}

export interface ExamQuestion {
  id: string
  kind: ModeKind
  char: string
  /** Siempre dice lo que se muestra. */
  prompt: string
  shown: { text: string; script: 'kanji' | 'voice' }
  /** Solo kana, nunca un kanji suelto; ausente cuando oírlo daría la respuesta. */
  speak?: string
  options: ExamOption[]
  correct: number
  /** Palabra o significados para la tarjeta de pista. */
  hint: { word?: Word; meanings: string[] }
}

export interface ExamAnswer {
  chosen: number
  right: boolean
  ms: number
}

export const MODES: { id: Mode; label: string }[] = [
  { id: 'meaning', label: 'Significado' },
  { id: 'kanji', label: 'Kanji' },
  { id: 'reading', label: 'Lectura' },
  { id: 'byReading', label: 'Por lectura' },
  { id: 'words', label: 'Palabras' },
  { id: 'mix', label: 'Mezcla' },
]

const KINDS: ModeKind[] = ['meaning', 'kanji', 'reading', 'byReading', 'words']

function shuffle<T>(a: readonly T[]): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

const kana = (r: string) => r.replace(/[.-]/g, '')
const meaningText = (k: Kanji) => k.meanings.slice(0, 2).join(', ')
const norm = (s: string) => s.trim().toLowerCase()

function allReadings(k: Kanji): Set<string> {
  return new Set([...k.onyomi, ...k.kunyomi].map(kana))
}

function sharesMeaning(a: Kanji, b: Kanji): boolean {
  const s = new Set(a.meanings.map(norm))
  return b.meanings.some((m) => s.has(norm(m)))
}

function hasKind(k: Kanji, kind: ModeKind): boolean {
  if (kind === 'reading' || kind === 'byReading') return k.onyomi.length + k.kunyomi.length > 0
  if (kind === 'words') return k.words.some((w) => w.written.includes(k.char))
  return k.meanings.length > 0
}

/** Cuántos kanji de la selección pueden llevar palabras. */
export function countWithWords(chars: string[], file: LevelFile): number {
  return chars.filter((c) => file.kanji[c] && hasKind(file.kanji[c], 'words')).length
}

function finish(
  kind: ModeKind,
  k: Kanji,
  prompt: string,
  shown: ExamQuestion['shown'],
  correctOpt: ExamOption,
  wrong: ExamOption[],
  extra: Partial<ExamQuestion> = {},
): ExamQuestion | null {
  if (wrong.length < 3) return null
  const opts = shuffle([correctOpt, ...wrong.slice(0, 3)])
  // Nunca el mismo texto dos veces.
  if (new Set(opts.map((o) => o.text)).size !== 4) return null
  return {
    id: `${kind}:${k.char}`,
    kind,
    char: k.char,
    prompt,
    shown,
    options: opts,
    correct: opts.findIndex((o) => o === correctOpt),
    hint: { word: k.words.find((w) => w.written.includes(k.char)), meanings: k.meanings.slice(0, 2) },
    ...extra,
  }
}

function build(kind: ModeKind, k: Kanji, pool: Kanji[]): ExamQuestion | null {
  if (!hasKind(k, kind)) return null
  const others = shuffle(pool.filter((o) => o.char !== k.char))
  const firstReading = [...k.onyomi, ...k.kunyomi].map(kana)[0]

  if (kind === 'meaning') {
    const correct = { text: meaningText(k), script: 'voice' as const }
    const wrong: ExamOption[] = []
    const used = new Set<string>([norm(correct.text)])
    for (const o of others) {
      const t = meaningText(o)
      if (!t || used.has(norm(t)) || sharesMeaning(k, o)) continue
      used.add(norm(t))
      wrong.push({ text: t, script: 'voice' })
      if (wrong.length === 3) break
    }
    return finish(kind, k, '¿Qué significa?', { text: k.char, script: 'kanji' }, correct, wrong, {
      speak: firstReading,
    })
  }

  if (kind === 'kanji') {
    const correct = { text: k.char, script: 'kanji' as const }
    // Parecidos en trazos para que sean plausibles.
    const near = others
      .map((o) => ({ o, d: Math.abs(o.strokeCount - k.strokeCount) + Math.random() * 3 }))
      .sort((a, b) => a.d - b.d)
      .map((x) => x.o)
    const wrong = near
      .filter((o) => !sharesMeaning(k, o))
      .slice(0, 3)
      .map((o) => ({ text: o.char, script: 'kanji' as const }))
    return finish(kind, k, '¿Cuál es el kanji?', { text: meaningText(k), script: 'voice' }, correct, wrong)
  }

  if (kind === 'reading') {
    const useOn = k.onyomi.length > 0 && (k.kunyomi.length === 0 || Math.random() < 0.5)
    const mine = shuffle(useOn ? k.onyomi : k.kunyomi).map(kana)
    const text = mine[0]
    const valid = allReadings(k)
    const wrong: ExamOption[] = []
    const used = new Set<string>([text])
    for (const o of others) {
      for (const r of shuffle((useOn ? o.onyomi : o.kunyomi).map(kana))) {
        if (valid.has(r) || used.has(r)) continue
        used.add(r)
        wrong.push({ text: r, script: 'kanji' })
        break
      }
      if (wrong.length === 3) break
    }
    return finish(kind, k, '¿Cómo se lee?', { text: k.char, script: 'kanji' }, { text, script: 'kanji' }, wrong)
  }

  if (kind === 'byReading') {
    const useOn = k.onyomi.length > 0 && (k.kunyomi.length === 0 || Math.random() < 0.5)
    const text = shuffle((useOn ? k.onyomi : k.kunyomi).map(kana))[0]
    // Ningún distractor puede leerse igual: solo una respuesta correcta.
    const wrong = others
      .filter((o) => !allReadings(o).has(text))
      .slice(0, 3)
      .map((o) => ({ text: o.char, script: 'kanji' as const }))
    return finish(
      kind,
      k,
      '¿Qué kanji se lee así?',
      { text, script: 'kanji' },
      { text: k.char, script: 'kanji' },
      wrong,
      { speak: text },
    )
  }

  // words
  const own = k.words.filter((w) => w.written.includes(k.char))
  // Mejor una palabra de varias letras que el kanji solo.
  const long = own.filter((w) => [...w.written].length > 1)
  const word = shuffle(long.length ? long : own)[0]
  const wordPool = others.flatMap((o) => o.words)
  const used = new Set<string>([word.reading])
  const wrong: ExamOption[] = []
  const ordered = shuffle(wordPool).sort(
    (a, b) => Math.abs(a.reading.length - word.reading.length) - Math.abs(b.reading.length - word.reading.length),
  )
  for (const w of ordered.slice(0, 40)) {
    if (used.has(w.reading) || w.written === word.written) continue
    used.add(w.reading)
    wrong.push({ text: w.reading, script: 'kanji' })
    if (wrong.length === 3) break
  }
  return finish(
    kind,
    k,
    '¿Cómo se lee esta palabra?',
    { text: word.written, script: 'kanji' },
    { text: word.reading, script: 'kanji' },
    wrong,
    { hint: { word, meanings: k.meanings.slice(0, 2) } },
  )
}

/** Una pregunta por kanji elegido, sin repetir; los kanji sin lectura o palabras se saltan. */
export function buildQuestions(mode: Mode, chars: string[], file: LevelFile): ExamQuestion[] {
  const pool = Object.values(file.kanji)
  const picked = shuffle(chars.filter((c) => file.kanji[c])).slice(0, MAX_QUESTIONS * 2)
  const out: ExamQuestion[] = []
  const seen = new Set<string>()
  let turn = 0
  for (const c of picked) {
    if (out.length >= MAX_QUESTIONS) break
    const k = file.kanji[c]
    const order: ModeKind[] = mode === 'mix' ? [...KINDS.slice(turn % 5), ...KINDS.slice(0, turn % 5)] : [mode]
    turn++
    for (const kind of order) {
      const q = build(kind, k, pool)
      if (q && !seen.has(q.id)) {
        seen.add(q.id)
        out.push(q)
        break
      }
    }
  }
  return out
}

export interface ExamSelection {
  chars: string[]
  mode: Mode
}

export function score(answers: ExamAnswer[]): number {
  if (!answers.length) return 0
  return Math.round((answers.filter((a) => a.right).length / answers.length) * 100)
}
