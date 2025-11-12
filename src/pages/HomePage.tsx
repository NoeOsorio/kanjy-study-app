import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiActivity, FiArrowRight, FiPlay } from 'react-icons/fi';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Simple */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 sm:mb-4">
            <span className="font-semibold tracking-wider text-white text-2xl sm:text-3xl">漢</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Aprende Kanji</h1>
          <p className="text-slate-600 text-base sm:text-lg">Elige cómo quieres estudiar hoy</p>
        </div>
      </div>

      {/* Opciones Principales - Responsive */}
      <div className="px-4 sm:px-6 space-y-4 sm:space-y-6">
        {/* Estudiar Lecciones */}
        <button
          onClick={() => navigate('/lessons')}
          className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiBookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Estudiar Lecciones</h2>
                <p className="text-blue-100 text-sm sm:text-lg">Aprende kanji nuevos paso a paso</p>
              </div>
            </div>
            <FiArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 flex-shrink-0" />
          </div>
        </button>

        {/* Hacer Quizzes */}
        <button
          onClick={() => navigate('/practice')}
          className="w-full bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiActivity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Hacer Quizzes</h2>
                <p className="text-teal-100 text-sm sm:text-lg">Practica con preguntas y respuestas</p>
              </div>
            </div>
            <FiArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 flex-shrink-0" />
          </div>
        </button>

        {/* Acceso Rápido a Quiz Mixto */}
        <button
          onClick={() => navigate('/quiz/mixed')}
          className="w-full bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiPlay className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Quiz Rápido</h2>
                <p className="text-amber-100 text-sm sm:text-lg">Desafío completo con todos los tipos</p>
              </div>
            </div>
            <FiArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 flex-shrink-0" />
          </div>
        </button>
      </div>

      {/* Información Simple */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-12">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">¿Cómo funciona?</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              <strong>Lecciones:</strong> Aprende kanji nuevos con explicaciones y ejemplos.<br className="hidden sm:block"/>
              <span className="sm:hidden"> </span><strong>Quizzes:</strong> Practica lo que has aprendido con diferentes tipos de preguntas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
