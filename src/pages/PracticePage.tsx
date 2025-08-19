import { useState } from 'react';
import QuizModeSelector from '../components/QuizModeSelector';
import Quiz from '../components/Quiz';
import QuizResults from '../components/QuizResults';
import { generateQuizQuestions } from '../services/quizService';
import type { QuizMode, QuizQuestion } from '../types';

export default function PracticePage() {
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
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

  const handleQuizComplete = (results: any) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Práctica
          </h1>
          <p className="text-sm text-gray-600 mt-1">Mejora tus habilidades con diferentes tipos de ejercicios</p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-6 py-4">
        {!selectedMode && !showResults && (
          <div className="max-w-4xl mx-auto">
            {/* Selector de Modos */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <QuizModeSelector 
                onModeSelect={handleModeSelect} 
                onClose={() => {}} // No necesitamos cerrar desde aquí
              />
            </div>
          </div>
        )}

        {selectedMode && !showResults && questions.length > 0 && (
          <>
            {console.log('Renderizando Quiz con:', { selectedMode, questionsCount: questions.length })}
            <div className="max-w-2xl mx-auto">
              <Quiz
                questions={questions}
                mode={selectedMode}
                onComplete={handleQuizComplete}
                onClose={handleCloseQuiz}
              />
            </div>
          </>
        )}

        {selectedMode && !showResults && questions.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No se pudieron generar preguntas</h2>
              <p className="text-gray-600 mb-6">Hubo un problema al generar las preguntas del quiz.</p>
              <button
                onClick={handleCloseQuiz}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {showResults && quizResults && (
          <div className="max-w-2xl mx-auto">
            <QuizResults
              results={quizResults}
              onClose={handleCloseResults}
              onRetry={() => {
                setShowResults(false);
                setSelectedMode(null);
                setQuestions([]);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
