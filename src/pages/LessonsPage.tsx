import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Filtrar lecciones por nivel JLPT seleccionado
  const filteredLessons = lessons.filter(lesson => 
    selectedJLPTLevel === 'all' || lesson.jlptLevel === selectedJLPTLevel
  );

  const handleLessonClick = (lesson: Lesson) => {
    // Navegar a la página de detalle de la lección
    navigate(`/lesson/${lesson.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Lecciones</h1>
            <p className="text-sm text-gray-600">Elige tu próxima aventura de aprendizaje</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-blue-600 text-sm font-semibold">📚 {lessons.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* JLPT Level Selector */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Filtrar por Nivel JLPT</h2>
          <div className="flex flex-wrap gap-2">
            {(['all', 'N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedJLPTLevel(level)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                  selectedJLPTLevel === level
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level === 'all' ? 'Todos' : level}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Mostrando {filteredLessons.length} de {lessons.length} lecciones
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Progreso General</h2>
            <span className="text-sm text-gray-500">
              {filteredLessons.filter(l => l.isCompleted).length}/{filteredLessons.length} completadas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${filteredLessons.length > 0 ? (filteredLessons.filter(l => l.isCompleted).length / filteredLessons.length) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            ¡Continúa aprendiendo para desbloquear más lecciones!
          </p>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {filteredLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                lesson.isCompleted ? 'opacity-75' : ''
              }`}
              onClick={() => handleLessonClick(lesson)}
            >
              {/* Lesson Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${getDifficultyColor(lesson.difficulty)}`}>
                      {index + 1}
                    </div>
                                         <div>
                       <h3 className="text-lg font-bold text-gray-800">{lesson.title}</h3>
                       <div className="flex flex-wrap gap-2 mt-1">
                         <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lesson.difficulty)}`}>
                           {getDifficultyLabel(lesson.difficulty)}
                         </span>
                         <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getJLPTLevelColor(lesson.jlptLevel)}`}>
                           {lesson.jlptLevel}
                         </span>
                       </div>
                     </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>
                </div>
                
                {/* Lesson Status */}
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-500">{lesson.estimatedTime} min</span>
                  </div>
                  {lesson.isCompleted && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Kanji Preview */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Kanji que aprenderás:</p>
                <div className="flex space-x-2">
                  {lesson.kanjiList.map((kanji, kanjiIndex) => (
                    <div
                      key={kanjiIndex}
                      className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                      title={`Kanji ${kanjiIndex + 1}`}
                    >
                      {kanji}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              {lesson.progress > 0 && !lesson.isCompleted && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progreso</span>
                    <span className="text-sm font-medium text-gray-800">{lesson.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors duration-200 ${
                  lesson.isCompleted
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                }`}
                disabled={lesson.isCompleted}
              >
                {lesson.isCompleted ? 'Lección Completada' : 'Comenzar Lección'}
              </button>
            </div>
          ))}
        </div>

        {/* No Lessons Message */}
        {filteredLessons.length === 0 && (
          <div className="px-6 py-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No hay lecciones disponibles</h3>
              <p className="text-gray-600 mb-4">
                No hay lecciones para el nivel {selectedJLPTLevel === 'all' ? 'seleccionado' : selectedJLPTLevel} en este momento.
              </p>
              <button
                onClick={() => setSelectedJLPTLevel('all')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Ver Todas las Lecciones
              </button>
            </div>
          </div>
        )}

        {/* Bottom Spacing for Navigation */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
