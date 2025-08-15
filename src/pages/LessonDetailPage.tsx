import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Kanji, KanjiExample, QuizMode, QuizQuestion, QuizResult } from '../types';
import { getLessonKanji, getKanjiExamples } from '../services/kanjiService';
import { generateQuizQuestions } from '../services/quizService';
import QuizModeSelector from '../components/QuizModeSelector';
import Quiz from '../components/Quiz';
import QuizResults from '../components/QuizResults';

export default function LessonDetailPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);
  const [selectedKanjiExamples, setSelectedKanjiExamples] = useState<KanjiExample[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Quiz states
  const [showQuizModeSelector, setShowQuizModeSelector] = useState(false);
  const [currentQuizMode, setCurrentQuizMode] = useState<QuizMode | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    // Simular carga de datos del backend
    const loadLessonData = () => {
      const kanji = getLessonKanji(lessonId || '1');
      setKanjiList(kanji);
    };

    loadLessonData();
  }, [lessonId]);

  const handleKanjiClick = (kanji: Kanji) => {
    const examples = getKanjiExamples(kanji.character);
    setSelectedKanji(kanji);
    setSelectedKanjiExamples(examples);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedKanji(null);
    setSelectedKanjiExamples([]);
  };

  // Quiz functions
  const handlePracticeClick = () => {
    setShowQuizModeSelector(true);
  };

  const handleQuizModeSelect = (mode: QuizMode) => {
    setCurrentQuizMode(mode);
    setShowQuizModeSelector(false);
    
    // Generate questions for the selected mode
    const questions = generateQuizQuestions(lessonId || '1', mode);
    setQuizQuestions(questions);
    setShowQuiz(true);
  };

  const handleQuizComplete = (results: QuizResult[]) => {
    setQuizResults(results);
    setShowQuiz(false);
    setShowResults(true);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setCurrentQuizMode(null);
    setQuizQuestions([]);
  };

  const handleResultsClose = () => {
    setShowResults(false);
    setQuizResults([]);
  };

  const handleRetry = () => {
    setShowResults(false);
    setShowQuizModeSelector(true);
  };

  const getDifficultyColor = (difficulty: Kanji['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getJLPTLevelColor = (level: Kanji['jlptLevel']) => {
    switch (level) {
      case 'N5':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'N4':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'N3':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'N2':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'N1':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/?tab=lessons')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Lección: Fundamentos Básicos</h1>
              <p className="text-sm text-gray-600">5 kanji • Nivel N5 • 15 minutos estimados</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-blue-600 text-sm font-semibold">📚 {kanjiList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Progreso de la Lección</h2>
            <span className="text-sm text-gray-500">0/{kanjiList.length} completados</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-3 mb-4">
            Haz clic en cada kanji para aprender más detalles
          </p>
          
          {/* Practice Button */}
          <button
            onClick={handlePracticeClick}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-colors duration-200 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Practicar Lección</span>
            </div>
          </button>
        </div>
      </div>

      {/* Kanji Grid */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kanjiList.map((kanji, index) => (
            <div
              key={kanji.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-center border border-gray-100 hover:border-blue-200 hover:scale-105"
              onClick={() => handleKanjiClick(kanji)}
            >
              {/* Kanji Character */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-blue-200 shadow-inner">
                <span className="text-5xl font-bold text-gray-800">{kanji.character}</span>
              </div>

              {/* Kanji Meaning */}
              <h3 className="text-lg font-bold text-gray-800 mb-3">{kanji.meaning}</h3>
              
              {/* Main Reading - Onyomi */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Lectura principal</p>
                <div className="bg-blue-100 rounded-xl p-2">
                  <span className="font-mono text-lg font-bold text-blue-700">
                    {kanji.readings.onyomi[0]}
                  </span>
                </div>
              </div>

              {/* Alternative Readings */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Otras lecturas</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {kanji.readings.onyomi.slice(1).map((reading, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600 font-mono">
                      {reading}
                    </span>
                  ))}
                  {kanji.readings.kunyomi.slice(0, 2).map((reading, idx) => (
                    <span key={idx} className="text-xs bg-green-100 px-2 py-1 rounded-lg text-green-600 font-mono">
                      {reading}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stroke Count Badge */}
              <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-purple-200">
                <span className="text-sm font-medium text-purple-700">{kanji.strokeCount} trazos</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Kanji Details */}
      {isModalOpen && selectedKanji && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center border-2 border-blue-300 shadow-lg">
                    <span className="text-6xl font-bold text-blue-700">{selectedKanji.character}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedKanji.meaning}</h2>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(selectedKanji.difficulty)}`}>
                        {selectedKanji.difficulty === 'beginner' ? 'Principiante' : selectedKanji.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getJLPTLevelColor(selectedKanji.jlptLevel)}`}>
                        {selectedKanji.jlptLevel}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Readings */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </span>
                  Lecturas
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                      <span className="mr-2">音</span>
                      Onyomi
                    </h4>
                    <div className="space-y-3">
                      {selectedKanji.readings.onyomi.map((reading, idx) => (
                        <div key={idx} className="bg-white/80 px-4 py-3 rounded-xl border border-blue-200 shadow-sm">
                          <span className="font-mono text-xl font-bold text-blue-700">{reading}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <span className="mr-2">訓</span>
                      Kunyomi
                    </h4>
                    <div className="space-y-3">
                      {selectedKanji.readings.kunyomi.map((reading, idx) => (
                        <div key={idx} className="bg-white/80 px-4 py-3 rounded-xl border border-green-200 shadow-sm">
                          <span className="font-mono text-xl font-bold text-green-700">{reading}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Ejemplos de Uso
                </h3>
                <div className="space-y-4">
                  {selectedKanjiExamples.map((example, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 shadow-sm">
                      <div className="text-xl font-bold text-gray-800 mb-3 text-center">{example.japanese}</div>
                      <div className="bg-white/80 rounded-xl p-3 mb-2">
                        <div className="text-sm text-gray-500 mb-1">Romaji:</div>
                        <div className="font-mono text-lg text-gray-700">{example.romaji}</div>
                      </div>
                      <div className="bg-white/80 rounded-xl p-3">
                        <div className="text-sm text-gray-500 mb-1">English:</div>
                        <div className="text-lg text-gray-800">{example.english}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Información Adicional
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
                    <div className="text-3xl font-bold text-blue-700 mb-1">{selectedKanji.strokeCount}</div>
                    <div className="text-sm text-blue-600 font-medium">Trazos</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
                    <div className="text-3xl font-bold text-green-700 mb-1">{selectedKanji.frequency}</div>
                    <div className="text-sm text-green-600 font-medium">Frecuencia</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
                    <div className="text-3xl font-bold text-purple-700 mb-1">{selectedKanji.grade}</div>
                    <div className="text-sm text-purple-600 font-medium">Grado</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-3xl">
              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Mode Selector */}
      {showQuizModeSelector && (
        <QuizModeSelector
          onModeSelect={handleQuizModeSelect}
          onClose={() => setShowQuizModeSelector(false)}
        />
      )}

      {/* Quiz */}
      {showQuiz && currentQuizMode && (
        <Quiz
          questions={quizQuestions}
          mode={currentQuizMode}
          onComplete={handleQuizComplete}
          onClose={handleQuizClose}
        />
      )}

      {/* Quiz Results */}
      {showResults && (
        <QuizResults
          results={quizResults}
          onClose={handleResultsClose}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
