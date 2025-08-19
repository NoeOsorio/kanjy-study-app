import type { QuizResult } from '../types';

interface QuizResultsProps {
  results: QuizResult[];
  onClose: () => void;
  onRetry: () => void;
}

export default function QuizResults({ results, onClose, onRetry }: QuizResultsProps) {
  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const averageTime = Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / totalQuestions / 1000);

  const getAccuracyColor = () => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyMessage = () => {
    if (accuracy >= 90) return '¡Excelente trabajo!';
    if (accuracy >= 80) return '¡Muy bien hecho!';
    if (accuracy >= 60) return 'Buen trabajo, pero puedes mejorar';
    return 'Necesitas más práctica';
  };

  const getAccuracyEmoji = () => {
    if (accuracy >= 80) return '🎉';
    if (accuracy >= 60) return '👍';
    return '💪';
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-3xl">
          <div className="text-center">
            <div className="text-6xl mb-4">{getAccuracyEmoji()}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Quiz Completado!</h2>
            <p className="text-gray-600">{getAccuracyMessage()}</p>
            {results.length > 10 && (
              <div className="mt-3">
                <span className="inline-block bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full font-medium">
                  🎯 Quiz Mixto Extendido • {results.length} preguntas
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Results Content */}
        <div className="p-6">
          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-1">{totalQuestions}</div>
              <div className="text-sm text-blue-600 font-medium">Total</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-1">{correctAnswers}</div>
              <div className="text-sm text-green-600 font-medium">Correctas</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center border border-red-200">
              <div className="text-3xl font-bold text-red-700 mb-1">{incorrectAnswers}</div>
              <div className="text-sm text-red-600 font-medium">Incorrectas</div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Precisión</h3>
              <div className={`text-5xl font-bold ${getAccuracyColor()}`}>
                {accuracy}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  accuracy >= 80 ? 'bg-green-500' : accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
          </div>

          {/* Time Stats */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 mb-6 border border-purple-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Tiempo Promedio</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-700 mb-2">{averageTime}s</div>
              <p className="text-purple-600">por pregunta</p>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Desglose de Preguntas</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={result.questionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">
                      Pregunta {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">
                      {Math.round(result.timeSpent / 1000)}s
                    </span>
                    {result.isCorrect ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex gap-4">
            <button
              onClick={onRetry}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Intentar de Nuevo
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
