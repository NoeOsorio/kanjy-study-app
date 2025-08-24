import { useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import QuizModeSelector from '../components/QuizModeSelector';
import Quiz from '../components/Quiz';
import QuizResults from '../components/QuizResults';
import PageHeader from '../components/PageHeader';
import { generateQuizQuestions } from '../services/quizService';
import type { QuizMode, QuizQuestion, QuizResult } from '../types';

export default function PracticePage() {
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[] | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const handleModeSelect = (mode: QuizMode) => {
    setSelectedMode(mode);
    setShowResults(false);
    
    // Generar preguntas para el modo seleccionado
    try {
      console.log('Generando preguntas para modo:', mode);
      const generatedQuestions = generateQuizQuestions('1', mode); // Usar lección 1 por defecto
      console.log('Preguntas generadas:', generatedQuestions);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generando preguntas:', error);
      setQuestions([]);
    }
  };

  const handleQuizComplete = (results: QuizResult[]) => {
    setQuizResults(results);
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSelectedMode(null);
    setQuestions([]);
  };

  const handleCloseQuiz = () => {
    setSelectedMode(null);
    setQuestions([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Header */}
      <PageHeader
        title="Práctica"
        description="Mejora tus habilidades con diferentes tipos de ejercicios"
      />

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {!selectedMode && !showResults && (
          <QuizModeSelector 
            onModeSelect={handleModeSelect}
          />
        )}

        {selectedMode && !showResults && questions.length > 0 && (
          <>
            {console.log('Renderizando Quiz con:', { selectedMode, questionsCount: questions.length })}
            <Quiz
              questions={questions}
              mode={selectedMode}
              onComplete={handleQuizComplete}
              onClose={handleCloseQuiz}
            />
          </>
        )}

        {selectedMode && !showResults && questions.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <FiAlertCircle className="w-10 h-10 mx-auto mb-4 text-slate-600" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">No se pudieron generar preguntas</h2>
            <p className="text-slate-600 mb-6">Hubo un problema al generar las preguntas del quiz.</p>
            <button
              onClick={handleCloseQuiz}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Volver
            </button>
          </div>
        )}

        {showResults && quizResults && (
          <QuizResults
            results={quizResults}
            onClose={handleCloseResults}
            onRetry={() => {
              setShowResults(false);
              setSelectedMode(null);
              setQuestions([]);
            }}
          />
        )}
      </div>
    </div>
  );
}