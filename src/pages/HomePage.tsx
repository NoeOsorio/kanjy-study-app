import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import MascotCharacter from '../components/MascotCharacter';
import { FiTarget, FiTrendingUp, FiBookOpen, FiActivity, FiRefreshCw, FiZap, FiStar, FiAward } from 'react-icons/fi';

export default function HomePage() {
  const [dailyGoal] = useState(50);
  const [currentXP] = useState(35);
  const [streak] = useState(7);

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Header */}
      <PageHeader
        title="¡Hola, Estudiante!"
        description="¡Mantén tu racha y sigue aprendiendo!"
        leftContent={
          <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="font-semibold tracking-wider text-white text-2xl">漢</span>
          </div>
        }
      />

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Welcome Section with Mascot */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Bienvenido de vuelta!</h2>
              <p className="text-gray-600 mb-4">Tu amigo Kanji está emocionado de verte hoy</p>
              
              {/* Stats rápidos */}
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{streak}</div>
                  <div className="text-xs text-gray-500">Días</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{currentXP}</div>
                  <div className="text-xs text-gray-500">XP Hoy</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">85%</div>
                  <div className="text-xs text-gray-500">Precisión</div>
                </div>
              </div>
            </div>
            
            {/* Personaje mascota */}
            <div className="ml-4">
              <MascotCharacter variant="excited" size="lg" />
            </div>
          </div>
        </div>

        {/* Daily Goal Card - Estilo Gamificado */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full -mr-12 -mt-12 opacity-60"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <FiTarget className="text-slate-600" />
                Meta diaria
              </h2>
              <span className="text-lg font-semibold text-teal-700">{currentXP}/{dailyGoal} XP</span>
            </div>
            
            {/* Barra de progreso mejorada */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-1000 ease-out"
                   style={{ width: `${Math.min((currentXP / dailyGoal) * 100, 100)}%` }}>
              </div>
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
            
            <p className="text-slate-600 font-medium">
              ¡Solo <span className="text-teal-700 font-semibold">{dailyGoal - currentXP} XP</span> más para completar tu meta diaria!
            </p>
          </div>
        </div>

        {/* Streak Card - Nueva funcionalidad */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -mr-12 -mt-12 opacity-60"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <FiTrendingUp className="text-amber-500" />
                Racha actual
              </h2>
              <span className="text-2xl font-semibold text-amber-600">{streak}</span>
            </div>
            
            <div className="flex space-x-2 mb-4">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i < streak ? 'bg-amber-500' : 'bg-gray-200'
                }`}></div>
              ))}
            </div>
            
            <p className="text-gray-600 font-medium">
              ¡Excelente! Has estudiado <span className="text-orange-600 font-bold">{streak} días</span> seguidos
            </p>
          </div>
        </div>

        {/* Quick Actions - Mejoradas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Lección Rápida */}
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-3xl p-6 text-white shadow-lg cursor-pointer">
            <FiBookOpen className="w-8 h-8 mb-3 text-white" />
            <h3 className="text-lg font-semibold mb-1">Lección rápida</h3>
            <p className="text-slate-200 text-sm">Aprende 5 kanji nuevos</p>
          </div>

          {/* Práctica */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg cursor-pointer">
            <FiActivity className="w-8 h-8 mb-3 text-white" />
            <h3 className="text-lg font-semibold mb-1">Práctica</h3>
            <p className="text-teal-100 text-sm">Refuerza lo aprendido</p>
          </div>

          {/* Repaso */}
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-3xl p-6 text-white shadow-lg cursor-pointer">
            <FiRefreshCw className="w-8 h-8 mb-3 text-white" />
            <h3 className="text-lg font-semibold mb-1">Repaso</h3>
            <p className="text-slate-200 text-sm">Mantén tu memoria fresca</p>
          </div>

          {/* Desafío */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg cursor-pointer">
            <FiZap className="w-8 h-8 mb-3 text-white" />
            <h3 className="text-lg font-semibold mb-1">Desafío</h3>
            <p className="text-amber-100 text-sm">Pon a prueba tus habilidades</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <FiBookOpen className="w-6 h-6 mx-auto mb-2 text-slate-600" />
            <div className="text-2xl font-semibold text-slate-800">12</div>
            <div className="text-sm text-slate-600">Lecciones</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <FiTarget className="w-6 h-6 mx-auto mb-2 text-slate-600" />
            <div className="text-2xl font-semibold text-teal-700">85%</div>
            <div className="text-sm text-slate-600">Precisión</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <FiStar className="w-6 h-6 mx-auto mb-2 text-slate-600" />
            <div className="text-2xl font-semibold text-amber-600">156</div>
            <div className="text-sm text-slate-600">XP total</div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 relative overflow-hidden">
          <div className="relative z-10">
            <FiAward className="w-8 h-8 mx-auto mb-3 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">¡Sigue así!</h3>
            <p className="text-slate-600">
              Cada día que estudias te acerca más a dominar el japonés. Mantén la constancia.
            </p>
            <div className="mt-4 flex justify-center">
              <MascotCharacter variant="celebrating" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
