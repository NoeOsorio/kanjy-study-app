import { useNavigate } from 'react-router-dom';
import QuizModeSelector from '../components/QuizModeSelector';
import PageHeader from '../components/PageHeader';
import type { QuizMode } from '../types';
import {  FiArrowLeft } from 'react-icons/fi';

export default function PracticePage() {
  const navigate = useNavigate();

  const handleModeSelect = (mode: QuizMode) => {
    navigate(`/quiz/${mode}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Header */}
      <PageHeader
        title="Práctica"
        description="Mejora tus habilidades con diferentes tipos de ejercicios"
        leftContent={
          <button
            onClick={() => navigate('/')}
            className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg hover:from-teal-700 hover:to-teal-800 transition-colors"
            title="Volver al inicio"
          >
            <FiArrowLeft className="w-6 h-6 text-white" />
          </button>
        }
      />

      {/* Main Content */}
      <div className="px-6 py-6">
        <QuizModeSelector onModeSelect={handleModeSelect} />
      </div>
    </div>
  );
}