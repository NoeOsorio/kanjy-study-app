import { useState, useEffect } from 'react';
import { getAvailableLessons } from '../services/kanjiService';
import type { Lesson } from '../types';
import { FiBook, FiCheck } from 'react-icons/fi';

interface LessonSelectorProps {
  onLessonsSelected: (lessonIds: string[]) => void;
}

export default function LessonSelector({ onLessonsSelected }: LessonSelectorProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessons = () => {
      try {
        const availableLessons = getAvailableLessons();
        setLessons(availableLessons as Lesson[]);
      } catch (error) {
        console.error('Error loading lessons:', error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  const toggleLesson = (lessonId: string) => {
    const newSelected = new Set(selectedLessons);
    if (newSelected.has(lessonId)) {
      newSelected.delete(lessonId);
    } else {
      newSelected.add(lessonId);
    }
    setSelectedLessons(newSelected);
  };

  const handleContinue = () => {
    if (selectedLessons.size > 0) {
      onLessonsSelected(Array.from(selectedLessons));
    }
  };

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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <FiBook className="w-6 h-6 text-white animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Cargando lecciones...</h2>
        <p className="text-slate-600">Preparando tu contenido de estudio</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Selecciona las Lecciones</h2>
        <p className="text-gray-600">Elige de qué lecciones quieres hacer el quiz</p>
        {selectedLessons.size > 0 && (
          <p className="text-sm text-teal-600 font-medium mt-2">
            {selectedLessons.size} lección{selectedLessons.size > 1 ? 'es' : ''} seleccionada{selectedLessons.size > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Lista de lecciones */}
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isSelected = selectedLessons.has(lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => toggleLesson(lesson.id)}
              className={`w-full bg-white rounded-2xl p-4 border-2 transition-all text-left ${
                isSelected
                  ? 'border-teal-500 bg-teal-50 shadow-md'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Checkbox visual */}
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'bg-teal-600 border-teal-600'
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <FiCheck className="w-4 h-4 text-white" />}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {lesson.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty === 'beginner' ? 'Principiante' : 
                         lesson.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getJLPTLevelColor(lesson.jlptLevel)}`}>
                        {lesson.jlptLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Botón continuar */}
      <div className="pt-4">
        <button
          onClick={handleContinue}
          disabled={selectedLessons.size === 0}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            selectedLessons.size > 0
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar con {selectedLessons.size > 0 ? selectedLessons.size : 0} lección{selectedLessons.size !== 1 ? 'es' : ''}
        </button>
      </div>
    </div>
  );
}

