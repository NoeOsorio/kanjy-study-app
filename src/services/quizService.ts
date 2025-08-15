import type { QuizQuestion, QuizMode } from '../types';
import { mockKanjiData } from './kanjiService';

// Generar preguntas del quiz para una lección específica
export const generateQuizQuestions = (lessonId: string, mode: QuizMode): QuizQuestion[] => {
  const lessonKanji = mockKanjiData; // Por ahora usamos todos los kanji
  const questions: QuizQuestion[] = [];

  if (mode === 'mixed') {
    // Para el modo mixto, generar más preguntas (3 por kanji para más variedad)
    lessonKanji.forEach((kanji, index) => {
      for (let i = 0; i < 3; i++) {
        const question = createQuestion(kanji, mode, index * 3 + i);
        if (question) {
          questions.push(question);
        }
      }
    });
  } else {
    // Para modos específicos, una pregunta por kanji
    lessonKanji.forEach((kanji, index) => {
      const question = createQuestion(kanji, mode, index);
      if (question) {
        questions.push(question);
      }
    });
  }

  // Mezclar las preguntas para que no estén en orden
  return shuffleArray(questions);
};

// Crear una pregunta específica según el modo
const createQuestion = (kanji: any, mode: QuizMode, index: number): QuizQuestion | null => {
  const baseId = `q_${kanji.id}_${mode}`;
  
  switch (mode) {
    case 'kanji-to-meaning':
      return {
        id: baseId,
        question: kanji.character,
        correctAnswer: kanji.meaning,
        options: generateMeaningOptions(kanji.meaning, index),
        type: mode,
        kanjiId: kanji.id
      };

    case 'kanji-to-onyomi':
      return {
        id: baseId,
        question: kanji.character,
        correctAnswer: kanji.readings.onyomi[0],
        options: generateOnyomiOptions(kanji.readings.onyomi[0], index),
        type: mode,
        kanjiId: kanji.id
      };

    case 'meaning-to-kanji':
      return {
        id: baseId,
        question: kanji.meaning,
        correctAnswer: kanji.character,
        options: generateKanjiOptions(kanji.character, index),
        type: mode,
        kanjiId: kanji.id
      };

    case 'onyomi-to-kanji':
      return {
        id: baseId,
        question: kanji.readings.onyomi[0],
        correctAnswer: kanji.character,
        options: generateKanjiOptions(kanji.character, index),
        type: mode,
        kanjiId: kanji.id
      };

    case 'kunyomi-to-kanji':
      return {
        id: baseId,
        question: kanji.readings.kunyomi[0],
        correctAnswer: kanji.character,
        options: generateKanjiOptions(kanji.character, index),
        type: mode,
        kanjiId: kanji.id
      };

    case 'mixed':
      // Para el modo mixto, seleccionar un tipo aleatorio para cada pregunta
      const mixedModes: QuizMode[] = ['kanji-to-meaning', 'kanji-to-onyomi', 'meaning-to-kanji', 'onyomi-to-kanji', 'kunyomi-to-kanji'];
      const randomMode = mixedModes[Math.floor(Math.random() * mixedModes.length)];
      return createQuestion(kanji, randomMode, index);

    default:
      return null;
  }
};

// Generar opciones para preguntas de significado
const generateMeaningOptions = (correctMeaning: string, index: number): string[] => {
  const allMeanings = mockKanjiData.map(k => k.meaning);
  const incorrectMeanings = allMeanings.filter(m => m !== correctMeaning);
  
  // Seleccionar 3 significados incorrectos aleatorios
  const shuffled = shuffleArray([...incorrectMeanings]);
  const options = [correctMeaning, ...shuffled.slice(0, 3)];
  
  return shuffleArray(options);
};

// Generar opciones para preguntas de onyomi
const generateOnyomiOptions = (correctOnyomi: string, index: number): string[] => {
  const allOnyomi = mockKanjiData.flatMap(k => k.readings.onyomi);
  const incorrectOnyomi = allOnyomi.filter(o => o !== correctOnyomi);
  
  // Seleccionar 3 onyomi incorrectos aleatorios
  const shuffled = shuffleArray([...incorrectOnyomi]);
  const options = [correctOnyomi, ...shuffled.slice(0, 3)];
  
  return shuffleArray(options);
};

// Generar opciones para preguntas de kanji
const generateKanjiOptions = (correctKanji: string, index: number): string[] => {
  const allKanji = mockKanjiData.map(k => k.character);
  const incorrectKanji = allKanji.filter(k => k !== correctKanji);
  
  // Seleccionar 3 kanji incorrectos aleatorios
  const shuffled = shuffleArray([...incorrectKanji]);
  const options = [correctKanji, ...shuffled.slice(0, 3)];
  
  return shuffleArray(options);
};

// Función para mezclar un array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Obtener el título del modo de quiz
export const getQuizModeTitle = (mode: QuizMode): string => {
  switch (mode) {
    case 'kanji-to-meaning':
      return 'Kanji → Significado';
    case 'kanji-to-onyomi':
      return 'Kanji → Onyomi';
    case 'meaning-to-kanji':
      return 'Significado → Kanji';
    case 'onyomi-to-kanji':
      return 'Onyomi → Kanji';
    case 'kunyomi-to-kanji':
      return 'Kunyomi → Kanji';
    case 'mixed':
      return '🎯 Quiz Mixto';
    default:
      return 'Quiz';
  }
};

// Obtener la descripción del modo de quiz
export const getQuizModeDescription = (mode: QuizMode): string => {
  switch (mode) {
    case 'kanji-to-meaning':
      return 'Ve el kanji y elige su significado en español';
    case 'kanji-to-onyomi':
      return 'Ve el kanji y elige su lectura onyomi';
    case 'meaning-to-kanji':
      return 'Ve el significado en español y elige el kanji correcto';
    case 'onyomi-to-kanji':
      return 'Ve la lectura onyomi y elige el kanji correcto';
    case 'kunyomi-to-kanji':
      return 'Ve la lectura kunyomi y elige el kanji correcto';
    case 'mixed':
      return 'Preguntas aleatorias de todos los tipos para un desafío completo';
    default:
      return 'Pon a prueba tu conocimiento';
    }
};
