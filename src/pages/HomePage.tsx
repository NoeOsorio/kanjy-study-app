import { useState } from 'react';
import PageHeader from '../components/PageHeader';

export default function HomePage() {
  const [dailyGoal] = useState(50);
  const [currentXP] = useState(35);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <PageHeader
        title="¡Hola, Estudiante!"
        description="¡Mantén tu racha!"
        leftContent={
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">漢</span>
          </div>
        }
      />

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Daily Goal Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Meta Diaria</h2>
            <span className="text-sm text-gray-500">{currentXP}/{dailyGoal} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((currentXP / dailyGoal) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            ¡Solo {dailyGoal - currentXP} XP más para completar tu meta diaria!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-md transition-shadow duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477 4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">Nueva Lección</h3>
              <p className="text-sm opacity-90">Aprende 5 kanji</p>
            </div>
          </button>

          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-md transition-shadow duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">Práctica</h3>
              <p className="text-sm opacity-90">Repasa kanji</p>
            </div>
          </button>
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Progreso Reciente</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-lg font-bold">日</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Kanji "日" (sol)</p>
                <p className="text-sm text-gray-600">Nivel de maestría: 3/5</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg font-bold">水</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Kanji "水" (agua)</p>
                <p className="text-sm text-gray-600">Nivel de maestría: 4/5</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg font-bold">火</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Kanji "火" (fuego)</p>
                <p className="text-sm text-gray-600">Nivel de maestría: 2/5</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <h2 className="text-lg font-bold text-gray-800 mb-3">💡 Consejos de Estudio</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Practica al menos 15 minutos al día para mantener tu racha</p>
            <p>• Repasa los kanji que aprendiste en días anteriores</p>
            <p>• Usa el modo de práctica para reforzar tu memoria</p>
          </div>
        </div>
      </div>
    </div>
  );
}
