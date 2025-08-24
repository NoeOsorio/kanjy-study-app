import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import MascotCharacter from '../components/MascotCharacter';
import type { Lesson } from '../types';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'all';

export default function LessonsPage() {
  const navigate = useNavigate();
  const [selectedJLPTLevel, setSelectedJLPTLevel] = useState<JLPTLevel>('all');
  
  // Mock data for lessons - esto se reemplazará con datos del backend
  const [lessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Fundamentos Básicos N5',
      description: 'Aprende los kanji más esenciales del japonés - Nivel N5',
      kanjiList: ['日', '月', '火', '水', '木'],
      difficulty: 'beginner',
      jlptLevel: 'N5',
      estimatedTime: 15,
      isCompleted: false,
      progress: 0,
    },
    {
      id: '2',
      title: 'Números y Contar N5',
      description: 'Kanji para números del 1 al 10 - Nivel N5',
      kanjiList: ['一', '二', '三', '四', '五'],
      difficulty: 'beginner',
      jlptLevel: 'N5',
      estimatedTime: 12,
      isCompleted: false,
      progress: 0,
    },
    {
      id: '3',
      title: 'Familia y Personas N5',
      description: 'Kanji relacionados con familia y relaciones - Nivel N5',
      kanjiList: ['人', '父', '母', '子', '女'],
      difficulty: 'beginner',
      jlptLevel: 'N5',
      estimatedTime: 18,
      isCompleted: false,
      progress: 0,
    },
    {
      id: '4',
      title: 'Colores y Formas N4',
      description: 'Kanji para colores básicos y formas - Nivel N4',
      kanjiList: ['白', '黒', '赤', '青', '黄'],
      difficulty: 'intermediate',
      jlptLevel: 'N4',
      estimatedTime: 20,
      isCompleted: false,
      progress: 0,
    },
    {
      id: '5',
      title: 'Naturaleza y Estaciones N4',
      description: 'Kanji de la naturaleza y las estaciones - Nivel N4',
      kanjiList: ['春', '夏', '秋', '冬', '花'],
      difficulty: 'intermediate',
      jlptLevel: 'N4',
      estimatedTime: 25,
      isCompleted: false,
      progress: 0,
    },
    {
      id: '6',
      title: 'Tiempo y Calendario N4',
      description: 'Kanji relacionados con tiempo y fechas - Nivel N4',
      kanjiList: ['年', '月', '日', '時', '分'],
      difficulty: 'intermediate',
      jlptLevel: 'N4',
      estimatedTime: 22,
      isCompleted: false,
      progress: 0,
    },
    {
      id: '7',
      title: 'Comida y Bebidas N3',
      description: 'Kanji de alimentos y bebidas - Nivel N3',
      kanjiList: ['食', '飲', '米', '肉', '魚'],
      difficulty: 'intermediate',
      jlptLevel: 'N3',
      estimatedTime: 28,
      isCompleted: false,
      progress: 0,
    },
    {
      id: '8',
      title: 'Transporte y Viajes N3',
      description: 'Kanji de transporte y viajes - Nivel N3',
      kanjiList: ['車', '電', '駅', '空', '港'],
      difficulty: 'intermediate',
      jlptLevel: 'N3',
      estimatedTime: 30,
      isCompleted: false,
      progress: 0,
    },
    {
      id: '9',
      title: 'Negocios y Trabajo N2',
      description: 'Kanji de negocios y ambiente laboral - Nivel N2',
      kanjiList: ['会', '社', '員', '工', '作'],
      difficulty: 'advanced',
      jlptLevel: 'N2',
      estimatedTime: 35,
      isCompleted: false,
      progress: 0,
    },
    {
      id: '10',
      title: 'Literatura y Arte N1',
      description: 'Kanji avanzados de literatura y arte - Nivel N1',
      kanjiList: ['文', '学', '芸', '術', '詩'],
      difficulty: 'advanced',
      jlptLevel: 'N1',
      estimatedTime: 40,
      isCompleted: false,
      progress: 0,
    },
  ]);

  const getDifficultyColor = (difficulty: Lesson['difficulty']) => {
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

  const getDifficultyLabel = (difficulty: Lesson['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return 'Desconocido';
    }
  };

  const getJLPTLevelColor = (level: Lesson['jlptLevel']) => {
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

  const getLessonIcon = () => {
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-7-2a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v8z" />
      </svg>
    );
  };

  const getLessonGradient = (title: string) => {
    if (title.includes('Fundamentos')) return 'from-green-400 to-green-600';
    if (title.includes('Números')) return 'from-blue-400 to-blue-600';
    if (title.includes('Familia')) return 'from-purple-400 to-purple-600';
    if (title.includes('Colores')) return 'from-pink-400 to-pink-600';
    if (title.includes('Naturaleza')) return 'from-emerald-400 to-emerald-600';
    if (title.includes('Tiempo')) return 'from-cyan-400 to-cyan-600';
    if (title.includes('Comida')) return 'from-orange-400 to-orange-600';
    if (title.includes('Transporte')) return 'from-indigo-400 to-indigo-600';
    if (title.includes('Negocios')) return 'from-gray-400 to-gray-600';
    if (title.includes('Literatura')) return 'from-rose-400 to-rose-600';
    return 'from-gray-400 to-gray-600';
  };

  // Filtrar lecciones por nivel JLPT seleccionado
  const filteredLessons = lessons.filter(lesson => 
    selectedJLPTLevel === 'all' || lesson.jlptLevel === selectedJLPTLevel
  );

  const handleLessonClick = (lesson: Lesson) => {
    // Navegar a la página de detalle de la lección usando la nueva estructura de rutas
    navigate(`/lessons/${lesson.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Header */}
      <PageHeader
        title="Lecciones"
        description="Elige tu próxima aventura de aprendizaje"
        leftContent={
          <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-7-2a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v8z" />
            </svg>
          </div>
        }
      />

      {/* Welcome Section with Mascot */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Listo para aprender?</h2>
              <p className="text-gray-600 mb-4">Tu amigo Kanji ha preparado lecciones especiales para ti</p>
              
              {/* Stats rápidos */}
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{lessons.length}</div>
                  <div className="text-xs text-gray-500">Lecciones</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{lessons.filter(l => l.isCompleted).length}</div>
                  <div className="text-xs text-gray-500">Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{lessons.filter(l => !l.isCompleted).length}</div>
                  <div className="text-xs text-gray-500">Pendientes</div>
                </div>
              </div>
            </div>
            
            {/* Personaje mascota */}
            <div className="ml-4">
              <MascotCharacter variant="thinking" size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* JLPT Level Selector - Mejorado */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V20l-6-3v-4.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtrar por nivel JLPT
          </h2>
          <div className="flex flex-wrap gap-3">
            {(['all', 'N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedJLPTLevel(level)}
                className={`px-6 py-3 rounded-2xl font-medium transition-colors ${
                  selectedJLPTLevel === level
                    ? 'bg-slate-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level === 'all' ? 'Todos los Niveles' : `Nivel ${level}`}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Mostrando <span className="font-bold text-blue-600">{filteredLessons.length}</span> de <span className="font-bold text-gray-600">{lessons.length}</span> lecciones
          </p>
        </div>
      </div>

      {/* Progress Overview - Mejorado */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full -mr-12 -mt-12 opacity-60"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M7 13l3 3 7-7" />
                </svg>
                Progreso general
              </h2>
              <span className="text-lg font-bold text-green-600">
                {filteredLessons.filter(l => l.isCompleted).length}/{filteredLessons.length} completadas
              </span>
            </div>
            
            {/* Barra de progreso mejorada */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${filteredLessons.length > 0 ? (filteredLessons.filter(l => l.isCompleted).length / filteredLessons.length) * 100 : 0}%` }}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              </div>
            </div>
            
            <p className="text-gray-600 font-medium text-center">
              ¡Continúa aprendiendo para desbloquear más lecciones y alcanzar nuevos niveles!
            </p>
          </div>
        </div>
      </div>

      {/* Lessons Grid - Mejorado */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {filteredLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-colors cursor-pointer relative overflow-hidden ${
                lesson.isCompleted ? 'opacity-90' : ''
              }`}
              onClick={() => handleLessonClick(lesson)}
            >
              {/* Fondo decorativo */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getLessonGradient(lesson.title)} rounded-full -mr-10 -mt-10 opacity-20`}></div>
              
              {/* Lesson Header */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    {/* Icono de la lección */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${getLessonGradient(lesson.title)} rounded-2xl flex items-center justify-center text-2xl shadow-gamified`}>
                      {getLessonIcon(lesson.title)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(lesson.difficulty)}`}>
                          {getDifficultyLabel(lesson.difficulty)}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getJLPTLevelColor(lesson.jlptLevel)}`}>
                          {lesson.jlptLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">{lesson.description}</p>
                </div>
              </div>

              {/* Lesson Details */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{lesson.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{lesson.kanjiList.length} kanji</span>
                  </div>
                </div>
                
                {/* Estado de completado */}
                <div className="flex items-center space-x-3">
                  {lesson.isCompleted ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-gamified">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-green-600">¡Completada!</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-500">Pendiente</span>
                    </div>
                  )}
                  
                  {/* Botón de acción */}
                  <div className={`w-10 h-10 bg-gradient-to-br ${getLessonGradient(lesson.title)} rounded-full flex items-center justify-center shadow-gamified`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
