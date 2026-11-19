import type { CardInput } from 'ts-fsrs'
import type { Level } from '../data/types'

export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface ReviewCard {
  char: string
  fsrs: CardInput
  addedFrom: 'lesson' | 'search' | 'exam'
  updatedAt: string
}

export interface ReviewLog {
  char: string
  rating: Rating
  reviewedAt: string
  elapsedMs: number
}

export interface Note {
  char: string
  text: string
  updatedAt: string
}

export interface StudyDay {
  date: string
}

export interface Settings {
  level: Level
  minutesPerDay: 5 | 10 | 20 | 30
  writing: boolean
  sound: boolean
  name?: string
}
