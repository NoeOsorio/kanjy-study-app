import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheck, FiX, FiClock, FiRepeat, FiHome } from 'react-icons/fi';
import type { QuizResult, QuizMode } from '../types';
import { getQuizModeTitle } from '../services/quizService';

export default function QuizResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { results = [], mode = 'mixed', lessonIds = [] } = location.state as { results: QuizResult[], mode: QuizMode, lessonIds?: string[] } || {};

  const correctAnswers = results.filter(r => r.isCorrect).length;
  const totalQuestions = results.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const averageTime = Math.round(results.reduce((acc, r) => acc + r.timeSpent, 0) / results.length / 1000);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-teal-500';
    if (percentage >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Resultados del Quiz
        </h1>
        <p className="text-sm text-slate-400">
          {getQuizModeTitle(mode as QuizMode)}
        </p>
      </div>

      {/* Score Card */}
      <div className="px-4 mb-8">
        <div className="bg-slate-800 rounded-3xl p-6 text-center">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
            {percentage}%
          </div>
          <p className="text-slate-300">
            {correctAnswers} de {totalQuestions} respuestas correctas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-2">
              <FiClock className="w-5 h-5 text-slate-300" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {averageTime}s
            </div>
            <p className="text-sm text-slate-400">
              Tiempo promedio
            </p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-2">
              <FiCheck className="w-5 h-5 text-slate-300" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {Math.round((correctAnswers / totalQuestions) * 100)}%
            </div>
            <p className="text-sm text-slate-400">
              Precisión
            </p>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          Resumen de respuestas
        </h2>
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl flex items-center ${
                result.isCorrect ? 'bg-teal-900/20' : 'bg-rose-900/20'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${
                result.isCorrect ? 'bg-teal-100' : 'bg-rose-100'
              }`}>
                {result.isCorrect ? (
                  <FiCheck className="w-5 h-5 text-teal-600" />
                ) : (
                  <FiX className="w-5 h-5 text-rose-600" />
                )}
              </div>
              <div>
                <p className={`font-bold ${
                  result.isCorrect ? 'text-teal-300' : 'text-rose-300'
                }`}>
                  Pregunta {index + 1}
                </p>
                <p className="text-sm text-slate-400">
                  {Math.round(result.timeSpent / 1000)}s
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mt-auto pb-8">
        <div className="space-y-3">
          <button
            onClick={() => {
              const lessonsParam = lessonIds.length > 0 ? lessonIds.join(',') : '';
              const url = lessonsParam ? `/quiz/${mode}?lessons=${lessonsParam}` : `/quiz/${mode}`;
              navigate(url);
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
          >
            <FiRepeat className="w-5 h-5" />
            <span>Intentar de nuevo</span>
          </button>
          <button
            onClick={() => navigate('/practice')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
          >
            <FiHome className="w-5 h-5" />
            <span>Volver a práctica</span>
          </button>
        </div>
      </div>
    </div>
  );
}
