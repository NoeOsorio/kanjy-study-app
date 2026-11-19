export type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
export type TokenLevel = Level | 'beyond'

export interface Word {
  written: string
  reading: string
  meaning: string
  level: Level
}

export interface Token {
  text: string
  reading?: string
  level?: TokenLevel
}

export interface Sentence {
  ja: string
  es: string
  tokens: Token[]
}

export interface Kanji {
  char: string
  level: Level
  frequencyRank: number | null
  grade: number | null
  difficulty: 1 | 2 | 3
  meanings: string[]
  onyomi: string[]
  kunyomi: string[]
  strokeCount: number
  words: Word[]
  sentences: Sentence[]
  lesson: number
}

export interface Lesson {
  level: Level
  number: number
  kanji: string[]
}

export interface LevelFile {
  level: Level
  lessons: Lesson[]
  kanji: Record<string, Kanji>
}

/** [char, level, meanings joined, kana readings, romaji readings] */
export type SearchRow = [string, Level, string, string, string]
