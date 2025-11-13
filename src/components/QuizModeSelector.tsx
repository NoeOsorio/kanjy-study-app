import type { QuizMode } from '../types';
import { getQuizModeTitle, getQuizModeDescription } from '../services/quizService';

interface QuizModeSelectorProps {
  onModeSelect: (mode: QuizMode) => void;
}

export default function QuizModeSelector({ onModeSelect }: QuizModeSelectorProps) {
  const quizModes: QuizMode[] = [
    'kanji-to-meaning',
    'kanji-to-onyomi',
    'meaning-to-kanji',
    'onyomi-to-kanji',
    'kunyomi-to-kanji',
    'mixed'
  ];

  const getModeIcon = (mode: QuizMode) => {
    switch (mode) {
      case 'kanji-to-meaning':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border-2 border-blue-300">
            <span className="text-2xl font-bold text-blue-700">漢</span>
          </div>
        );
      case 'kanji-to-onyomi':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center border-2 border-green-300">
            <span className="text-2xl font-bold text-green-700">音</span>
          </div>
        );
      case 'meaning-to-kanji':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center border-2 border-purple-300">
            <span className="text-2xl font-bold text-purple-700">A</span>
          </div>
        );
      case 'onyomi-to-kanji':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center border-2 border-orange-300">
            <span className="text-2xl font-bold text-orange-700">音</span>
          </div>
        );
      case 'kunyomi-to-kanji':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center border-2 border-red-300">
            <span className="text-2xl font-bold text-red-700">訓</span>
          </div>
        );
      case 'mixed':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-200 rounded-xl flex items-center justify-center border-2 border-purple-300">
            <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getModeColor = (mode: QuizMode) => {
    switch (mode) {
      case 'kanji-to-meaning':
        return 'hover:border-blue-300 hover:shadow-blue-100';
      case 'kanji-to-onyomi':
        return 'hover:border-green-300 hover:shadow-green-100';
      case 'meaning-to-kanji':
        return 'hover:border-purple-300 hover:shadow-purple-100';
      case 'onyomi-to-kanji':
        return 'hover:border-orange-300 hover:shadow-orange-100';
      case 'kunyomi-to-kanji':
        return 'hover:border-red-300 hover:shadow-red-100';
      case 'mixed':
        return 'hover:border-purple-300 hover:shadow-purple-100';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Selecciona el Modo de Quiz</h2>
        <p className="text-gray-600">Elige cómo quieres practicar los kanji</p>
      </div>

      {/* Quiz Modes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizModes.map((mode) => (
          <button
            key={mode}
            onClick={() => onModeSelect(mode)}
            className={`
              bg-white rounded-2xl p-6 border-2 border-gray-100 
              transition-colors cursor-pointer
              shadow-sm ${getModeColor(mode)}
            `}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {getModeIcon(mode)}
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {getQuizModeTitle(mode)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {getQuizModeDescription(mode)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <h3 className="font-bold text-gray-800 mb-2">Consejo</h3>
          <p className="text-sm text-gray-600">
            Comienza con "Kanji → Significado" si eres principiante, o prueba el "Quiz Mixto" para un desafío completo.
          </p>
        </div>
      </div>
    </div>
  );
}