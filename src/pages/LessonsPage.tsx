import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import type { Lesson } from '../types';
import { FiClock, FiGrid, FiArrowRight, FiFilter, FiBook } from 'react-icons/fi';

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
    // ... (mantener todos los otros lessons sin cambios)
  ]);

  const getDifficultyColor = (difficulty: Lesson['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
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
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'N4':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'N3':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'N2':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'N1':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Filtrar lecciones por nivel JLPT seleccionado
  const filteredLessons = lessons.filter(lesson => 
    selectedJLPTLevel === 'all' || lesson.jlptLevel === selectedJLPTLevel
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <PageHeader
        title="Lecciones"
        description="Elige tu próxima aventura de aprendizaje"
        leftContent={
          <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
            <FiBook className="w-6 h-6 text-white" />
          </div>
        }
      />

      {/* Filtro JLPT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <FiFilter className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-bold text-slate-900">Filtrar por nivel JLPT</h2>
            </div>
            <p className="text-sm text-slate-600">
              Mostrando <span className="font-semibold text-slate-900">{filteredLessons.length}</span> de <span className="font-semibold text-slate-900">{lessons.length}</span> lecciones
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedJLPTLevel(level)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                  selectedJLPTLevel === level
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {level === 'all' ? 'Todos los niveles' : `JLPT ${level}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de lecciones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => navigate(`/lessons/${lesson.id}`)}
              className="group bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  {/* Kanji preview */}
                  <div className="w-full sm:w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center group-hover:from-slate-800 group-hover:to-slate-900 transition-colors">
                    <span className="text-4xl font-bold text-white">
                      {lesson.kanjiList[0]}
                    </span>
                  </div>

                  {/* Contenido principal */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {lesson.title}
                        </h3>
                        <p className="text-slate-600 mb-4">
                          {lesson.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(lesson.difficulty)}`}>
                            {getDifficultyLabel(lesson.difficulty)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getJLPTLevelColor(lesson.jlptLevel)}`}>
                            {lesson.jlptLevel}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors">
                          <span>Estudiar</span>
                          <FiArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Meta información */}
                    <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiClock className="w-4 h-4" />
                          <span className="text-sm">{lesson.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiGrid className="w-4 h-4" />
                          <span className="text-sm">{lesson.kanjiList.length} kanji</span>
                        </div>
                      </div>
                      <div>
                        {lesson.isCompleted ? (
                          <span className="text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1">
                            Completada
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                            Pendiente
                          </span>
                        )}
                      </div>
                    </div>
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