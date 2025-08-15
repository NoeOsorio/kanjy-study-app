import { useState, useEffect } from 'react';
import type { QuizQuestion, QuizResult, QuizMode } from '../types';
import { getQuizModeTitle, getQuizModeDescription } from '../services/quizService';

interface QuizProps {
  questions: QuizQuestion[];
  mode: QuizMode;
  onComplete: (results: QuizResult[]) => void;
  onClose: () => void;
}

export default function Quiz({ questions, mode, onComplete, onClose }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const timeSpent = Date.now() - startTime;
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect,
      timeSpent
    };
    
    setResults(prev => [...prev, result]);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      onComplete(results);
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const getQuestionDisplay = () => {
    // Para el modo mixto, usar el tipo de la pregunta actual
    const questionType = mode === 'mixed' ? currentQuestion.type : mode;
    
    if (questionType === 'kanji-to-meaning' || questionType === 'kanji-to-onyomi') {
      return (
        <div className="text-center mb-4 sm:mb-8">
          <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border-2 sm:border-4 border-blue-200 shadow-xl sm:shadow-2xl">
            <span className="text-4xl sm:text-7xl font-bold text-blue-700">{currentQuestion.question}</span>
          </div>
          <p className="text-sm sm:text-lg text-gray-600">
            {questionType === 'kanji-to-meaning' ? '¿Cuál es el significado?' : '¿Cuál es la lectura onyomi?'}
          </p>
        </div>
      );
    } else {
      return (
        <div className="text-center mb-4 sm:mb-8">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mx-auto mb-4 sm:mb-6 border-2 border-purple-200 shadow-xl sm:shadow-2xl">
            <span className="text-4xl sm:text-4xl font-bold text-purple-700">{currentQuestion.question}</span>
          </div>
          <p className="text-sm sm:text-lg text-gray-600">
            {questionType === 'meaning-to-kanji' ? '¿Cuál es el kanji?' : '¿Cuál es el kanji?'}
          </p>
        </div>
      );
    }
  };

  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300';
    }
    
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-100 border-green-400 text-green-800';
    }
    
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'bg-red-100 border-red-400 text-red-800';
    }
    
    return 'bg-gray-100 border-gray-200 text-gray-600';
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-2 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full h-[95vh] flex flex-col shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                {mode === 'mixed' ? '🎯 Quiz Mixto' : getQuizModeTitle(mode)}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
                {mode === 'mixed' && currentQuestion && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • {getQuizModeTitle(currentQuestion.type)}
                  </span>
                )}
              </p>
              {mode === 'mixed' && currentQuestion && (
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                    {getQuizModeDescription(currentQuestion.type)}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
          {getQuestionDisplay()}

          {/* Answer Options */}
          <div className="space-y-2 sm:space-y-3 mt-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full p-3 sm:p-4 rounded-2xl border-2 text-left font-medium transition-all duration-200 ${getOptionStyle(option)} ${
                  !isAnswered ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-gray-600 mr-3 sm:mr-4">
                    {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                  </span>
                  <span className="flex-1 text-left text-sm sm:text-base">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-2xl ${
              selectedAnswer === currentQuestion.correctAnswer 
                ? 'bg-green-100 border border-green-200' 
                : 'bg-red-100 border border-red-200'
            }`}>
              <div className="flex items-center">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <div>
                  <p className={`font-semibold text-sm sm:text-base ${
                    selectedAnswer === currentQuestion.correctAnswer ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? '¡Correcto!' : 'Incorrecto'}
                  </p>
                  {selectedAnswer !== currentQuestion.correctAnswer && (
                    <p className="text-red-700 text-xs sm:text-sm">
                      La respuesta correcta es: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-3xl flex-shrink-0">
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 sm:py-4 px-6 rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLastQuestion ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
