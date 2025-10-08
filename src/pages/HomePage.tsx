import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiActivity, FiArrowRight, FiPlay } from 'react-icons/fi';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Simple */}
      <div className="px-6 pt-8 pb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="font-semibold tracking-wider text-white text-3xl">漢</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Aprende Kanji</h1>
          <p className="text-slate-600 text-lg">Elige cómo quieres estudiar hoy</p>
        </div>
      </div>

      {/* Opciones Principales - Súper Grandes y Obvias */}
      <div className="px-6 space-y-6">
        {/* Estudiar Lecciones */}
        <button
          onClick={() => navigate('/lessons')}
          className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiBookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-2">Estudiar Lecciones</h2>
                <p className="text-blue-100 text-lg">Aprende kanji nuevos paso a paso</p>
              </div>
            </div>
            <FiArrowRight className="w-8 h-8 text-white/80" />
          </div>
        </button>

        {/* Hacer Quizzes */}
        <button
          onClick={() => navigate('/practice')}
          className="w-full bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiActivity className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-2">Hacer Quizzes</h2>
                <p className="text-teal-100 text-lg">Practica con preguntas y respuestas</p>
              </div>
            </div>
            <FiArrowRight className="w-8 h-8 text-white/80" />
          </div>
        </button>

        {/* Acceso Rápido a Quiz Mixto */}
        <button
          onClick={() => navigate('/quiz/mixed')}
          className="w-full bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiPlay className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-2">Quiz Rápido</h2>
                <p className="text-amber-100 text-lg">Desafío completo con todos los tipos</p>
              </div>
            </div>
            <FiArrowRight className="w-8 h-8 text-white/80" />
          </div>
        </button>
      </div>

      {/* Información Simple */}
      <div className="px-6 pt-8 pb-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">¿Cómo funciona?</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Lecciones:</strong> Aprende kanji nuevos con explicaciones y ejemplos.<br/>
              <strong>Quizzes:</strong> Practica lo que has aprendido con diferentes tipos de preguntas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
