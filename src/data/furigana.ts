import type { Level, Sentence, Token, TokenLevel } from './types'

const ORDER: Record<Level, number> = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 }

/** True when the token is above the student's level (N5 lowest, N1 highest). */
export function needsReading(tokenLevel: TokenLevel, studentLevel: Level): boolean {
  if (tokenLevel === 'beyond') return true
  return ORDER[tokenLevel] > ORDER[studentLevel]
}

/** Tokens of a sentence with the highest level of the kanji inside each token. */
export function sentenceTokens(s: Sentence): Token[] {
  return s.reading.map(([text, reading]) => {
    let level: TokenLevel | undefined
    for (const ch of text) {
      const l = s.kanjiLevels[ch]
      if (!l) continue
      if (!level || l === 'beyond' || (level !== 'beyond' && ORDER[l] > ORDER[level])) level = l
    }
    return { text, reading, level }
  })
}
