import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import type { Lesson } from '../types';
import {  FiClock, FiGrid, FiArrowRight } from 'react-icons/fi';

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

      {/* Intro removida para dar prioridad a la lista de lecciones */}

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

      {/* Resumen de progreso global retirado; el progreso vive en el detalle de lección */}

      {/* Lessons Grid - Mejorado */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-colors cursor-pointer relative overflow-hidden ${
                lesson.isCompleted ? 'opacity-90' : ''
              }`}
              onClick={() => handleLessonClick(lesson)}
            >
              {/* Decoración removida para reducir ruido visual */}
              
              {/* Lesson Header (kanji destacado ocupa el espacio del icono) */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center shadow-lg">
                    <span className="text-3xl md:text-4xl font-semibold text-white leading-none">{lesson.kanjiList[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-1">{lesson.title}</h3>
                    <p className="text-slate-600 text-sm mb-2 leading-relaxed">{lesson.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lesson.difficulty)}`}>
                        {getDifficultyLabel(lesson.difficulty)}
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getJLPTLevelColor(lesson.jlptLevel)}`}>
                        {lesson.jlptLevel}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white">
                  Estudiar
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FiClock className="w-4 h-4" />
                    <span className="text-sm">{lesson.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <FiGrid className="w-4 h-4" />
                    <span className="text-sm">{lesson.kanjiList.length} kanji</span>
                  </div>
                </div>
                
                {/* Estado y acción */}
                <div className="flex items-center space-x-3">
                  {lesson.isCompleted ? (
                    <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-1">Completada</span>
                  ) : (
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-full px-2 py-1">Pendiente</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
