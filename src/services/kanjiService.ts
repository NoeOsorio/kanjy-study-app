import type { Kanji, KanjiExample, Lesson } from '../types';

// Cargar todas las lecciones JSON desde src/data/lessons usando Vite import.meta.glob
// Estructura esperada del JSON: { id, title, description, ... , kanji: Kanji[], examples: Record<string, KanjiExample[]> }
const lessonsModules = import.meta.glob('../data/lessons/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;

type LoadedLesson = {
  id: string;
  title: string;
  description: string;
  difficulty: Lesson['difficulty'];
  jlptLevel: Lesson['jlptLevel'];
  estimatedTime: number;
  isCompleted: boolean;
  progress: number;
  kanji: Kanji[];
  examples?: Record<string, KanjiExample[]>;
};

function isLoadedLesson(value: unknown): value is LoadedLesson {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.id === 'string' && Array.isArray(obj.kanji);
}

const loadedLessons: LoadedLesson[] = Object.values(lessonsModules).filter(isLoadedLesson);

const lessonIdToLesson: Record<string, LoadedLesson> = loadedLessons.reduce((acc, lesson) => {
  if (lesson && typeof lesson.id === 'string') {
    acc[lesson.id] = lesson as LoadedLesson;
  }
  return acc;
}, {} as Record<string, LoadedLesson>);

// Mock data para los kanji de la primera lección
export const mockKanjiData: Kanji[] = [
  {
    id: '1',
    character: '日',
    meaning: 'sol, día',
    readings: {
      onyomi: ['ニチ', 'ジツ'],
      kunyomi: ['ひ', '-び', '-か']
    },
    strokeCount: 4,
    difficulty: 'beginner',
    jlptLevel: 'N5',
    examples: ['日本', '今日', '明日'],
    radicals: ['日'],
    frequency: 1,
    grade: 1
  },
  {
    id: '2',
    character: '月',
    meaning: 'luna, mes',
    readings: {
      onyomi: ['ゲツ', 'ガツ'],
      kunyomi: ['つき']
    },
    strokeCount: 4,
    difficulty: 'beginner',
    jlptLevel: 'N5',
    examples: ['月曜日', '一ヶ月', '月見'],
    radicals: ['月'],
    frequency: 2,
    grade: 1
  },
  {
    id: '3',
    character: '火',
    meaning: 'fuego',
    readings: {
      onyomi: ['カ'],
      kunyomi: ['ひ', '-び', 'ほ-']
    },
    strokeCount: 4,
    difficulty: 'beginner',
    jlptLevel: 'N5',
    examples: ['火曜日', '火山', '火事'],
    radicals: ['火'],
    frequency: 3,
    grade: 1
  },
  {
    id: '4',
    character: '水',
    meaning: 'agua',
    readings: {
      onyomi: ['スイ'],
      kunyomi: ['みず']
    },
    strokeCount: 4,
    difficulty: 'beginner',
    jlptLevel: 'N5',
    examples: ['水曜日', '水泳', '水道'],
    radicals: ['水'],
    frequency: 4,
    grade: 1
  },
  {
    id: '5',
    character: '木',
    meaning: 'árbol, madera',
    readings: {
      onyomi: ['ボク', 'モク'],
      kunyomi: ['き', 'こ-']
    },
    strokeCount: 4,
    difficulty: 'beginner',
    jlptLevel: 'N5',
    examples: ['木曜日', '木造', '木製'],
    radicals: ['木'],
    frequency: 5,
    grade: 1
  }
];

// Ejemplos de frases para cada kanji
export const mockKanjiExamples: Record<string, KanjiExample[]> = {
  '日': [
    {
      japanese: '今日は良い天気です。',
      romaji: 'Kyou wa ii tenki desu.',
      english: 'Today is good weather.',
      difficulty: 'beginner'
    },
    {
      japanese: '日本に行きたいです。',
      romaji: 'Nihon ni ikitai desu.',
      english: 'I want to go to Japan.',
      difficulty: 'beginner'
    },
    {
      japanese: '明日は忙しいです。',
      romaji: 'Ashita wa isogashii desu.',
      english: 'Tomorrow I am busy.',
      difficulty: 'beginner'
    }
  ],
  '月': [
    {
      japanese: '月がきれいです。',
      romaji: 'Tsuki ga kirei desu.',
      english: 'The moon is beautiful.',
      difficulty: 'beginner'
    },
    {
      japanese: '月曜日に会いましょう。',
      romaji: 'Getsuyoubi ni aimashou.',
      english: 'Let\'s meet on Monday.',
      difficulty: 'beginner'
    },
    {
      japanese: '一ヶ月日本語を勉強しています。',
      romaji: 'Ikkagetsu nihongo wo benkyou shiteimasu.',
      english: 'I have been studying Japanese for one month.',
      difficulty: 'intermediate'
    }
  ],
  '火': [
    {
      japanese: '火曜日にテストがあります。',
      romaji: 'Kayoubi ni tesuto ga arimasu.',
      english: 'There is a test on Tuesday.',
      difficulty: 'beginner'
    },
    {
      japanese: '火山が噴火しました。',
      romaji: 'Kazan ga funka shimashita.',
      english: 'The volcano erupted.',
      difficulty: 'intermediate'
    },
    {
      japanese: '火事が起きました。',
      romaji: 'Kaji ga okimashita.',
      english: 'A fire broke out.',
      difficulty: 'intermediate'
    }
  ],
  '水': [
    {
      japanese: '水曜日に映画を見ます。',
      romaji: 'Suiyoubi ni eiga wo mimasu.',
      english: 'I will watch a movie on Wednesday.',
      difficulty: 'beginner'
    },
    {
      japanese: '水泳が好きです。',
      romaji: 'Suiei ga suki desu.',
      english: 'I like swimming.',
      difficulty: 'beginner'
    },
    {
      japanese: '水道の水を飲みます。',
      romaji: 'Suidou no mizu wo nomimasu.',
      english: 'I drink tap water.',
      difficulty: 'intermediate'
    }
  ],
  '木': [
    {
      japanese: '木曜日に買い物に行きます。',
      romaji: 'Mokuyoubi ni kaimono ni ikimasu.',
      english: 'I will go shopping on Thursday.',
      difficulty: 'beginner'
    },
    {
      japanese: '木造の家に住んでいます。',
      romaji: 'Mokuzou no ie ni sundeimasu.',
      english: 'I live in a wooden house.',
      difficulty: 'intermediate'
    },
    {
      japanese: '木製のテーブルを買いました。',
      romaji: 'Mokusei no teeburu wo kaimashita.',
      english: 'I bought a wooden table.',
      difficulty: 'intermediate'
    }
  ]
};

// Helpers basados en datos JSON (con fallback a mocks)

// Obtener lista de lecciones disponibles (solo metadatos básicos)
export const getAvailableLessons = (): Array<Pick<Lesson, 'id' | 'title' | 'description' | 'difficulty' | 'jlptLevel' | 'estimatedTime' | 'isCompleted' | 'progress'>> => {
  return loadedLessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    difficulty: lesson.difficulty,
    jlptLevel: lesson.jlptLevel,
    estimatedTime: lesson.estimatedTime,
    isCompleted: lesson.isCompleted,
    progress: lesson.progress
  }));
};

// Obtener kanji por ID (busca primero en lecciones cargadas, luego en mock)
export const getKanjiById = (id: string): Kanji | undefined => {
  // IDs compuestos: <lessonId>:<kanjiId>
  if (id.includes(':')) {
    const [lessonId, innerId] = id.split(':');
    const lesson = lessonIdToLesson[lessonId];
    if (lesson) {
      return lesson.kanji.find(k => k.id === innerId);
    }
  }
  // Compatibilidad: buscar por id simple en lecciones cargadas
  for (const lesson of loadedLessons) {
    const found = lesson.kanji.find(k => k.id === id);
    if (found) return found;
  }
  // Fallback: mocks
  return mockKanjiData.find(kanji => kanji.id === id);
};

// Función para obtener ejemplos de un kanji
export const getKanjiExamples = (character: string): KanjiExample[] => {
  for (const lesson of loadedLessons) {
    const ex = lesson.examples?.[character];
    if (ex && ex.length) return ex;
  }
  return mockKanjiExamples[character] || [];
};

// Función para obtener todos los kanji de una lección
export const getLessonKanji = (lessonId: string): Kanji[] => {
  const lesson = lessonIdToLesson[lessonId];
  if (lesson) {
    // Devolver IDs compuestos para evitar colisiones entre lecciones
    return lesson.kanji.map(k => ({ ...k, id: `${lessonId}:${k.id}` }));
  }
  // Fallback mocks (IDs simples)
  return mockKanjiData;
};

export const hasJsonLessons = (): boolean => loadedLessons.length > 0;