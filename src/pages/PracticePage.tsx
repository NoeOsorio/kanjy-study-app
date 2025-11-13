import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizModeSelector from '../components/QuizModeSelector';
import LessonSelector from '../components/LessonSelector';
import PageHeader from '../components/PageHeader';
import type { QuizMode } from '../types';
import { FiArrowLeft } from 'react-icons/fi';

type Step = 'lessons' | 'mode';

export default function PracticePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('lessons');
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);

  const handleLessonsSelected = (lessonIds: string[]) => {
    setSelectedLessons(lessonIds);
    setStep('mode');
  };

  const handleModeSelect = (mode: QuizMode) => {
    // Pasar las lecciones seleccionadas como query params
    const lessonsParam = selectedLessons.join(',');
    navigate(`/quiz/${mode}?lessons=${lessonsParam}`);
  };

  const handleBack = () => {
    if (step === 'mode') {
      setStep('lessons');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Header */}
      <PageHeader
        title={step === 'lessons' ? 'Seleccionar Lecciones' : 'Seleccionar Modo'}
        description={step === 'lessons' ? 'Elige de qué lecciones quieres hacer el quiz' : 'Elige cómo quieres practicar'}
        leftContent={
          <button
            onClick={handleBack}
            className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg hover:from-teal-700 hover:to-teal-800 transition-colors"
            title={step === 'lessons' ? 'Volver al inicio' : 'Volver a lecciones'}
          >
            <FiArrowLeft className="w-6 h-6 text-white" />
          </button>
        }
      />

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6">
        {step === 'lessons' ? (
          <LessonSelector onLessonsSelected={handleLessonsSelected} />
        ) : (
          <QuizModeSelector onModeSelect={handleModeSelect} />
        )}
      </div>
    </div>
  );
}