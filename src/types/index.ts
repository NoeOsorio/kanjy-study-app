export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  experience: number;
  streak: number;
  avatar?: string;
}

export interface Kanji {
  id: string;
  character: string;
  meaning: string;
  readings: {
    onyomi: string[];
    kunyomi: string[];
  };
  strokeCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  examples: string[];
  // Información adicional para la lección
  radicals?: string[];
  frequency?: number;
  grade?: number; // Grado escolar en Japón
}

export interface KanjiExample {
  japanese: string;
  romaji: string;
  english: string;
  spanish?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export type QuizMode = 
  | 'kanji-to-meaning'      // Kanji → 4 opciones en español
  | 'kanji-to-onyomi'       // Kanji → 4 opciones en onyomi
  | 'meaning-to-kanji'      // Español → 4 opciones de kanji
  | 'onyomi-to-kanji'       // Onyomi → 4 opciones de kanji
  | 'kunyomi-to-kanji'      // Kunyomi → 4 opciones de kanji
  | 'mixed';                 // Modo mixto con todos los tipos

export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  type: QuizMode;
  kanjiId: string;
}

export interface QuizResult {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  kanjiList: string[]; // Array of kanji IDs
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  estimatedTime: number; // in minutes
  isCompleted: boolean;
  progress: number; // 0-100
}

export interface Progress {
  userId: string;
  kanjiId: string;
  masteryLevel: number; // 0-5
  lastPracticed: Date;
  correctAnswers: number;
  totalAttempts: number;
}

export type NavigationTab = 'home' | 'lessons' | 'practice' | 'profile';
