import type { Level, TokenLevel } from './types'

const ORDER: Record<Level, number> = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 }

/** True when the token is above the student's level (N5 lowest, N1 highest). */
export function needsReading(tokenLevel: TokenLevel, studentLevel: Level): boolean {
  if (tokenLevel === 'beyond') return true
  return ORDER[tokenLevel] > ORDER[studentLevel]
}
