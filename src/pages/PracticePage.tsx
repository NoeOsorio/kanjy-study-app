import { useNavigate } from 'react-router-dom';
import QuizModeSelector from '../components/QuizModeSelector';
import PageHeader from '../components/PageHeader';
import type { QuizMode } from '../types';

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
      />

      {/* Main Content */}
      <div className="px-6 py-6">
        <QuizModeSelector onModeSelect={handleModeSelect} />
      </div>
    </div>
  );
}