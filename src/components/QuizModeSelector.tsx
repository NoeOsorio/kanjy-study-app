import type { QuizMode } from '../types';
import { getQuizModeTitle, getQuizModeDescription } from '../services/quizService';

interface QuizModeSelectorProps {
  onModeSelect: (mode: QuizMode) => void;
  onClose: () => void;
}

export default function QuizModeSelector({ onModeSelect, onClose }: QuizModeSelectorProps) {
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
            <span className="text-2xl font-bold text-purple-700">🎯</span>
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
    <div 
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-2 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-md rounded-3xl max-w-4xl w-full h-[95vh] flex flex-col shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">Selecciona el Modo de Quiz</h2>
              <p className="text-sm sm:text-base text-gray-600">Elige cómo quieres practicar los kanji de esta lección</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quiz Modes Grid */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {quizModes.map((mode) => (
              <button
                key={mode}
                onClick={() => onModeSelect(mode)}
                className={`bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:scale-105 ${getModeColor(mode)}`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    {getModeIcon(mode)}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                    {getQuizModeTitle(mode)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {getQuizModeDescription(mode)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-3xl flex-shrink-0">
          <p className="text-center text-gray-600 text-xs sm:text-sm">
            Cada modo te ayudará a practicar diferentes aspectos de los kanji
          </p>
        </div>
      </div>
    </div>
  );
}
