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
